'use client';

import { useEffect, useRef } from 'react';
import * as Highcharts from 'highcharts';
import { useTrendsData, generateCategories } from '@/services/analytics/charts';

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
  
  const { data, loading, error, refetch } = useTrendsData(filters);

  const colorPalette = [
    { line: 'rgb(59, 130, 246)', fill: 'rgba(59, 130, 246, 0.8)' },
    { line: 'rgb(79, 70, 229)', fill: 'rgba(79, 70, 229, 0.8)' },
    { line: 'rgb(139, 92, 246)', fill: 'rgba(139, 92, 246, 0.8)' },
    { line: 'rgb(6, 182, 212)', fill: 'rgba(6, 182, 212, 0.8)' },
    { line: 'rgb(16, 185, 129)', fill: 'rgba(16, 185, 129, 0.8)' }
  ];

  const updateChart = (chartData) => {
    if (!chartRef.current) return;

    const categories = generateCategories(filters.dateRange || '7d');
    const series = chartData.series.map((s, index) => ({
      ...s,
      lineColor: colorPalette[index]?.line || '#6b7280',
      color: colorPalette[index]?.fill || 'rgba(107, 114, 128, 0.8)',
      fillColor: colorPalette[index]?.fill || 'rgba(107, 114, 128, 0.8)'
    }));

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
        margin: [60, 20, 60, 80]
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
        categories: categories,
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
            <span style="color: ${this.series.color};">●</span> ${categories[this.point.x]}: <strong>${this.y} noticias</strong>
          </div>`;
        }
      },
      series: series,
      credits: { enabled: false }
    };

    // Safely destroy previous chart
    if (chartInstance.current) {
      try { 
        chartInstance.current.destroy(); 
      } catch (e) {
        console.warn('Chart destroy error:', e);
      }
      chartInstance.current = null;
    }

    // Clear container safely
    if (chartRef.current) {
      try {
        chartRef.current.innerHTML = '';
      } catch (e) {
        console.warn('Clear container error:', e);
      }
    }

    // Create new chart with delay
    setTimeout(() => {
      if (chartRef.current) {
        try {
          chartInstance.current = Highcharts.chart(chartRef.current, config);
        } catch (error) {
          console.error('Error creating chart:', error);
        }
      }
    }, 50);
  };

  useEffect(() => {
    if (data) {
      updateChart(data);
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        try { 
          chartInstance.current.destroy(); 
        } catch (e) {
          console.warn('Cleanup error:', e);
        }
        chartInstance.current = null;
      }
    };
  }, [data, filters.dateRange]);

  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Error al cargar datos</h3>
          <p className="text-sm text-gray-500 mb-3">{error}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return <div ref={chartRef} className="w-full h-[400px]" />;
};

export default TrendsChart;