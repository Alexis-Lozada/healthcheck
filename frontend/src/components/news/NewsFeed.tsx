'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SearchBar from '@/components/common/SearchBar';
import { 
  fetchRecentNews, 
  enrichNewsWithPreviews, 
  createInteraction,
  getInteractionCounts,
  getInteractionsForNews
} from '@/services/newsService';
import type { NewsItem } from '@/types/news';

interface NewsFeedProps {
  limit?: number;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  title?: string;
  subtitle?: string;
}

// Convertir NewsItem a RelatedNews format
const convertToRelatedNews = (newsItem: NewsItem) => ({
  title: newsItem.titulo,
  snippet: newsItem.contenido.slice(0, 200) + '...',
  url: newsItem.url || '#',
  classification: newsItem.clasificaciones?.[0]?.resultado || 'unknown',
  confidence: newsItem.clasificaciones?.[0]?.confianza || 0
});

const NewsFeed = ({ 
  limit = 6, 
  showSearch = true, 
  onSearch,
  title = "Noticias recientes",
  subtitle = "Mantente informado con las últimas noticias analizadas por nuestra plataforma"
}: NewsFeedProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interactionCounts, setInteractionCounts] = useState<{[key: number]: {likes: number, dislikes: number, shares: number}}>({});
  
  const router = useRouter();
  const { user } = useAuth();

  // Cargar noticias al iniciar
  useEffect(() => {
    loadNews();
  }, [limit]);

  // Cargar conteos de interacciones cuando las noticias cambian
  useEffect(() => {
    const loadInteractionCounts = async () => {
      if (news.length === 0) return;
      
      try {
        const counts: {[key: number]: {likes: number, dislikes: number, shares: number}} = {};
        
        await Promise.all(
          news.map(async (item) => {
            try {
              const itemCounts = await getInteractionCounts(item.id);
              counts[item.id] = itemCounts;
            } catch (error) {
              console.error(`Error cargando conteos para noticia ${item.id}:`, error);
              counts[item.id] = { likes: 0, dislikes: 0, shares: 0 };
            }
          })
        );
        
        setInteractionCounts(counts);
      } catch (error) {
        console.error('Error cargando conteos de interacciones:', error);
      }
    };

    loadInteractionCounts();
  }, [news]);

  // Función para cargar noticias
  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener noticias
      let newsItems = await fetchRecentNews(limit);
      
      // Enriquecer con previsualizaciones
      newsItems = await enrichNewsWithPreviews(newsItems);
      
      // Obtener interacciones del usuario para cada noticia
      newsItems = await getInteractionsForNews(newsItems);
      
      setNews(newsItems);
    } catch (err) {
      console.error('Error loading news:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar interacciones
  const handleInteraction = async (newsId: number, interactionType: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      await createInteraction(newsId, interactionType);
      
      // Actualizar conteos localmente
      const updatedCounts = await getInteractionCounts(newsId);
      setInteractionCounts(prev => ({
        ...prev,
        [newsId]: updatedCounts
      }));
      
      // Actualizar estado de interacciones del usuario en las noticias
      setNews(prevNews => 
        prevNews.map(item => {
          if (item.id === newsId) {
            const userInteractions = { 
              ...(item.userInteractions || {
                marcar_confiable: false,
                marcar_dudosa: false,
                compartir: false
              })
            };
            
            if (interactionType === 'marcar_confiable') {
              userInteractions.marcar_confiable = !userInteractions.marcar_confiable;
              if (userInteractions.marcar_confiable) {
                userInteractions.marcar_dudosa = false;
              }
            } else if (interactionType === 'marcar_dudosa') {
              userInteractions.marcar_dudosa = !userInteractions.marcar_dudosa;
              if (userInteractions.marcar_dudosa) {
                userInteractions.marcar_confiable = false;
              }
            } else if (interactionType === 'compartir') {
              userInteractions.compartir = true;
            }
            
            return { ...item, userInteractions };
          }
          return item;
        })
      );
    } catch (error) {
      console.error('Error handling interaction:', error);
      alert('Error al procesar tu interacción. Inténtalo de nuevo.');
    }
  };

  // Función para manejar compartir
  const handleShare = async (e: React.MouseEvent, item: NewsItem) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      // Registrar interacción primero
      await handleInteraction(item.id, 'compartir');
      
      // Compartir en Twitter
      const shareUrl = `${window.location.origin}/news/${item.id}`;
      const shareText = `${item.titulo} - Verificado por HealthCheck`;
      const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterShareUrl, '_blank');
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Error al compartir');
    }
  };

  // Función para abrir enlace externo
  const handleExternalLink = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Función para manejar like/dislike
  const handleLikeDislike = async (e: React.MouseEvent, item: NewsItem, type: 'like' | 'dislike') => {
    e.preventDefault();
    e.stopPropagation();
    
    const interactionType = type === 'like' ? 'marcar_confiable' : 'marcar_dudosa';
    await handleInteraction(item.id, interactionType);
  };
  
  // Renderizar esqueletos durante la carga
  const renderSkeletons = () => {
    return Array(limit).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="w-full">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Image Skeleton */}
          <div className="p-3">
            <div className="relative h-40 bg-gray-200 rounded-lg animate-pulse">
              {/* Date Badge Skeleton - Top Left */}
              <div className="absolute top-3 left-3">
                <div className="h-6 w-20 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
              {/* Action Buttons Skeleton - Top Right */}
              <div className="absolute top-3 right-3 flex gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
          {/* Content Skeleton */}
          <div className="px-4 pb-3.5 space-y-2.5">
            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
            {/* Badge Skeleton - Right Aligned */}
            <div className="flex justify-end">
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-32"></div>
            </div>
            {/* Like Buttons and Progress Bar Skeleton */}
            <div className="flex items-center gap-4">
              {/* Like/Dislike Buttons Skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-7 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-7 w-12 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              {/* Progress Bar Skeleton */}
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-4">{subtitle}</p>
          <div className="bg-red-50 p-4 rounded-md text-red-700">
            <p>Error al cargar noticias: {error}</p>
            <button
              onClick={loadNews}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      {/* Barra de búsqueda */}
      {showSearch && (
        <div className="mb-6">
          <SearchBar onSearch={onSearch} />
        </div>
      )}

      {/* Feed de noticias */}
      {news.length === 0 && !loading ? (
        <div className="text-center text-gray-500 py-8">
          No hay noticias disponibles en este momento.
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
            {loading 
              ? renderSkeletons() 
              : news.map((item) => (
                  <div key={item.id} className="w-full">
                    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
                      <div className="block relative">
                        {/* Image Section with Action Buttons */}
                        <div className="p-3">
                          <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden transform-gpu group">
                            {item.preview?.image?.url ? (
                              <img
                                src={item.preview.image.url}
                                alt={item.titulo}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 transition-transform duration-300 group-hover:scale-105">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                              </div>
                            )}
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Date Badge - Top Left */}
                            {item.fecha_publicacion && (
                              <div className="absolute top-3 left-3 will-change-transform z-10">
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-white/90 text-gray-700 backdrop-blur-sm group-hover:bg-white/95 transition-colors duration-300">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {new Date(item.fecha_publicacion).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            )}
                            
                            {/* Action Buttons - Top Right */}
                            <div className="absolute top-3 right-3 flex gap-2 will-change-transform z-10">
                              <button
                                onClick={(e) => handleShare(e, item)}
                                className="relative w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300 flex items-center justify-center group/button"
                                title="Compartir"
                              >
                                <svg className="w-4 h-4 text-gray-600 group-hover/button:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                                <span className="absolute -bottom-1 -right-1 text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center transition-transform duration-300 group-hover/button:scale-110">{interactionCounts[item.id]?.shares || 0}</span>
                              </button>
                              
                              {item.url && item.url !== '#' && (
                                <button
                                  onClick={(e) => handleExternalLink(e, item.url!)}
                                  className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300 flex items-center justify-center group/button"
                                  title="Ver noticia completa"
                                >
                                  <svg className="w-4 h-4 text-gray-600 group-hover/button:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="px-4 pb-3.5">
                          <a href={convertToRelatedNews(item).url} target="_blank" rel="noopener noreferrer">
                            <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                              {item.titulo}
                            </h4>
                          </a>
                          
                          {/* Classification Badge */}
                          {item.clasificaciones?.[0] && (
                            <div className="mb-2.5 flex justify-end">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                item.clasificaciones[0].resultado === 'verdadera' 
                                  ? 'text-green-600 bg-green-50 border border-green-200' 
                                  : 'text-red-600 bg-red-50 border border-red-200'
                              }`}>
                                {item.clasificaciones[0].resultado === 'verdadera' 
                                  ? <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  : <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                }
                                {item.clasificaciones[0].resultado === 'verdadera' ? 'Probablemente verdadera' : 'Probablemente falsa'}
                              </span>
                            </div>
                          )}

                          {/* Confidence Bar */}
                          {item.clasificaciones?.[0]?.confianza && (
                            <div className="flex items-center gap-4">
                              {/* Like/Dislike Buttons */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => handleLikeDislike(e, item, 'like')}
                                  className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${
                                    item.userInteractions?.marcar_confiable 
                                      ? 'text-blue-600 bg-gray-100' 
                                      : 'text-gray-500 hover:bg-gray-100'
                                  }`}
                                  title="Me gusta"
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  <span className="text-sm">{interactionCounts[item.id]?.likes || 0}</span>
                                </button>
                                <button
                                  onClick={(e) => handleLikeDislike(e, item, 'dislike')}
                                  className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${
                                    item.userInteractions?.marcar_dudosa 
                                      ? 'text-blue-600 bg-gray-100' 
                                      : 'text-gray-500 hover:bg-gray-100'
                                  }`}
                                  title="No me gusta"
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                  <span className="text-sm">{interactionCounts[item.id]?.dislikes || 0}</span>
                                </button>
                              </div>
                              
                              {/* Confidence Progress Bar */}
                              <div className="flex-1 flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${
                                      item.clasificaciones[0].resultado === 'verdadera' ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                    style={{ 
                                      width: `${item.clasificaciones[0].confianza <= 1 
                                        ? Math.round(item.clasificaciones[0].confianza * 100) 
                                        : Math.round(item.clasificaciones[0].confianza)
                                      }%` 
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 font-medium">
                                  {item.clasificaciones[0].confianza <= 1 
                                    ? Math.round(item.clasificaciones[0].confianza * 100) 
                                    : Math.round(item.clasificaciones[0].confianza)
                                  }%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;