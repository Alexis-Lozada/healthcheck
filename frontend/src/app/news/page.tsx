'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import SearchBar from '@/components/news/SearchBar';
import NewsCard from '@/components/news/NewsCard';
import { searchNews, getInteractionsForNews, createInteraction, enrichNewsWithPreviews } from '@/services/newsService';
import type { NewsItem } from '@/types/news';
import { useAuth } from '@/context/AuthContext';

export default function NewsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const [searchResults, setSearchResults] = useState<NewsItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  // Cargar resultados de búsqueda cuando cambia la consulta o la página
  useEffect(() => {
    if (query) {
      fetchSearchResults();
    } else {
      fetchRecentNews();
    }
  }, [query, page]);

  // Buscar noticias
  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { news, totalPages: total } = await searchNews(query, page);
      
      // Enriquecer con previsualizaciones
      let enrichedNews = await enrichNewsWithPreviews(news);
      
      // Si hay usuario, obtener interacciones
      if (user) {
        enrichedNews = await getInteractionsForNews(enrichedNews);
      }
      
      setSearchResults(enrichedNews);
      setTotalPages(total);
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Cargar noticias recientes si no hay consulta
  const fetchRecentNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular llamada a API para obtener noticias recientes
      const response = await fetch(`/api/news?page=${page}&limit=12`);
      
      if (!response.ok) {
        throw new Error('Error al cargar noticias');
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        // Enriquecer con previsualizaciones
        let enrichedNews = await enrichNewsWithPreviews(data.data.news);
        
        // Si hay usuario, obtener interacciones
        if (user) {
          enrichedNews = await getInteractionsForNews(enrichedNews);
        }
        
        setSearchResults(enrichedNews);
        setTotalPages(data.data.totalPages);
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Manejar nueva búsqueda
  const handleSearch = (newQuery: string) => {
    router.push(`/news?q=${encodeURIComponent(newQuery)}&page=1`);
  };

  // Manejar cambio de página
  const handlePageChange = (newPage: number) => {
    const url = query
      ? `/news?q=${encodeURIComponent(query)}&page=${newPage}`
      : `/news?page=${newPage}`;
    
    router.push(url);
  };

  // Manejar interacciones con noticias
  const handleInteraction = async (newsId: number, interactionType: string) => {
    if (!user) {
      // Redirigir a login o mostrar mensaje
      alert('Debes iniciar sesión para interactuar con noticias');
      return;
    }
    
    try {
      // Crear interacción en el backend
      await createInteraction(newsId, interactionType);
      
      // Actualizar el estado local para reflejar el cambio inmediatamente
      setSearchResults(prevNews => 
        prevNews.map(item => {
          if (item.id === newsId) {
            // Clonar el objeto de interacciones o crear uno nuevo
            const userInteractions = { 
              ...(item.userInteractions || {
                marcar_confiable: false,
                marcar_dudosa: false,
                compartir: false
              })
            };
            
            // Actualizar según el tipo de interacción
            if (interactionType === 'marcar_confiable') {
              userInteractions.marcar_confiable = !userInteractions.marcar_confiable;
              // Si marcamos como confiable, desmarcamos como dudosa
              if (userInteractions.marcar_confiable) {
                userInteractions.marcar_dudosa = false;
              }
            } else if (interactionType === 'marcar_dudosa') {
              userInteractions.marcar_dudosa = !userInteractions.marcar_dudosa;
              // Si marcamos como dudosa, desmarcamos como confiable
              if (userInteractions.marcar_dudosa) {
                userInteractions.marcar_confiable = false;
              }
            } else if (interactionType === 'compartir') {
              userInteractions.compartir = true; // Compartir siempre es true
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {query ? `Resultados para "${query}"` : 'Todas las noticias'}
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {query 
              ? `Explorando información verificada sobre "${query}"`
              : 'Explora noticias analizadas y verificadas por nuestra plataforma'
            }
          </p>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="mt-8 max-w-3xl mx-auto">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Buscar por palabras clave..."
            redirectToSearchPage={false}
          />
        </div>
        
        {/* Filtros */}
        <div className="mt-6 max-w-3xl mx-auto flex flex-wrap justify-center gap-2">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              !query ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => router.push('/news')}
          >
            Todas
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
              query === 'clasificacion:verdadera' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => router.push('/news?q=clasificacion:verdadera&page=1')}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Verificadas
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
              query === 'clasificacion:falsa' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => router.push('/news?q=clasificacion:falsa&page=1')}
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Falsas
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
              query === 'clasificacion:dudosa' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => router.push('/news?q=clasificacion:dudosa&page=1')}
          >
            <Info className="h-4 w-4 mr-1" />
            Dudosas
          </button>
        </div>
        
        {/* Sección de resultados */}
        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">
              <p>Error: {error}</p>
              <button
                onClick={query ? fetchSearchResults : fetchRecentNews}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">
                No se encontraron resultados para tu búsqueda.
              </p>
              <p className="text-gray-500 mt-2">
                Prueba con otros términos o filtros.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((item) => (
                <NewsCard
                  key={item.id}
                  news={item}
                  onInteraction={handleInteraction}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <nav className="inline-flex shadow-sm -space-x-px" aria-label="Paginación">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  page === 1 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Anterior</span>
                &larr;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    pageNum === page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  page === totalPages 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Siguiente</span>
                &rarr;
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}