// src/app/news/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNewsInteraction } from '@/hooks/useNewsInteraction'; // Importar el hook

const API_URL = 'http://localhost:3003/api';

interface NewsDetail {
    id: number;
    titulo: string;
    contenido: string;
    url?: string;
    fecha_publicacion?: string;
    fuente?: {
        nombre: string;
        url: string;
        confiabilidad: number;
    };
    clasificaciones?: Array<{
        resultado: 'verdadera' | 'falsa' | 'dudosa';
        confianza: number;
        explicacion?: string;
    }>;
}

export default function NewsDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [news, setNews] = useState<NewsDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const { loading: interactionLoading, error: interactionError, success: interactionSuccess, createInteraction } = useNewsInteraction(); // Usar el hook

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                setLoading(true);
                
                const response = await fetch(`${API_URL}/news/${id}`);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Noticia no encontrada');
                    }
                    throw new Error('Error al cargar la noticia');
                }
                
                const data = await response.json();
                
                if (data.status === 'success' && data.data && data.data.news) {
                    setNews(data.data.news);
                } else {
                    throw new Error('Formato de respuesta inesperado');
                }
            } catch (err) {
                console.error('Error fetching news detail:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchNewsDetail();
        }
    }, [id]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Fecha desconocida';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getClassificationBadge = () => {
        if (!news || !news.clasificaciones || news.clasificaciones.length === 0) {
            return (
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                    Sin clasificar
                </span>
            );
        }
        
        const classification = news.clasificaciones[0];
        
        let badgeColor = 'bg-gray-100 text-gray-800';
        if (classification.resultado === 'verdadera') {
            badgeColor = 'bg-green-100 text-green-800';
        } else if (classification.resultado === 'falsa') {
            badgeColor = 'bg-red-100 text-red-800';
        } else if (classification.resultado === 'dudosa') {
            badgeColor = 'bg-yellow-100 text-yellow-800';
        }
        
        return (
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${badgeColor}`}>
                {classification.resultado.toUpperCase()} ({Math.round(classification.confianza)}% de confianza)
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !news) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 p-4 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Error: {error || 'Noticia no encontrada'}
                                </h3>
                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        onClick={() => router.push('/news')}
                                    >
                                        Volver a noticias
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate">
                                {news.titulo}
                            </h1>
                            <div className="mt-2 sm:mt-0">{getClassificationBadge()}</div>
                        </div>
                        <p className="mt-2 max-w-2xl text-sm text-gray-500">
                            {formatDate(news.fecha_publicacion)}
                        </p>
                    </div>
                    
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <div className="prose prose-blue max-w-none">
                            {news.contenido.split('\n').map((paragraph, idx) => (
                                paragraph ? <p key={idx} className="my-4">{paragraph}</p> : <br key={idx} />
                            ))}
                        </div>
                        
                        {news.clasificaciones && news.clasificaciones.length > 0 && news.clasificaciones[0].explicacion && (
                            <div className="mt-6 bg-blue-50 p-4 rounded-md">
                                <h3 className="text-md font-medium text-blue-800">Análisis de veracidad:</h3>
                                <p className="mt-2 text-sm text-blue-700">
                                    {news.clasificaciones[0].explicacion}
                                </p>
                            </div>
                        )}
                        
                        {news.fuente && (
                            <div className="mt-6 flex items-center">
                                <div className="text-sm text-gray-500">
                                    <span className="font-medium">Fuente:</span>{' '}
                                    {news.fuente.url ? (
                                        <a 
                                            href={news.fuente.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            {news.fuente.nombre}
                                        </a>
                                    ) : (
                                        news.fuente.nombre
                                    )}
                                </div>
                                {news.fuente.confiabilidad && (
                                    <div className="ml-4 text-sm">
                                        <span className="font-medium">Confiabilidad:</span>{' '}
                                        {Math.round(news.fuente.confiabilidad * 100)}%
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => router.push('/news')}
                            >
                                ← Volver a noticias
                            </button>
                            
                            {user && (
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        onClick={async () => {
                                            await createInteraction(news.id, 'marcar_confiable');
                                        }}
                                    >
                                        Confiable
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        onClick={async () => {
                                            await createInteraction(news.id, 'marcar_dudosa');
                                        }}
                                    >
                                        Dudosa
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        onClick={async () => {
                                            await createInteraction(news.id, 'compartir');
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: news.titulo,
                                                    text: `Verificado por HealthCheck: ${news.titulo}`,
                                                    url: window.location.href
                                                }).catch(console.error);
                                            } else {
                                                navigator.clipboard.writeText(window.location.href)
                                                    .then(() => alert('¡Enlace copiado al portapapeles!'))
                                                    .catch(console.error);
                                            }
                                        }}
                                    >
                                        Compartir
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}