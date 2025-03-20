// src/components/features/Logout-user/LatestNewsSection.jsx
import { AlertTriangle, Check, Clock, HelpCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
// Eliminada importación de react-router, que no está disponible en Next.js

const LatestNewsSection = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                // Determinar parámetro de filtrado según la pestaña activa
                let queryParams = '?limit=5';
                if (activeTab === 'true') queryParams += '&result=verdadera';
                if (activeTab === 'false') queryParams += '&result=falsa';
                if (activeTab === 'uncertain') queryParams += '&result=dudosa';
                
                const response = await fetch(`/api/healthcheck/latest${queryParams}`);
                
                if (!response.ok) {
                    throw new Error('Error obteniendo noticias');
                }
                
                const data = await response.json();
                
                // Verificar que data.data es un array antes de asignarlo
                if (Array.isArray(data.data)) {
                    setNews(data.data);
                } else {
                    console.error("Los datos recibidos no son un array:", data);
                    setNews([]);
                }
            } catch (err) {
                console.error('Error:', err);
                setError('No pudimos cargar las noticias recientes');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [activeTab]);

    // Obtener ícono según el resultado
    const getStatusIcon = (result) => {
        switch(result) {
            case 'verdadera':
                return <Check className="text-green-500" size={20} />;
            case 'falsa':
                return <AlertTriangle className="text-red-500" size={20} />;
            case 'dudosa':
                return <HelpCircle className="text-yellow-500" size={20} />;
            default:
                return <Clock className="text-gray-500" size={20} />;
        }
    };

    // Obtener clase de borde según el resultado
    const getBorderClass = (result) => {
        switch(result) {
            case 'verdadera':
                return 'border-l-green-500';
            case 'falsa':
                return 'border-l-red-500';
            case 'dudosa':
                return 'border-l-yellow-500';
            default:
                return 'border-l-gray-300';
        }
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Truncar texto largo
    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const handleNewsClick = (newsItem) => {
        // Aquí podrías implementar la navegación a una página de detalle
        // Por ahora solo mostraremos un alert
        alert(`Has seleccionado: ${newsItem.titulo}`);
    };

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Últimas verificaciones</h2>
                
                {/* Tabs para filtrar */}
                <div className="flex justify-center mb-8 border-b">
                    <button 
                        className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        Todas
                    </button>
                    <button 
                        className={`px-4 py-2 font-medium ${activeTab === 'true' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('true')}
                    >
                        Verdaderas
                    </button>
                    <button 
                        className={`px-4 py-2 font-medium ${activeTab === 'false' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('false')}
                    >
                        Falsas
                    </button>
                    <button 
                        className={`px-4 py-2 font-medium ${activeTab === 'uncertain' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('uncertain')}
                    >
                        Dudosas
                    </button>
                </div>
                
                {/* Mostrar cargando */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="animate-spin text-blue-600 mr-2" size={24} />
                        <span className="text-gray-600">Cargando noticias recientes...</span>
                    </div>
                )}
                
                {/* Mostrar error */}
                {error && !loading && (
                    <div className="text-center text-red-600 py-8">
                        {error}
                    </div>
                )}
                
                {/* Lista de noticias */}
                {!loading && !error && (
                    <div className="space-y-4 max-w-3xl mx-auto">
                        {!news || news.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                No hay noticias recientes disponibles.
                            </div>
                        ) : (
                            news.map((item) => (
                                <div 
                                    key={item.id} 
                                    className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${getBorderClass(item.resultado)} hover:shadow-lg transition-shadow cursor-pointer`}
                                    onClick={() => handleNewsClick(item)}
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{truncateText(item.titulo, 120)}</h3>
                                        <div className="flex items-center">
                                            {getStatusIcon(item.resultado)}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap text-sm text-gray-600 mt-2">
                                        {item.fuente && item.fuente.nombre && (
                                            <span className="mr-4">
                                                Fuente: {item.fuente.nombre}
                                            </span>
                                        )}
                                        
                                        {item.tema && item.tema.nombre && (
                                            <span className="mr-4">
                                                Tema: {item.tema.nombre}
                                            </span>
                                        )}
                                        
                                        {item.fecha_analisis && (
                                            <span>
                                                Verificado: {formatDate(item.fecha_analisis)}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {item.confianza !== null && item.confianza !== undefined && (
                                        <div className="mt-3">
                                            <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                                                <span>Nivel de confianza</span>
                                                <span>{item.confianza}%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${
                                                        item.resultado === 'verdadera' ? 'bg-green-500' : 
                                                        item.resultado === 'falsa' ? 'bg-red-500' : 'bg-yellow-500'
                                                    }`} 
                                                    style={{ width: `${Math.min(100, Math.max(0, item.confianza))}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LatestNewsSection;