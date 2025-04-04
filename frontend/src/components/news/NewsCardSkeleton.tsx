// src/components/news/NewsCardSkeleton.tsx
import React from 'react';

const NewsCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 h-full bg-white">
      {/* Imagen de previsualización */}
      <div className="w-full h-48 bg-gray-200 animate-pulse"></div>

      {/* Header con clasificación */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-5 w-5 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="ml-2 h-4 w-24 bg-gray-300 animate-pulse rounded"></div>
        </div>
        <div className="h-5 w-20 bg-gray-300 animate-pulse rounded-full"></div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          {/* Fecha y acciones secundarias */}
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Título */}
          <div className="h-6 w-full bg-gray-300 animate-pulse rounded mb-2"></div>
          <div className="h-6 w-2/3 bg-gray-300 animate-pulse rounded mb-4"></div>

          {/* Barra de confianza */}
          <div className="mt-2 mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-3 w-10 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="w-full h-1.5 bg-gray-200 animate-pulse rounded-full"></div>
          </div>

          {/* Contenido */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
          </div>

          {/* Información del modelo */}
          <div className="mt-3 bg-blue-50 rounded-md p-2">
            <div className="h-3 w-40 bg-blue-100 animate-pulse rounded mb-1"></div>
            <div className="h-3 w-24 bg-blue-100 animate-pulse rounded"></div>
          </div>
        </div>

        {/* Footer con acciones */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-full"></div>
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCardSkeleton;