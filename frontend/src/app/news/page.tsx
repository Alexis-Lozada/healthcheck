'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, Filter } from 'lucide-react';
import SearchBar from '@/components/news/SearchBar';
import NewsCard from '@/components/news/NewsCard';
import NewsCardSkeleton from '@/components/news/NewsCardSkeleton';
import { 
  searchNews, 
  getInteractionsForNews, 
  createInteraction, 
  enrichNewsWithPreviews,
  fetchTemas,
  fetchFuentes
} from '@/services/newsService';
import type { NewsItem } from '@/types/news';
import { useAuth } from '@/context/AuthContext';

export default function NewsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  // Estado para parámetros de búsqueda
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [clasificacion, setClasificacion] = useState(searchParams.get('clasificacion') || '');
  const [page, setPage] = useState(1);
  const [temaId, setTemaId] = useState<number | null>(searchParams.get('temaId') ? parseInt(searchParams.get('temaId')!) : null);
  const [fuenteId, setFuenteId] = useState<number | null>(searchParams.get('fuenteId') ? parseInt(searchParams.get('fuenteId')!) : null);
  const [fechaInicio, setFechaInicio] = useState(searchParams.get('fechaInicio') || '');
  const [fechaFin, setFechaFin] = useState(searchParams.get('fechaFin') || '');

  // Estados para listados de filtros
  const [temas, setTemas] = useState<{id: number, nombre: string}[]>([]);
  const [fuentes, setFuentes] = useState<{id: number, nombre: string}[]>([]);

  // Estados de la página
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para mostrar/ocultar filtros
  const [showFilters, setShowFilters] = useState(false);

  // Observer para el scroll infinito
  const observer = useRef<IntersectionObserver | null>(null);
  const lastNewsElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        // Pequeño retraso para evitar múltiples activaciones
        setTimeout(() => {
          setPage(prevPage => prevPage + 1);
        }, 100);
      }
    }, { 
      rootMargin: '0px 0px 200px 0px', // Cargar un poco antes de llegar al final
      threshold: 0.1 // Reducido para activarse más temprano
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Cargar temas y fuentes al inicio
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [temasData, fuentesData] = await Promise.all([
          fetchTemas(),
          fetchFuentes()
        ]);
        setTemas(temasData);
        setFuentes(fuentesData);
      } catch (error) {
        console.error('Error cargando filtros:', error);
      }
    };

    loadFilters();
  }, []);

  // Actualizar URL con parámetros de búsqueda sin recargar la página
  useEffect(() => {
    if (!initialLoad) {
      const params = new URLSearchParams();
      
      if (query) params.set('q', query);
      if (clasificacion) params.set('clasificacion', clasificacion);
      if (temaId) params.set('temaId', temaId.toString());
      if (fuenteId) params.set('fuenteId', fuenteId.toString());
      if (fechaInicio) params.set('fechaInicio', fechaInicio);
      if (fechaFin) params.set('fechaFin', fechaFin);
      
      const newUrl = `/news${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [query, clasificacion, temaId, fuenteId, fechaInicio, fechaFin, initialLoad]);

  // Cargar noticias cuando cambian los parámetros
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await searchNews(
          query || undefined, 
          clasificacion || undefined, 
          page,
          temaId || undefined,
          fechaInicio || undefined,
          fechaFin || undefined,
          fuenteId || undefined
        );
        
        // Enriquecer con previsualizaciones
        let enrichedNews = await enrichNewsWithPreviews(result.news);
        
        // Si hay usuario, obtener interacciones
        if (user) {
          enrichedNews = await getInteractionsForNews(enrichedNews);
        }
        
        // Si es la primera página, reemplazar; sino, agregar evitando duplicados
        if (page === 1) {
          setNewsItems(enrichedNews);
        } else {
          setNewsItems(prevItems => {
            // Obtener IDs de elementos existentes
            const existingIds = new Set(prevItems.map(item => item.id));
            
            // Filtrar elementos nuevos para evitar duplicados
            const uniqueNewItems = enrichedNews.filter(item => !existingIds.has(item.id));
            
            return [...prevItems, ...uniqueNewItems];
          });
        }
        
        setTotalPages(result.totalPages);
        setHasMore(page < result.totalPages);
        setInitialLoad(false);
      } catch (err) {
        console.error('Error loading news:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [query, clasificacion, page, temaId, fuenteId, fechaInicio, fechaFin, user]);

  // Aplicar filtros
  const applyFilters = () => {
    // Resetear a la primera página y vaciar los items actuales
    setPage(1);
    setNewsItems([]);
    setHasMore(true);
    
    // El useEffect detectará los cambios en los filtros y cargará las noticias
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<any>>) => 
    (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const value = e.target.value;
      setter(value === '' ? null : 
        (e.target.type === 'number' ? parseInt(value) : value)
      );
    };

  // Manejar interacciones con noticias
  const handleInteraction = async (newsId: number, interactionType: string) => {
    if (!user) {
      alert('Debes iniciar sesión para interactuar con noticias');
      return;
    }
    
    try {
      await createInteraction(newsId, interactionType);
      
      // Actualizar estado local de interacciones
      setNewsItems(prevNews => 
        prevNews.map(item => {
          if (item.id === newsId) {
            const userInteractions = { 
              ...(item.userInteractions || {
                marcar_confiable: false,
                marcar_dudosa: false,
                compartir: false
              })
            };
            
            // Lógica de actualización de interacciones
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

  // Renderizar esqueletos para carga inicial
  const renderInitialSkeletons = () => {
    return Array(12).fill(0).map((_, index) => (
      <NewsCardSkeleton key={`skeleton-${index}`} />
    ));
  };

  // Renderizar esqueletos para carga adicional (al final de la lista)
  const renderLoadMoreSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <NewsCardSkeleton key={`skeleton-loadmore-${index}`} />
    ));
  };

  // Renderizar componente
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Noticias
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Explora noticias analizadas y verificadas por nuestra plataforma
          </p>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="mt-8 max-w-3xl mx-auto">
          <SearchBar 
            onSearch={(newQuery) => {
              if (newQuery !== query) {
                setQuery(newQuery);
                // Resetear página y limpiar noticias actuales
                setPage(1);
                setNewsItems([]);
                setHasMore(true);
              }
            }}
            placeholder="Buscar por palabras clave..."
            redirectToSearchPage={false}
          />
        </div>
        
        {/* Filtros */}
        <div className="mt-6 max-w-3xl mx-auto">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition"
          >
            <Filter className="mr-2 h-5 w-5" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filtro de Clasificación */}
              <select 
                value={clasificacion}
                onChange={(e) => setClasificacion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Todas las clasificaciones</option>
                <option value="verdadera">Verificadas</option>
                <option value="falsa">Falsas</option>
                <option value="dudosa">Dudosas</option>
              </select>

              {/* Filtro de Tema */}
              <select 
                value={temaId || ''}
                onChange={handleFilterChange(setTemaId)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos los temas</option>
                {temas.map(tema => (
                  <option key={tema.id} value={tema.id}>
                    {tema.nombre}
                  </option>
                ))}
              </select>

              {/* Filtro de Fuente */}
              <select 
                value={fuenteId || ''}
                onChange={handleFilterChange(setFuenteId)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Todas las fuentes</option>
                {fuentes.map(fuente => (
                  <option key={fuente.id} value={fuente.id}>
                    {fuente.nombre}
                  </option>
                ))}
              </select>

              {/* Filtros de Fecha */}
              <div className="flex space-x-2">
                <input 
                  type="date" 
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Fecha desde"
                />
                <input 
                  type="date" 
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Fecha hasta"
                />
              </div>

              {/* Botón de aplicar filtros */}
              <button 
                onClick={applyFilters}
                className="col-span-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Aplicar Filtros'}
              </button>
            </div>
          )}
        </div>
        
        {/* Sección de resultados */}
        <div className="mt-10">
          {error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">
              <p>Error: {error}</p>
              <button
                onClick={() => {
                  setPage(1);
                  setNewsItems([]);
                  setHasMore(true);
                }}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Mostrar mensajes de carga inicial o sin resultados */}
                {initialLoad && newsItems.length === 0 ? (
                  renderInitialSkeletons()
                ) : newsItems.length === 0 && !loading ? (
                  <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-lg">
                      No se encontraron resultados para tu búsqueda.
                    </p>
                    <p className="text-gray-500 mt-2">
                      Prueba con otros términos o filtros.
                    </p>
                  </div>
                ) : (
                  // Mostrar resultados
                  newsItems.map((item, index) => {
                    // Crear una key única combinando el ID y el índice
                    const uniqueKey = `news-${item.id}-${index}`;
                    
                    // Si es el último elemento, añadir la referencia para el observador
                    if (index === newsItems.length - 1) {
                      return (
                        <div key={uniqueKey} ref={lastNewsElementRef}>
                          <NewsCard
                            news={item}
                            onInteraction={handleInteraction}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <NewsCard
                          key={uniqueKey}
                          news={item}
                          onInteraction={handleInteraction}
                        />
                      );
                    }
                  })
                )}
                
                {/* Mostrar indicador de carga al cargar más elementos */}
                {loading && !initialLoad && hasMore && (
                  <>
                    {renderLoadMoreSkeletons()}
                  </>
                )}
              </div>
              
              {/* Mensaje cuando no hay más resultados */}
              {!loading && !hasMore && newsItems.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay más resultados para mostrar</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}