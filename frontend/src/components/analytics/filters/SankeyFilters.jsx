'use client';

import { useState } from 'react';

const SankeyFilters = ({ onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState({
    timeFrame: '7d',
    flowType: 'all',
    threshold: 'medium'
  });

  const handleTimeFrameChange = (timeFrame) => {
    const newFilters = { ...localFilters, timeFrame };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFlowTypeChange = (flowType) => {
    const newFilters = { ...localFilters, flowType };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleThresholdChange = (threshold) => {
    const newFilters = { ...localFilters, threshold };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Filtros de Flujo</h3>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Marco temporal */}
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
                    name="timeFrame"
                    value={option.value}
                    checked={localFilters.timeFrame === option.value}
                    onChange={() => handleTimeFrameChange(option.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tipo de flujo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de flujo
            </label>
            <div className="relative">
              <select
                value={localFilters.flowType}
                onChange={(e) => handleFlowTypeChange(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white"
              >
                <option value="all">Todos los flujos</option>
                <option value="misinformation">Solo desinformación</option>
                <option value="verified">Solo contenido verificado</option>
                <option value="trending">Tendencias principales</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Umbral de volumen */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Umbral de volumen
            </label>
            <div className="relative">
              <select
                value={localFilters.threshold}
                onChange={(e) => handleThresholdChange(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white"
              >
                <option value="low">Bajo (≥10 menciones)</option>
                <option value="medium">Medio (≥50 menciones)</option>
                <option value="high">Alto (≥100 menciones)</option>
                <option value="extreme">Extremo (≥500 menciones)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de reset */}
        <button
          onClick={() => {
            const defaultFilters = {
              timeFrame: '7d',
              flowType: 'all',
              threshold: 'medium'
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

export default SankeyFilters;