// src/components/features/Verificador/VerificadorSection.jsx
import { AlertCircle, FileText, Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import ResultSection from '../Logout-user/ResultSection';

const VerificadorSection = ({ userId }) => {
    const [searchText, setSearchText] = useState('');
    const [activeOption, setActiveOption] = useState('Texto');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [resultData, setResultData] = useState(null);
    
    // Descripciones para cada tipo de búsqueda
    const optionDescriptions = {
        'Texto': 'Ingresa el texto completo de la noticia o información que deseas verificar',
        'URL': 'Pega el enlace directo a la noticia o artículo que quieres analizar',
        'Twitter': 'Ingresa el enlace de un tweet sobre salud que deseas validar'
    };

    // Placeholders según la opción seleccionada
    const placeholders = {
        'Texto': 'Pega el texto de una noticia sobre salud para verificar...',
        'URL': 'Ingresa la URL de un artículo o publicación...',
        'Twitter': 'Ingresa el enlace del tweet que deseas verificar...'
    };

    const handleOptionClick = (option) => {
        setActiveOption(option);
    };

    // Componentes de ícono para cada opción
    const optionIcons = {
        'Texto': <FileText size={16} />,
        'URL': <Search size={16} />,
        'Twitter': (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
        )
    };

    // Manejar el evento de presionar Enter en el input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSearch();
        }
    };

    const handleSearch = async () => {
        if (!searchText.trim()) {
            setError('Por favor ingresa un texto o URL para verificar');
            return;
        }
        
        setError(null);
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/verificar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    texto: activeOption === 'Texto' ? searchText : null,
                    url: activeOption !== 'Texto' ? searchText : null,
                    tipoContenido: activeOption.toLowerCase(),
                    userId: userId
                }),
            });
            
            if (!response.ok) {
                throw new Error('Error en la verificación');
            }
            
            const data = await response.json();
            
            if (data.success) {
                setResultData(data.data);
                setShowResult(true);
                
                // Scroll al resultado
                setTimeout(() => {
                    const resultElement = document.getElementById('result-section');
                    if (resultElement) {
                        resultElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            } else {
                throw new Error(data.error || 'Error en la verificación');
            }
        } catch (err) {
            console.error("Error al verificar contenido:", err);
            setError('Ocurrió un error al verificar el contenido. Por favor intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExample = () => {
        setSearchText('Ejemplo de noticia para verificar');
        handleSearch();
    };

    const handleInteraction = async (noticiaId, tipoInteraccion) => {
        if (!noticiaId) return;
        
        try {
            await fetch('/api/interacciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuarioId: userId,
                    noticiaId: noticiaId,
                    tipoInteraccion: tipoInteraccion
                }),
            });
            // No necesitamos procesar la respuesta para acciones de interacción
        } catch (err) {
            console.error("Error al registrar interacción:", err);
        }
    };

    return (
        <div className="space-y-8">
            <section className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Verificador de información</h2>
                
                <div className="flex flex-wrap gap-2 mb-6">
                    {Object.keys(optionDescriptions).map((option) => (
                        <button
                            key={option}
                            className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all duration-200 ${
                                activeOption === option
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => handleOptionClick(option)}
                            disabled={isLoading}
                        >
                            {optionIcons[option]}
                            {option}
                        </button>
                    ))}
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-3">
                        {optionDescriptions[activeOption]}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row mb-4">
                    <input
                        type="text"
                        className={`flex-1 p-4 border-2 ${error ? 'border-red-300' : 'border-gray-200'} rounded-l-lg outline-none focus:border-blue-600 text-base`}
                        placeholder={placeholders[activeOption]}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <button
                        className={`${
                            isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                        } text-white font-bold py-4 px-8 rounded-r-lg md:rounded-l-none transition-colors flex items-center justify-center`}
                        onClick={handleSearch}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 animate-spin" size={20} />
                                Verificando...
                            </>
                        ) : (
                            <>
                                <Search className="mr-2" size={20} />
                                Verificar
                            </>
                        )}
                    </button>
                </div>

                {/* Mostrar mensaje de error si existe */}
                {error && (
                    <div className="mb-4 flex items-start bg-red-50 p-3 rounded-md border border-red-200">
                        <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <div className="text-center">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <p className="text-sm text-blue-700 mb-4">
                            <span className="font-bold">¿Cómo funciona?</span> Nuestro sistema compara la información con fuentes oficiales y bases de datos médicas verificadas
                        </p>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            onClick={handleExample}
                            disabled={isLoading}
                        >
                            Ver Ejemplo de Resultado
                        </button>
                    </div>
                </div>
            </section>

            {/* Sección de resultados */}
            {showResult && (
                <div id="result-section" className="scroll-mt-24">
                    <ResultSection 
                        resultData={resultData} 
                        onInteraction={handleInteraction}
                    />
                </div>
            )}
        </div>
    );
};

export default VerificadorSection;