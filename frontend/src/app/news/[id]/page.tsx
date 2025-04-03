'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  AlertTriangle, 
  CheckCircle, 
  Info 
} from 'lucide-react';
import { 
  getNewsById, 
  createInteraction, 
  getInteractionCounts,
  getInteractionStatus
} from '@/services/newsService';
import type { NewsItem } from '@/types/news';

export default function NewsDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [news, setNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userInteractions, setUserInteractions] = useState({
        marcar_confiable: false,
        marcar_dudosa: false,
        compartir: false
    });
    const [interactionCounts, setInteractionCounts] = useState({
        likes: 0,
        dislikes: 0,
        shares: 0
    });

    useEffect(() => {
        const fetchNewsDetails = async () => {
            try {
                setLoading(true);
                
                // Obtener detalles de la noticia
                const newsData = await getNewsById(Number(id));
                setNews(newsData);

                // Obtener conteos de interacciones
                const counts = await getInteractionCounts(Number(id));
                setInteractionCounts(counts);

                // Obtener estado de interacciones del usuario
                if (user) {
                    const interactionStatus = await getInteractionStatus(Number(id));
                    setUserInteractions(interactionStatus);
                }
            } catch (err) {
                console.error('Error fetching news details:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchNewsDetails();
        }
    }, [id, user]);

    const handleInteraction = async (interactionType: 'marcar_confiable' | 'marcar_dudosa' | 'compartir') => {
        if (!user) {
            alert('Debes iniciar sesión para interactuar');
            return;
        }

        try {
            const result = await createInteraction(Number(id), interactionType);
            
            // Actualizar conteos e interacciones
            const updatedCounts = await getInteractionCounts(Number(id));
            setInteractionCounts(updatedCounts);

            // Actualizar estado de interacciones
            const updatedInteractions = await getInteractionStatus(Number(id));
            setUserInteractions(updatedInteractions);
        } catch (error) {
            console.error('Error en interacción:', error);
            alert('Error al procesar tu interacción');
        }
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/news/${id}`;
        const shareText = `${news?.titulo} - Verificado por HealthCheck`;

        // Registrar interacción de compartir
        await handleInteraction('compartir');

        // Usar Web Share API si está disponible
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'HealthCheck - Noticia Verificada',
                    text: shareText,
                    url: shareUrl
                });
            } catch (error) {
                console.error('Error compartiendo:', error);
                // Fallback: copiar al portapapeles
                await navigator.clipboard.writeText(shareUrl);
                alert('Enlace copiado al portapapeles');
            }
        } else {
            // Fallback para navegadores que no soportan Web Share API
            const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(twitterShareUrl, '_blank');
        }
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
        let Icon = Info;
        
        switch (classification.resultado) {
            case 'verdadera':
                badgeColor = 'bg-green-100 text-green-800';
                Icon = CheckCircle;
                break;
            case 'falsa':
                badgeColor = 'bg-red-100 text-red-800';
                Icon = AlertTriangle;
                break;
            case 'dudosa':
                badgeColor = 'bg-yellow-100 text-yellow-800';
                Icon = Info;
                break;
        }
        
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>
                <Icon className="mr-2 h-4 w-4" />
                {classification.resultado.toUpperCase()} ({Math.round(classification.confianza)}% de confianza)
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !news) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 flex justify-center items-center">
                <div className="bg-red-50 p-8 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
                    <p className="text-red-600 mb-6">{error || 'Noticia no encontrada'}</p>
                    <button
                        onClick={() => router.push('/news')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Volver a noticias
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Encabezado de la noticia */}
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">{news.titulo}</h1>
                            {getClassificationBadge()}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            {formatDate(news.fecha_publicacion)}
                        </p>
                    </div>

                    {/* Contenido de la noticia */}
                    <div className="px-6 py-4">
                        <div className="prose max-w-none">
                            {news.contenido.split('\n').map((paragraph, idx) => (
                                paragraph ? <p key={idx}>{paragraph}</p> : <br key={idx} />
                            ))}
                        </div>

                        {/* Información adicional */}
                        {news.fuente && (
                            <div className="mt-6 bg-blue-50 p-4 rounded-md">
                                <h3 className="text-md font-semibold text-blue-800 mb-2">Fuente</h3>
                                <p className="text-blue-700">
                                    {news.fuente.nombre} 
                                    {news.fuente.confiabilidad && ` - Confiabilidad: ${Math.round(news.fuente.confiabilidad * 100)}%`}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Acciones de interacción */}
                    {user && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleInteraction('marcar_confiable')}
                                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                                        userInteractions.marcar_confiable 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                    }`}
                                >
                                    <ThumbsUp className="mr-2 h-4 w-4" />
                                    Confiable ({interactionCounts.likes})
                                </button>
                                <button
                                    onClick={() => handleInteraction('marcar_dudosa')}
                                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                                        userInteractions.marcar_dudosa 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                    }`}
                                >
                                    <ThumbsDown className="mr-2 h-4 w-4" />
                                    Dudosa ({interactionCounts.dislikes})
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                                >
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Compartir ({interactionCounts.shares})
                                </button>
                            </div>
                            <button
                                onClick={() => router.push('/news')}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Volver a noticias
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}