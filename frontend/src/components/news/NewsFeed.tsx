'use client';

import { useState, useEffect } from 'react';
import SearchBar from '../common/SearchBar';
import RelatedNewsCard from './RelatedNewsCard';
import { fetchRecentNews, enrichNewsWithPreviews } from '@/services/newsService';
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

  // Cargar noticias al iniciar
  useEffect(() => {
    loadNews();
  }, [limit]);

  // Función para cargar noticias
  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener noticias
      let newsItems = await fetchRecentNews(limit);
      
      // Enriquecer con previsualizaciones
      newsItems = await enrichNewsWithPreviews(newsItems);
      
      setNews(newsItems);
    } catch (err) {
      console.error('Error loading news:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar esqueletos durante la carga
  const renderSkeletons = () => {
    return Array(limit).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="w-full">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Image Skeleton */}
          <div className="p-3">
            <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          {/* Content Skeleton */}
          <div className="px-4 pb-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded-full animate-pulse w-32"></div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
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
                      <a href={convertToRelatedNews(item).url} target="_blank" rel="noopener noreferrer" className="block">
                        {/* Image Section */}
                        <div className="p-3">
                          <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
                            {item.preview?.image?.url ? (
                              <img
                                src={item.preview.image.url}
                                alt={item.titulo}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="px-4 pb-4">
                          <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                            {item.titulo}
                          </h4>
                          
                          {/* Classification Badge */}
                          {item.clasificaciones?.[0] && (
                            <div className="mb-3">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                item.clasificaciones[0].resultado === 'verdadera' 
                                  ? 'text-green-600 bg-green-50 border-green-200' 
                                  : 'text-red-600 bg-red-50 border-red-200'
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
                            <div className="mb-3">
                              <div className="flex items-center gap-2">
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
                      </a>
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