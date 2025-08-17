'use client';

import { useState, useEffect } from 'react';
import NetworkGraph from '@/components/analytics/graph/NetworkGraph';
import TrendsChart from '@/components/analytics/graph/TrendsChart';
import ChartFilters from '@/components/analytics/filters/ChartFilters';
import SankeyChart from '@/components/analytics/graph/SankeyChart';
import SankeyFilters from '@/components/analytics/filters/SankeyFilters';
import QuickStats from '@/components/analytics/QuickStats';
import { useNetworkGraph } from '@/hooks/useNetworkGraph';
import { useDashboardStats } from '@/hooks/useQuickStats';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { data: networkData, loading: networkLoading, error: networkError } = useNetworkGraph();
  const { stats: dashboardStats, loading: statsLoading, error: statsError } = useDashboardStats();
  
  const [filters, setFilters] = useState({
    dateRange: '7d',
    truthStatus: 'all'
  });

  const [sankeyFilters, setSankeyFilters] = useState({
    timeFrame: '7d',
    flowType: 'all',
    threshold: 'medium'
  });

  // Componente de loading para el gráfico
  const NetworkGraphSection = () => {
    if (networkLoading) {
      return (
        <div className="w-full h-[500px] sm:h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando análisis de red...</p>
          </div>
        </div>
      );
    }

    if (networkError) {
      return (
        <div className="w-full h-[500px] sm:h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600">Error al cargar datos de red</p>
            <p className="text-sm text-gray-500 mt-2">{networkError}</p>
          </div>
        </div>
      );
    }

    if (!networkData || networkData.length === 0) {
      return (
        <div className="w-full h-[500px] sm:h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-600">No hay datos disponibles</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-[500px] sm:h-[600px]">
        <div className='-mt-15'><NetworkGraph data={networkData} /></div>
      </div>
    );
  };

  return (
    <>
      <section className="relative pt-20 lg:pt-0 px-6 sm:px-12 lg:px-24 pb-12 lg:pb-20 flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden">
        {/* Decoración de puntos - esquina superior izquierda */}
        <div className="absolute top-10 left-10 w-32 h-32 opacity-30">
          <div className="grid grid-cols-8 gap-2">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animation: 'pulse 3s ease-in-out infinite'
                }}
              />
            ))}
          </div>
        </div>

        {/* Decoración de puntos - esquina inferior derecha */}
        <div className="absolute bottom-10 right-10 w-24 h-24 opacity-20">
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animation: 'pulse 4s ease-in-out infinite'
                }}
              />
            ))}
          </div>
        </div>

        {/* Puntos flotantes dispersos */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-indigo-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/5 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 bg-indigo-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Texto */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 leading-tight">
            Analiza la red de <span className="text-blue-600">Noticias Falsas</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Visualiza cómo se propagan y se relacionan entre sí los rumores más virales. Descubre patrones, conexiones y temáticas en tiempo real.
          </p>
          <div className="mt-6 flex flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/news"
              className="relative px-6 py-3 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium text-base shadow-md overflow-hidden group transition duration-300 hover:shadow-lg"
            >
              <span className="relative z-10">Explorar Noticias</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            </Link>
            <Link
              href="/admin/dashboard"
              className="px-6 py-3 rounded-md border border-blue-600 text-blue-600 text-base font-medium hover:bg-blue-50 transition"
            >
              Ver Detalles
            </Link>
          </div>
        </div>

        {/* Gráfico con estados de carga */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <NetworkGraphSection />
        </div>
      </section>

      {/* Sección de Contenido Analítico - Análisis en Tiempo Real */}
      <section className="py-16 bg-white">
        <div className="max-w-none px-6 sm:px-12 lg:px-24">
          {/* Header de estadísticas */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Análisis en Tiempo Real
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Monitoreo continuo de tendencias de desinformación en salud con métricas actualizadas cada hora
            </p>
          </div>

          {/* Métricas principales - Usando componente con datos reales */}
          <div className="mb-12">
            <QuickStats 
              stats={dashboardStats} 
              loading={statsLoading} 
              error={statsError} 
            />
          </div>
        </div>
      </section>

      {/* Sección de Gráficos de Tendencias */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-none px-6 sm:px-12 lg:px-24">
          {/* Gráfico de tendencias con filtros */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Gráfico - 2/3 del ancho */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 min-h-[460px]">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tendencias de Desinformación</h3>
                <TrendsChart filters={filters} />
              </div>
            </div>

            {/* Panel de filtros - 1/3 del ancho */}
            <div className="lg:col-span-1">
              <ChartFilters onFiltersChange={setFilters} />
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Contenido Analítico - Análisis de Flujo */}
      <section className="py-16 bg-white">
        <div className="max-w-none px-6 sm:px-12 lg:px-24">
          {/* Header de insights */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Análisis de Flujo de Desinformación
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprende cómo fluye la información falsa entre diferentes fuentes y temáticas principales
            </p>
          </div>

          {/* Métricas de flujo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fuente Principal</p>
                  <p className="text-2xl font-bold text-gray-900">Redes Sociales</p>
                  <p className="text-xs text-blue-600 mt-1">67% del volumen total</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tema Crítico</p>
                  <p className="text-2xl font-bold text-gray-900">Salud Mental</p>
                  <p className="text-xs text-red-600 mt-1">Mayor tasa detectada</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Efectividad</p>
                  <p className="text-2xl font-bold text-gray-900">78.4%</p>
                  <p className="text-xs text-green-600 mt-1">Tasa de detección</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Análisis de Flujo - Sankey Chart */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-none px-6 sm:px-12 lg:px-24">
          {/* Gráfico Sankey con filtros */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Gráfico Sankey - 2/3 del ancho */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 min-h-[500px]">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Flujo de Desinformación</h3>
                <SankeyChart filters={sankeyFilters} />
              </div>
            </div>

            {/* Panel de filtros Sankey - 1/3 del ancho */}
            <div className="lg:col-span-1">
              <SankeyFilters onFiltersChange={setSankeyFilters} />
            </div>
          </div>
        </div>
      </section>

      {/* Call to action final */}
      <section className="py-16 bg-white">
        <div className="max-w-none px-6 sm:px-12 lg:px-24">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">¿Necesitas un análisis más profundo?</h3>
              <p className="text-blue-100 mb-6">Accede a reportes detallados y configuraciones avanzadas</p>
              <Link
                href="/admin/dashboard"
                className="relative inline-flex items-center justify-center px-6 py-3 rounded-md bg-white text-blue-600 font-medium text-base shadow-md overflow-hidden group transition duration-300 hover:shadow-lg"
              >
                <span className="relative z-10">Ir al Dashboard</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}