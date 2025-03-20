// src/components/features/Reports/ReportesSection.jsx
import { AlertCircle, Check, Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

const ReportesSection = () => {
    const [activeTab, setActiveTab] = useState('nuevo');
    const [tipoContenido, setTipoContenido] = useState('');
    const [url, setUrl] = useState('');
    const [comentario, setComentario] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    
    const [fuentes, setFuentes] = useState([]);
    const [loadingFuentes, setLoadingFuentes] = useState(false);
    
    // Cargar fuentes verificadas
    useEffect(() => {
        if (activeTab === 'fuentes') {
            fetchFuentes();
        }
    }, [activeTab]);
    
    const fetchFuentes = async () => {
        setLoadingFuentes(true);
        
        try {
            const response = await fetch(`/api/reportes?tipo=fuentes`);
            
            if (!response.ok) {
                throw new Error('Error obteniendo fuentes verificadas');
            }
            
            const data = await response.json();
            
            if (data.success && Array.isArray(data.data)) {
                setFuentes(data.data);
            } else {
                console.error('Formato de datos incorrecto:', data);
                setFuentes([]);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoadingFuentes(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!tipoContenido || !url) {
            setError('Por favor completa todos los campos requeridos');
            return;
        }
        
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            const response = await fetch('/api/reportes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: url,
                    tipo: tipoContenido,
                    comentario: comentario
                }),
            });
            
            if (!response.ok) {
                throw new Error('Error enviando reporte');
            }
            
            const data = await response.json();
            
            if (data.success) {
                setSuccess(true);
                setTipoContenido('');
                setUrl('');
                setComentario('');
            } else {
                setError(data.error || 'Hubo un error al enviar tu reporte');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('No pudimos procesar tu reporte. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
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
    
    // Formatear porcentaje
    const formatPercentage = (value) => {
        if (value === null || value === undefined) return 'N/A';
        return `${Math.round(value * 100)}%`;
    };
    
    return (
        <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sistema de reportes</h2>
            <p className="text-gray-600 mb-6">
                Ayúdanos a combatir la desinformación reportando fuentes dudosas o verificando la confiabilidad de sitios web.
            </p>
            
            {/* Navegación por pestañas */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('nuevo')}
                    className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                        activeTab === 'nuevo' 
                        ? 'border-b-2 border-blue-600 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Plus size={16} className="inline mr-1" />
                    Nuevo reporte
                </button>
                <button
                    onClick={() => setActiveTab('fuentes')}
                    className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                        activeTab === 'fuentes' 
                        ? 'border-b-2 border-blue-600 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Check size={16} className="inline mr-1" />
                    Fuentes verificadas
                </button>
            </div>
            
            {/* Contenido de pestañas */}
            {activeTab === 'nuevo' && (
                <div>
                    {success ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <div className="flex">
                                <Check className="text-green-500 mr-2 flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium text-green-800">¡Reporte enviado!</h3>
                                    <p className="text-green-700 mt-1">
                                        Gracias por tu contribución. Nuestro equipo revisará la información reportada lo antes posible.
                                    </p>
                                    <button 
                                        className="mt-3 text-sm text-green-800 font-medium hover:text-green-900"
                                        onClick={() => setSuccess(false)}
                                    >
                                        Enviar otro reporte
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                <div className="flex">
                                    <AlertCircle className="text-yellow-600 mr-2 flex-shrink-0" size={20} />
                                    <p className="text-yellow-700 text-sm">
                                        Tu contribución es importante. Los reportes ayudan a mejorar nuestro sistema de detección de noticias falsas y a proteger a más personas de la desinformación en temas de salud.
                                    </p>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de contenido <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={tipoContenido}
                                    onChange={(e) => setTipoContenido(e.target.value)}
                                    required
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="sitio_web">Sitio web</option>
                                    <option value="articulo">Artículo o noticia</option>
                                    <option value="social_media">Publicación en redes sociales</option>
                                    <option value="video">Video</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL o fuente <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="https://ejemplo.com/noticia"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Ingresa la URL completa o el nombre de la fuente que deseas reportar
                                </p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Comentario
                                </label>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                    placeholder="Explica por qué consideras que esta fuente contiene información dudosa o falsa..."
                                    value={comentario}
                                    onChange={(e) => setComentario(e.target.value)}
                                ></textarea>
                            </div>
                            
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                                    <AlertCircle className="inline mr-1" size={16} />
                                    {error}
                                </div>
                            )}
                            
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={20} />
                                            Enviando...
                                        </>
                                    ) : (
                                        "Enviar reporte"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
            
            {activeTab === 'fuentes' && (
                <div>
                    {loadingFuentes ? (
                        <div className="text-center py-10">
                            <Loader2 className="animate-spin mx-auto mb-3 text-blue-600" size={32} />
                            <p className="text-gray-600">Cargando fuentes verificadas...</p>
                        </div>
                    ) : fuentes.length === 0 ? (
                        <div className="text-center py-10">
                            <AlertCircle className="mx-auto mb-3 text-gray-400" size={32} />
                            <p className="text-gray-600">No hay fuentes verificadas disponibles</p>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Fuentes confiables verificadas</h3>
                            <p className="text-gray-600 mb-4">Estas son fuentes que nuestro equipo ha verificado como confiables para información de salud.</p>
                            
                            <div className="space-y-4">
                                {fuentes.map((fuente) => (
                                    <div key={fuente.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{fuente.nombre}</h4>
                                                {fuente.url && (
                                                    <a 
                                                        href={fuente.url.startsWith('http') ? fuente.url : `https://${fuente.url}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 text-sm hover:underline"
                                                    >
                                                        {fuente.url}
                                                    </a>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <Check size={12} className="mr-1" />
                                                    Verificada
                                                </div>
                                                {fuente.total_noticias > 0 && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {fuente.total_noticias} {fuente.total_noticias === 1 ? 'noticia' : 'noticias'}
                                                    </div>
                                                )}
                                                {fuente.confiabilidad !== null && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Confiabilidad: {formatPercentage(fuente.confiabilidad)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {fuente.descripcion && (
                                            <p className="mt-2 text-sm text-gray-700">{fuente.descripcion}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default ReportesSection;