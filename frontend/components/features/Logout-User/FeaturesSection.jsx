
const FeaturesSection = () => {
  const features = [
    {
      icon: '🔍',
      title: 'Análisis de Contenido',
      description: 'Utilizamos algoritmos avanzados de procesamiento de lenguaje natural para analizar el contenido de la información.',
      color: 'bg-gradient-to-br from-purple-50 to-purple-100',
      border: 'border-purple-200',
      shadow: 'shadow-purple-200/50'
    },
    {
      icon: '📊',
      title: 'Verificación de Fuentes',
      description: 'Comparamos la información con fuentes oficiales y bases de datos verificadas de instituciones de salud.',
      color: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-blue-200',
      shadow: 'shadow-blue-200/50'
    },
    {
      icon: '🔄',
      title: 'Aprendizaje Continuo',
      description: 'Nuestro sistema mejora constantemente gracias al aprendizaje automático y la retroalimentación de expertos.',
      color: 'bg-gradient-to-br from-green-50 to-green-100',
      border: 'border-green-200',
      shadow: 'shadow-green-200/50'
    }
  ];

  return (
    <section className="py-16 mb-16 relative pt-24">
      {/* Separador superior */}
      <div className="absolute top-0 left-0 w-full overflow-hidden h-20 -mt-20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0">
          <path fill="#f3f4f6" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
            ¿Cómo funciona HealthCheck?
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-blue-300 to-blue-600 rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestro sistema utiliza tecnología avanzada para analizar información médica y verificar su veracidad.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`border ${feature.border} rounded-2xl p-8 ${feature.color} ${feature.shadow} shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
            >
              <div className="text-5xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Elemento decorativo */}
        <div className="flex justify-center mt-16">
          <div className="w-24 h-1 bg-gradient-to-r from-gray-200 to-gray-400 rounded-full"></div>
        </div>
      </div>
      
      {/* Separador inferior */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden h-20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0">
          <path fill="#f3f4f6" fillOpacity="1" d="M0,96L48,106.7C96,117,192,139,288,154.7C384,171,480,181,576,165.3C672,149,768,107,864,101.3C960,96,1056,128,1152,138.7C1248,149,1344,139,1392,133.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default FeaturesSection;