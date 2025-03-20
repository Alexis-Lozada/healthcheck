// src/components/features/Logout-user/SearchSection.jsx
import { AlertCircle, Globe, Loader2, Search, Twitter } from 'lucide-react';

const SearchSection = ({ 
  searchText, 
  setSearchText, 
  activeOption, 
  setActiveOption, 
  handleSearch,
  isLoading,
  error
}) => {
    // Descripciones para cada tipo de búsqueda
    const optionDescriptions = {
        'Texto': 'Ingresa el texto completo de la noticia o información que deseas verificar',
        'URL': 'Pega el enlace directo a la noticia o artículo que quieres analizar',
        'Twitter': 'Ingresa el enlace de un tweet sobre salud que deseas validar'
    };

    // Estado para placeholder según la opción seleccionada
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
        'Texto': <Search size={16} />,
        'URL': <Globe size={16} />,
        'Twitter': <Twitter size={16} />
    };

    // Manejar el evento de presionar Enter en el input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSearch();
        }
    };

    return (
        <section className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all duration-300">
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
                        onClick={handleSearch}
                        disabled={isLoading}
                    >
                        Ver Ejemplo de Resultado
                    </button>
                </div>
            </div>
        </section>
    );
};

export default SearchSection;