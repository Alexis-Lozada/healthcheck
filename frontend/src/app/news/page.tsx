// src/app/news/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Definimos la URL base de la API Gateway
const API_URL = 'http://localhost:3003/api';

interface NewsItem {
  id: number;
  titulo: string;
  contenido: string;
  url?: string;
  fecha_publicacion?: string;
  clasificaciones?: Array<{
    resultado: 'verdadera' | 'falsa' | 'dudosa';
    confianza: number;
  }>;
}

interface NewsResponse {
  status: string;
  data: {
    total: number;
    currentPage: number;
    totalPages: number;
    news: NewsItem[];
  };
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const { user } = useAuth();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${API_URL}/news?page=${page}&limit=12`);
        
        if (!response.ok) {
          throw new Error('Error al cargar noticias');
        }
        
        const data: NewsResponse = await response.json();
        
        if (data.status === 'success' && data.data) {
          setNews(data.data.news);
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
    
    fetchNews();
  }, [page]);

  const getClassificationBadge = (newsItem: NewsItem) => {
    if (!newsItem.clasificaciones || newsItem.clasificaciones.length === 0) {
      return null;
    }
    
    const classification = newsItem.clasificaciones[0];
    
    let badgeColor = 'bg-gray-100 text-gray-800';
    if (classification.resultado === 'verdadera') {
      badgeColor = 'bg-green-100 text-green-800';
    } else if (classification.resultado === 'falsa') {
      badgeColor = 'bg-red-100 text-red-800';
    } else if (classification.resultado === 'dudosa') {
      badgeColor = 'bg-yellow-100 text-yellow-800';
    }
    
    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${badgeColor}`}>
        {classification.resultado.toUpperCase()}
      </span>
    );
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha desconocida';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/news?page=${newPage}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Noticias
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Explora noticias analizadas por nuestra plataforma
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Noticias
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Explora noticias analizadas por nuestra plataforma
            </p>
          </div>
          <div className="mt-10 bg-red-50 p-4 rounded-md text-red-700 text-center">
            <p>Error al cargar noticias: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Noticias
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Explora noticias analizadas por nuestra plataforma
          </p>
        </div>

        {news.length === 0 ? (
          <div className="mt-10 text-center text-gray-500">
            No hay noticias disponibles en este momento.
          </div>
        ) : (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <div key={item.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white">
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getClassificationBadge(item)}
                      <p className="text-sm text-gray-500">
                        {formatDate(item.fecha_publicacion)}
                      </p>
                    </div>
                    <Link href={`/news/${item.id}`}>
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {item.titulo}
                      </h3>
                    </Link>
                    <p className="mt-3 text-base text-gray-500">
                      {truncateText(item.contenido)}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center">
                    {item.url && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Ver fuente original →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
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
                ←
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
                →
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}