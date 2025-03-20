
const HeroSection = () => {
    return (
        <section className="relative overflow-hidden rounded-xl mb-16 mt-6">
            {/* Fondo con gradiente y patrón */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500 opacity-90"></div>
            <div className="absolute inset-0 opacity-20"></div>
            
            {/* Contenido principal */}
            <div className="relative z-10 px-6 py-16 md:py-20 text-center">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                        Verifica la información de salud con confianza
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
                        HealthCheck utiliza algoritmos avanzados para analizar y detectar posible desinformación 
                        sobre temas de salud en noticias, redes sociales y sitios web.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            Comenzar Ahora
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-1">
                            Cómo Funciona
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Decoración de fondo */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-b from-transparent to-gray-100"></div>
            
            {/* Elementos decorativos */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-20"></div>
            <div className="absolute top-10 -left-10 w-32 h-32 bg-blue-300 rounded-full opacity-20"></div>
        </section>
    );
};

export default HeroSection;