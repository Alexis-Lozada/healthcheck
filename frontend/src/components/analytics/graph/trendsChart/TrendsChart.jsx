'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as Highcharts from 'highcharts';
import { useTrends } from '@/hooks/useTrends';

let Highcharts3D;
if (typeof window !== 'undefined') {
  Highcharts3D = require('highcharts/highcharts-3d');
  if (typeof Highcharts3D === 'function') {
    Highcharts3D(Highcharts);
  }
}

const TrendsChart = ({ filters }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const isDestroyed = useRef(false);

  // Use the API hook
  const { data: apiData, metadata, loading, error, refetch } = useTrends({
    dateRange: filters.dateRange,
    veracity: filters.veracity
  });

  // Format categories based on interval type
  const formatCategories = useCallback((categories, intervalType) => {
    if (!categories || categories.length === 0) return [];

    switch (intervalType) {
      case 'hour':
        return categories.map(hour => `${hour.toString().padStart(2, '0')}:00`);
      case 'day':
        const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        return categories.map(i => days[i] || `Día ${i + 1}`);
      case 'week':
        return categories.map(i => `Sem ${i + 1}`);
      case 'month':
        return categories.map(i => `Mes ${i + 1}`);
      default:
        return categories.map(i => i.toString());
    }
  }, []);

  // Apply colors to series
  const applyColorsToSeries = useCallback((series) => {
    const colors = {
      'vacunas': { line: 'rgb(59, 130, 246)', fill: 'rgba(59, 130, 246, 0.8)' },
      'covid': { line: 'rgb(79, 70, 229)', fill: 'rgba(79, 70, 229, 0.8)' },
      '5g': { line: 'rgb(139, 92, 246)', fill: 'rgba(139, 92, 246, 0.8)' },
      'microchips': { line: 'rgb(6, 182, 212)', fill: 'rgba(6, 182, 212, 0.8)' },
      'radiación': { line: 'rgb(16, 185, 129)', fill: 'rgba(16, 185, 129, 0.8)' },
      'medicina': { line: 'rgb(14, 165, 233)', fill: 'rgba(14, 165, 233, 0.8)' },
      'salud': { line: 'rgb(34, 197, 94)', fill: 'rgba(34, 197, 94, 0.8)' }
    };

    const defaultColors = [
      { line: 'rgb(59, 130, 246)', fill: 'rgba(59, 130, 246, 0.8)' },
      { line: 'rgb(79, 70, 229)', fill: 'rgba(79, 70, 229, 0.8)' },
      { line: 'rgb(139, 92, 246)', fill: 'rgba(139, 92, 246, 0.8)' },
      { line: 'rgb(6, 182, 212)', fill: 'rgba(6, 182, 212, 0.8)' },
      { line: 'rgb(16, 185, 129)', fill: 'rgba(16, 185, 129, 0.8)' }
    ];

    return series.map((s, index) => {
      const colorKey = s.name.toLowerCase();
      const colorConfig = colors[colorKey] || defaultColors[index % defaultColors.length];
      
      return {
        name: s.name.charAt(0).toUpperCase() + s.name.slice(1),
        data: s.data,
        lineColor: colorConfig.line,
        color: colorConfig.fill,
        fillColor: colorConfig.fill,
        visible: true,
        showInLegend: true,
        enableMouseTracking: true
      };
    });
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (chartInstance.current && !isDestroyed.current) {
      try {
        chartInstance.current.destroy();
      } catch (error) {
        // Silently handle cleanup errors
      } finally {
        chartInstance.current = null;
      }
    }
  }, []);

  // Create chart function
  const createChart = useCallback(() => {
    if (!chartRef.current || !apiData || !metadata || loading || isDestroyed.current) {
      return;
    }

    // Cleanup previous chart
    cleanup();

    const formattedCategories = formatCategories(apiData.categories, metadata.interval_type);
    const coloredSeries = applyColorsToSeries(apiData.series);

    const config = {
      chart: {
        type: 'area',
        height: 400,
        backgroundColor: 'transparent',
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 30,
          depth: 300,
          viewDistance: 25
        },
        margin: [60, 20, 60, 80],
        animation: {
          duration: 800
        }
      },
      exporting: { enabled: false },
      title: { text: null },
      yAxis: {
        title: { text: 'Noticias Detectadas', x: -40 },
        labels: { format: '{value:,.0f}' },
        gridLineDashStyle: 'Dash',
        gridLineColor: '#f3f4f6'
      },
      xAxis: {
        categories: formattedCategories,
        gridLineWidth: 1,
        gridLineColor: '#f3f4f6',
        labels: { style: { fontSize: '12px', color: '#6b7280' } }
      },
      plotOptions: {
        area: {
          depth: 150,
          marker: { enabled: false },
          stacking: null
        }
      },
      legend: {
        align: 'center',
        verticalAlign: 'top',
        layout: 'horizontal',
        itemStyle: { cursor: 'pointer' },
        x: 0,
        y: 10,
        itemMarginRight: 20
      },
      tooltip: {
        backgroundColor: 'white',
        borderColor: '#e5e7eb',
        borderRadius: 8,
        shadow: true,
        useHTML: true,
        formatter: function () {
          return `<div style="padding: 8px;">
            <strong>${this.series.name}</strong><br/>
            <span style="color: ${this.series.color};">●</span> ${formattedCategories[this.point.x]}: <strong>${this.y} noticias</strong>
          </div>`;
        }
      },
      series: coloredSeries,
      credits: { enabled: false }
    };

    try {
      chartInstance.current = Highcharts.chart(chartRef.current, config);
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }, [apiData, metadata, loading, formatCategories, applyColorsToSeries, cleanup]);

  // Refetch data when filters change
  useEffect(() => {
    if (refetch) {
      const timeoutId = setTimeout(() => {
        refetch({
          dateRange: filters.dateRange,
          veracity: filters.veracity
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [filters.dateRange, filters.veracity, refetch]);

  // Create chart when data changes
  useEffect(() => {
    if (apiData && metadata && !loading) {
      createChart();
    }
  }, [apiData, metadata, loading, createChart]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isDestroyed.current = true;
      cleanup();
    };
  }, [cleanup]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Cargando datos de tendencias...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">Error al cargar datos</p>
          <p className="text-xs text-gray-500 mt-1">{error}</p>
          <button 
            onClick={() => refetch({ dateRange: filters.dateRange, veracity: filters.veracity })}
            className="mt-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!apiData || !apiData.series || apiData.series.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">No hay datos disponibles</p>
          {metadata && (
            <p className="text-xs text-gray-500 mt-1">
              Período: {metadata.period} | Total de noticias: {metadata.total_news}
            </p>
          )}
        </div>
      </div>
    );
  }

  return <div ref={chartRef} className="w-full h-[400px]" />;
};

export default TrendsChart;