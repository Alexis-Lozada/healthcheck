import { Globe, Mail, MessageSquare } from 'lucide-react';

const BenefictsSection = () => {
  const benefits = [
    {
      title: "Acceso a Noticias verificadas",
      description: "Mantente informado con contenido verificado por expertos en salud",
      icon: <Globe size={28} className="text-blue-600" />,
      position: "left",
      gradient: "from-blue-50 to-blue-100",
      border: "border-blue-200"
    },
    {
      title: "Uso de Nuestro ChatBot",
      description: "Resuelve tus dudas en tiempo real con nuestra IA especializada",
      icon: <MessageSquare size={28} className="text-indigo-600" />,
      position: "right",
      gradient: "from-indigo-50 to-indigo-100",
      border: "border-indigo-200"
    },
    {
      title: "Recibir correos informativos",
      description: "Actualizaciones periódicas sobre temas de salud que te interesan",
      icon: <Mail size={28} className="text-teal-600" />,
      position: "left",
      gradient: "from-teal-50 to-teal-100",
      border: "border-teal-200"
    }
  ];

  return (
    <section className="py-16 mb-16 relative bg-gradient-to-b from-gray-50 to-white">
      {/* Separador superior */}
      <div className="absolute top-0 left-0 w-full overflow-hidden h-20 -mt-20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0">
          <path fill="#ffffff" fillOpacity="1" d="M0,128L48,133.3C96,139,192,149,288,144C384,139,480,117,576,133.3C672,149,768,203,864,213.3C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
            Beneficios al Registrarse
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-blue-300 to-blue-600 rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Únete a nuestra comunidad y disfruta de estas ventajas exclusivas
          </p>
        </div>
        
        <div className="space-y-10">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${benefit.position === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 transition-all duration-300 hover:transform hover:-translate-y-1`}
            >
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-gray-100">
                {benefit.icon}
              </div>
              
              <div className={`flex-1 rounded-2xl py-6 px-8 shadow-lg bg-gradient-to-r ${benefit.gradient} border ${benefit.border} ${
                benefit.position === 'right' ? 'text-right' : 'text-left'
              } relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.description}</p>
               
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 hover:transform hover:scale-105 hover:shadow-blue-400/30 hover:shadow-xl">
            Regístrate Ahora
          </button>
        </div>
      </div>
      
      {/* Separador inferior - puedes añadirlo si quieres otro separador al final */}
    </section>
  );
};

export default BenefictsSection;