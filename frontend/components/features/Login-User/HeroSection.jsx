
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
                        Bienvenido
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
                        HealthCheck utiliza algoritmos avanzados para analizar y detectar posible desinformación 
                        sobre temas de salud en noticias, redes sociales y sitios web.
                    </p>
                    

                </div>
            </div>
            
        </section>
    );
};

export default HeroSection;