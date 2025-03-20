"use client";

import ChatbotInterface from '@/components/features/chatbot/ChatbotInterface';
import HeroSection from '@/components/features/Login-user/HeroSection';
import LatestNewsSection from '@/components/features/Login-User/LatestNewsSection';
import ReportesSection from '@/components/features/Login-User/ReportesSection';
import VerificadorSection from '@/components/features/Login-User/VerificadorSection';
import Footer from '@/components/layout/Footer';
import HeaderHome from '@/components/layout/HeaderHome';
import { useEffect, useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('verificador');
  const [userId, setUserId] = useState(null);

  // Simular obtención de ID de usuario
  useEffect(() => {
    // En un sistema real, esto vendría de la sesión/autenticación
    setUserId(1); // Usuario de ejemplo para testing
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeaderHome />
      
      <main className="relative">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-2" id="top">
          <HeroSection />
        </div>
        
        {/* Navegación de pestañas */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex overflow-x-auto border-b border-gray-200">
            <button
              onClick={() => setActiveTab('verificador')}
              className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'verificador' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Verificador de Noticias
            </button>
            <button
              onClick={() => setActiveTab('reportes')}
              className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'reportes' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sistema de Reportes
            </button>
          </div>
        </div>
        
        {/* Contenido según la pestaña seleccionada */}
        <div className="container mx-auto px-4 mb-16">
          {activeTab === 'verificador' && (
            <VerificadorSection userId={userId} />
          )}
          
          {activeTab === 'reportes' && (
            <ReportesSection userId={userId} />
          )}
        </div>
        
        {/* Últimas verificaciones - Esta sección siempre se muestra */}
        <div id="verificaciones-recientes" className="scroll-mt-24">
          <LatestNewsSection />
        </div>
      </main>
      
      {/* Chatbot */}
      <ChatbotInterface userId={userId} />
      
      <Footer />
    </div>
  );
}