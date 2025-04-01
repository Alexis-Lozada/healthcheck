'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  BarChart2, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Flag,
  Info
} from 'lucide-react';
import type { NewsItem } from '@/types/news';
import ConfidenceBar from './ConfidenceBar';
import ReportModal from './ReportModal';

interface NewsCardProps {
  news: NewsItem;
  onInteraction: (newsId: number, interactionType: string) => Promise<void>;
}

const NewsCard = ({ news, onInteraction }: NewsCardProps) => {
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha desconocida';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      return 'Fecha inválida';
    }
  };

  // Truncar texto
  const truncateText = (text: string, maxLength: number = 140) => {
    if (!text) return '';
    
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Obtener icono basado en la clasificación
  const getClassificationIcon = () => {
    if (!news.clasificaciones || news.clasificaciones.length === 0) {
      return <Info className="h-5 w-5 text-gray-400" />;
    }
    
    const classification = news.clasificaciones[0];
    
    switch (classification.resultado) {
      case 'verdadera':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'falsa':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'dudosa':
        return <Info className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  // Obtener badge de clasificación
  const getClassificationBadge = () => {
    if (!news.clasificaciones || news.clasificaciones.length === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Info className="h-3 w-3 mr-1" />
          Sin clasificar
        </span>
      );
    }
    
    const classification = news.clasificaciones[0];
    
    let badgeColor = 'bg-gray-100 text-gray-800';
    let icon = <Info className="h-3 w-3 mr-1" />;
    
    switch (classification.resultado) {
      case 'verdadera':
        badgeColor = 'bg-green-100 text-green-800';
        icon = <CheckCircle className="h-3 w-3 mr-1" />;
        break;
      case 'falsa':
        badgeColor = 'bg-red-100 text-red-800';
        icon = <AlertTriangle className="h-3 w-3 mr-1" />;
        break;
      case 'dudosa':
        badgeColor = 'bg-yellow-100 text-yellow-800';
        icon = <Info className="h-3 w-3 mr-1" />;
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
        {icon}
        {classification.resultado.toUpperCase()}
      </span>
    );
  };

  // Manejar interacciones
  const handleInteraction = async (type: string) => {
    await onInteraction(news.id, type);
  };

  // Compartir noticia
  const handleShare = async () => {
    // Primero registrar la interacción
    await handleInteraction('compartir');
    
    // Luego abrir diálogo nativo de compartir si está disponible
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.titulo,
          text: `${news.titulo} - Verificado por HealthCheck`,
          url: `${window.location.origin}/news/${news.id}`
        });
      } catch (err) {
        console.error('Error al compartir:', err);
      }
    } else {
      // Fallback: copiar enlace al portapapeles
      const url = `${window.location.origin}/news/${news.id}`;
      await navigator.clipboard.writeText(url);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <>
      <div className="flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl h-full">
        {/* Imagen de previsualización si existe */}
        {news.preview?.image?.url && (
          <div className="relative w-full h-48 bg-gray-100">
            <img 
              src={news.preview.image.url} 
              alt={news.titulo} 
              className="object-cover w-full h-full"
            />
            {news.preview.logo?.url && (
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow">
                <img 
                  src={news.preview.logo.url} 
                  alt={news.fuente?.nombre || 'Logo'} 
                  className="w-6 h-6 object-contain rounded-full"
                />
              </div>
            )}
          </div>
        )}
        
        {/* Header con clasificación */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            {getClassificationIcon()}
            <span className="ml-2 font-medium text-gray-700">
              {news.tema?.nombre || 'General'}
            </span>
          </div>
          <div>
            {getClassificationBadge()}
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="flex-1 bg-white p-6 flex flex-col justify-between">
          <div className="flex-1">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(news.fecha_publicacion)}</span>
            </div>
            
            <Link href={`/news/${news.id}`}>
              <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                {news.titulo}
              </h3>
            </Link>
            
            {/* Barra de confianza */}
            {news.clasificaciones && news.clasificaciones.length > 0 && (
              <ConfidenceBar classification={news.clasificaciones[0]} />
            )}
            
            <p className="mt-3 text-base text-gray-500">
              {news.preview?.description ? news.preview.description : truncateText(news.contenido)}
            </p>
            
            {/* Información del modelo de IA */}
            {news.clasificaciones?.[0]?.modelo && (
              <div className="mt-3 bg-blue-50 rounded-md p-2 text-xs text-blue-600">
                <p className="font-medium">Analizado por: {news.clasificaciones[0].modelo.nombre} v{news.clasificaciones[0].modelo.version}</p>
                <p className="mt-1">Precisión: {(news.clasificaciones[0].modelo.precision * 100).toFixed(0)}%</p>
              </div>
            )}
          </div>
          
          {/* Footer con acciones */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <span>{news.fuente?.nombre || news.preview?.publisher || 'Fuente desconocida'}</span>
                {news.fuente && (
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                    title="Reportar fuente"
                  >
                    <Flag className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => handleInteraction('marcar_confiable')}
                  className={`p-2 rounded-full transition-colors ${
                    news.userInteractions?.marcar_confiable 
                      ? 'text-white bg-green-500 hover:bg-green-600' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title="Marcar como confiable"
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => handleInteraction('marcar_dudosa')}
                  className={`p-2 rounded-full transition-colors ${
                    news.userInteractions?.marcar_dudosa 
                      ? 'text-white bg-red-500 hover:bg-red-600' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title="Marcar como dudosa"
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
                
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                  title="Compartir"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                
                {news.url && (
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                    title="Ver fuente original"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de reporte */}
      {showReportModal && news.fuente && (
        <ReportModal
          fuente={news.fuente}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </>
  );
};

export default NewsCard;