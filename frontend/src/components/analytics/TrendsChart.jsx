
'use client';

import { useEffect, useRef } from 'react';
import * as Highcharts from 'highcharts';

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

  const generateData = (dateRange, categories) => {
    const dataMap = {
      '1d': {
        categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        data: {
          'Vacunas': [45, 38, 42, 35, 28, 25],
          'COVID': [23, 19, 22, 26, 29, 31],
          '5G': [34, 29, 25, 22, 18, 15],
          'Microchips': [12, 10, 8, 6, 5, 4],
          'Radiación': [8, 7, 9, 8, 6, 5],
          'Ajo': [5, 4, 3, 2, 2, 1],
          'Oxígeno': [3, 2, 4, 3, 2, 2]
        }
      },
      '7d': {
        categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        data: {
          'Vacunas': [245, 198, 156, 134, 98, 87, 65],
          'COVID': [89, 76, 65, 78, 89, 95, 102],
          '5G': [178, 156, 134, 123, 98, 76, 54],
          'Microchips': [67, 54, 43, 38, 29, 23, 18],
          'Radiación': [34, 28, 31, 27, 24, 19, 16],
          'Ajo': [23, 19, 15, 12, 9, 7, 5],
          'Oxígeno': [15, 12, 14, 11, 8, 6, 4]
        }
      },
      '30d': {
        categories: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        data: {
          'Vacunas': [1245, 1098, 856, 634],
          'COVID': [489, 576, 665, 702],
          '5G': [878, 756, 634, 423],
          'Microchips': [267, 154, 143, 98],
          'Radiación': [134, 128, 131, 97],
          'Ajo': [89, 67, 45, 23],
          'Oxígeno': [67, 54, 43, 32]
        }
      },
      '90d': {
        categories: ['Mes 1', 'Mes 2', 'Mes 3'],
        data: {
          'Vacunas': [3245, 2798, 1956],
          'COVID': [1289, 1576, 1965],
          '5G': [2178, 1756, 1234],
          'Microchips': [867, 654, 443],
          'Radiación': [434, 328, 231],
          'Ajo': [223, 167, 105],
          'Oxígeno': [167, 134, 103]
        }
      }
    };

    const timeData = dataMap[dateRange] || dataMap['7d'];
    const colors = {
      'Vacunas': { line: 'rgb(59, 130, 246)', fill: 'rgba(59, 130, 246, 0.8)' },
      'COVID': { line: 'rgb(79, 70, 229)', fill: 'rgba(79, 70, 229, 0.8)' },
      '5G': { line: 'rgb(139, 92, 246)', fill: 'rgba(139, 92, 246, 0.8)' },
      'Microchips': { line: 'rgb(6, 182, 212)', fill: 'rgba(6, 182, 212, 0.8)' },
      'Radiación': { line: 'rgb(16, 185, 129)', fill: 'rgba(16, 185, 129, 0.8)' },
      'Ajo': { line: 'rgb(14, 165, 233)', fill: 'rgba(14, 165, 233, 0.8)' },
      'Oxígeno': { line: 'rgb(34, 197, 94)', fill: 'rgba(34, 197, 94, 0.8)' }
    };

    return {
      categories: timeData.categories,
      series: categories
        .filter(category => timeData.data[category])
        .map(category => {
          return {
            name: category,
            data: timeData.data[category],
            lineColor: colors[category]?.line || '#6b7280',
            color: colors[category]?.fill || 'rgba(107, 114, 128, 0.8)',
            fillColor: colors[category]?.fill || 'rgba(107, 114, 128, 0.8)',
            visible: true,
            showInLegend: true,
            enableMouseTracking: true
          };
        })
    };
  };

  useEffect(() => {
    if (chartRef.current) {
      const chartData = generateData(filters.dateRange, filters.categories);

      const config = {
        chart: {
          type: 'area',
          renderTo: chartRef.current,
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
          categories: chartData.categories,
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
              <span style="color: ${this.series.color};">●</span> ${chartData.categories[this.point.x]}: <strong>${this.y} noticias</strong>
            </div>`;
          }
        },
        series: chartData.series.map(s => ({
          ...s,
          states: {
            ...(s.states || {}),
            inactive: {
              ...(s.states?.inactive || {}),
              enabled: true,
              opacity: 0.2
            },
            hover: {
              ...(s.states?.hover || {}),
              enabled: true
            }
          }
        })),
        credits: { enabled: false }
      };

      if (chartInstance.current) {
        try { chartInstance.current.destroy(); } catch {}
        chartInstance.current = null;
      }

      chartRef.current.innerHTML = '';
      setTimeout(() => {
        try {
          chartInstance.current = new Highcharts.Chart(config);
        } catch (error) {
          console.error('Error creating chart:', error);
        }
      }, 10);
    }

    return () => {
      if (chartInstance.current) {
        try { chartInstance.current.destroy(); } catch {}
        chartInstance.current = null;
      }
    };
  }, [filters]);

  return <div ref={chartRef} className="w-full h-[400px]" />;
};

export default TrendsChart;
