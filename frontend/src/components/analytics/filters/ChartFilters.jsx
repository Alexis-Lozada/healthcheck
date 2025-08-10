'use client';

import { useState } from 'react';

const ChartFilters = ({ onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState({
    dateRange: '7d',
    veracity: 'all',
    sources: 'all'
  });

  const handleDateRangeChange = (range) => {
    const newFilters = { ...localFilters, dateRange: range };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleVeracityChange = (veracity) => {
    const newFilters = { ...localFilters, veracity };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSourcesChange = (sources) => {
    const newFilters = { ...localFilters, sources };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Filtros</h3>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Rango de fechas */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Período de tiempo
            </label>
            <div className="space-y-2">
              {[
                { value: '1d', label: 'Últimas 24 horas' },
                { value: '7d', label: 'Últimos 7 días' },
                { value: '30d', label: 'Últimos 30 días' },
                { value: '90d', label: 'Últimos 3 meses' }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="dateRange"
                    value={option.value}
                    checked={localFilters.dateRange === option.value}
                    onChange={() => handleDateRangeChange(option.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Veracidad */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Estado de veracidad
            </label>
            <div className="relative">
              <select
                value={localFilters.veracity}
                onChange={(e) => handleVeracityChange(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white"
              >
                <option value="all">Todas</option>
                <option value="false">Solo falsas</option>
                <option value="true">Solo verdaderas</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tipo de fuentes - Mantenido para compatibilidad pero no usado en la API */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de fuentes
            </label>
            <div className="relative">
              <select
                value={localFilters.sources}
                onChange={(e) => handleSourcesChange(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white"
                disabled
              >
                <option value="all">Todas las fuentes</option>
                <option value="social">Redes sociales</option>
                <option value="news">Sitios de noticias</option>
                <option value="blogs">Blogs y sitios personales</option>
                <option value="official">Fuentes oficiales</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Próximamente disponible
            </p>
          </div>
        </div>

        {/* Botón de reset - fijo en la parte inferior */}
        <button
          onClick={() => {
            const defaultFilters = {
              dateRange: '7d',
              veracity: 'all',
              sources: 'all'
            };
            setLocalFilters(defaultFilters);
            onFiltersChange(defaultFilters);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Restaurar filtros
        </button>
      </div>
    </div>
  );
};

export default ChartFilters;