import Image from 'next/image';

const AboutUsSection = () => {
  return (
    <section className="py-16 mb-16 relative bg-gradient-to-b from-gray-50 to-white pt-24">
      {/* Separador superior */}
      <div className="absolute top-0 left-0 w-full overflow-hidden h-20 -mt-20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0">
          <path fill="#ffffff" fillOpacity="1" d="M0,160L48,149.3C96,139,192,117,288,122.7C384,128,480,160,576,165.3C672,171,768,149,864,149.3C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
            ¿Quiénes somos?
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-blue-300 to-blue-600 rounded-full"></div>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full opacity-70"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 rounded-full opacity-60"></div>
            
            <div className="relative">
              <Image
                src="/images/AboutUs.png" 
                alt="Equipo de Health Check" 
                className="rounded-xl shadow-2xl z-10 relative"
                width={800}  
                height={400}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-xl"></div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <p className="text-xl text-blue-600 mb-6 font-medium">
              Health Check es una plataforma diseñada para combatir la desinformación en temas de salud
            </p>
            
            <p className="text-lg text-gray-700 mb-8">
              Somos un equipo multidisciplinario de profesionales comprometidos con brindar 
              información precisa y verificada sobre temas de salud. Nuestra misión es ayudar 
              a las personas a identificar noticias falsas y desinformación que pueden poner 
              en riesgo su bienestar.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                <div className="font-bold text-blue-700 mb-3 text-lg">Verificación rigurosa</div>
                <p className="text-gray-600">Contrastamos información con fuentes científicas confiables</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                <div className="font-bold text-blue-700 mb-3 text-lg">Expertos en salud</div>
                <p className="text-gray-600">Contamos con un equipo de profesionales de diversas áreas médicas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Separador inferior */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden h-20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0">
          <path fill="#f9fafb" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,218.7C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default AboutUsSection;