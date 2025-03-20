// pages/HealthCheckPage.jsx

import AboutUsSection from '@/components/features/Logout-user/AboutUsSection';
import BenefictsSection from '@/components/features/Logout-user/BenefictsSection';
import FeaturesSection from '@/components/features/Logout-user/FeaturesSection';
import HeroSection from '@/components/features/Logout-user/HeroSection';
import ResultSection from '@/components/features/Logout-user/ResultSection';
import SearchSection from '@/components/features/Logout-user/SearchSection';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import healthcheckService from '@/services/healthcheckService';
import { useState } from 'react';

const HealthCheckPage = () => {
  const [searchText, setSearchText] = useState('Las inyecciones de dióxido de cloro pueden eliminar el COVID-19 en pocas horas según un estudio reciente.');
  const [activeOption, setActiveOption] = useState('Texto');
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setError('Por favor ingresa un texto o URL para verificar');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Llamar al servicio para verificar el contenido
      const result = await healthcheckService.checkContent(searchText, activeOption);
      setResultData(result);
      setShowResult(true);
      
      // Scroll al resultado después de un breve retraso para asegurar que se renderice
      setTimeout(() => {
        const resultElement = document.getElementById('result-section');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error("Error al verificar contenido:", err);
      setError('Ocurrió un error al verificar el contenido. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInteraction = async (noticiaId, tipoInteraccion) => {
    try {
      await healthcheckService.registerInteraction(noticiaId, tipoInteraccion);
      // Puedes mostrar un mensaje de éxito o actualizar el UI si es necesario
    } catch (err) {
      console.error("Error al registrar interacción:", err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      
      {/* Añadimos un div invisible con altura igual al header para crear espacio */}
      <div className="h-20"></div>
      
      <main className="relative">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-10" id="top">
          <HeroSection />
        </div>
        
        {/* Search Section con efecto de elevación */}
        <div className="container mx-auto px-4 relative z-10 -mt-6">
          <SearchSection 
            searchText={searchText}
            setSearchText={setSearchText}
            activeOption={activeOption}
            setActiveOption={setActiveOption}
            handleSearch={handleSearch}
            isLoading={isLoading}
            error={error}
          />
        </div>
        
        {/* Result Section con ID para scroll y scroll-margin-top */}
        {showResult && (
          <div id="result-section" className="container mx-auto px-4 mb-16 scroll-mt-24">
            <ResultSection 
              resultData={resultData} 
              onInteraction={handleInteraction}
            />
          </div>
        )}
        
      
        
        {/* Features Section con ID para navegación */}
        <div id="how-it-works" className="scroll-mt-24">
          <FeaturesSection />
        </div>
        
        {/* About Us Section con ID para navegación */}
        <div id="about-us" className="scroll-mt-24">
          <AboutUsSection />
        </div>
        
        {/* Benefits Section con ID para navegación */}
        <div id="benefits" className="scroll-mt-24">
          <BenefictsSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HealthCheckPage;