'use client';

import { useEffect } from 'react';

const SankeyChart = ({ filters }) => {
  useEffect(() => {
    const applyModule = (mod, Highcharts) => {
      if (typeof mod === 'function') {
        mod(Highcharts);
      } else if (mod?.default && typeof mod.default === 'function') {
        mod.default(Highcharts);
      } else {
        console.warn('El módulo no es válido:', mod);
      }
    };

    const loadChart = async () => {
      const Highcharts = (await import('highcharts')).default;
      const sankey = await import('highcharts/modules/sankey');
      const nonCartesian = await import('highcharts/modules/non-cartesian-zoom');
      const mouseWheelZoom = await import('highcharts/modules/mouse-wheel-zoom');

      applyModule(sankey, Highcharts);
      applyModule(nonCartesian, Highcharts);
      applyModule(mouseWheelZoom, Highcharts);

      Highcharts.chart('sankey-container', {
        chart: {
          type: 'sankey',
          height: 400,
          zooming: {
            type: 'xy'
          },
          panning: {
            enabled: true,
            type: 'xy'
          },
          panKey: 'shift',
          backgroundColor: 'transparent'
        },
        title: {
          text: null
        },
        tooltip: {
          pointFormat:
            '{point.fromNode.name} → {point.toNode.name}: {point.weight:.0f} menciones',
          nodeFormat: '{point.name}: {point.sum:.0f} menciones totales'
        },
        exporting: { enabled: false },
        accessibility: { enabled: false },
        credits: { enabled: false },
        series: [{
          keys: ['from', 'to', 'weight'],
          dataLabels: {
            style: {
              color: '#374151',
              fontSize: '12px',
              fontWeight: '500'
            }
          },
          nodes: [
            { id: 'Redes Sociales', color: '#3B82F6' },
            { id: 'Sitios de Noticias', color: '#4F46E5' },
            { id: 'Blogs Personales', color: '#8B5CF6' },
            { id: 'Salud', color: '#06B6D4', column: 1 },
            { id: 'Política', color: '#10B981', column: 1 },
            { id: 'Tecnología', color: '#0EA5E9', column: 1 },
            { id: 'Vacunas', color: '#3B82F6', column: 2 },
            { id: 'COVID', color: '#4F46E5', column: 2 },
            { id: '5G', color: '#8B5CF6', column: 2 },
            { id: 'Microchips', color: '#06B6D4', column: 2 },
            { id: 'Fraude Electoral', color: '#10B981', column: 2 },
            { id: 'Vigilancia', color: '#0EA5E9', column: 2 },
            { id: 'Desinformación Detectada', color: '#6B7280', column: 3 },
            { id: 'Contenido Verificado', color: '#22C55E', column: 3 }
          ],
          data: [
            // Fuentes a categorías principales
            ['Redes Sociales', 'Salud', 450],
            ['Redes Sociales', 'Política', 320],
            ['Redes Sociales', 'Tecnología', 280],
            ['Sitios de Noticias', 'Salud', 180],
            ['Sitios de Noticias', 'Política', 240],
            ['Sitios de Noticias', 'Tecnología', 160],
            ['Blogs Personales', 'Salud', 120],
            ['Blogs Personales', 'Política', 95],
            ['Blogs Personales', 'Tecnología', 85],
            
            // Categorías a temas específicos
            ['Salud', 'Vacunas', 350],
            ['Salud', 'COVID', 280],
            ['Salud', 'Microchips', 120],
            ['Política', 'Fraude Electoral', 380],
            ['Política', 'Vigilancia', 275],
            ['Tecnología', '5G', 300],
            ['Tecnología', 'Vigilancia', 145],
            ['Tecnología', 'Microchips', 80],
            
            // Temas específicos a resultado final
            ['Vacunas', 'Desinformación Detectada', 280],
            ['Vacunas', 'Contenido Verificado', 70],
            ['COVID', 'Desinformación Detectada', 200],
            ['COVID', 'Contenido Verificado', 80],
            ['5G', 'Desinformación Detectada', 240],
            ['5G', 'Contenido Verificado', 60],
            ['Microchips', 'Desinformación Detectada', 150],
            ['Microchips', 'Contenido Verificado', 50],
            ['Fraude Electoral', 'Desinformación Detectada', 300],
            ['Fraude Electoral', 'Contenido Verificado', 80],
            ['Vigilancia', 'Desinformación Detectada', 320],
            ['Vigilancia', 'Contenido Verificado', 100]
          ]
        }]
      });
    };

    loadChart();
  }, [filters]);

  return (
    <>
      <style>{`
        .highcharts-figure * {
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Helvetica,
            Arial,
            "Apple Color Emoji",
            "Segoe UI Emoji",
            "Segoe UI Symbol",
            sans-serif;
        }

        .highcharts-figure {
          min-width: 320px;
          width: 100%;
          margin: 0;
        }

        #sankey-container {
          width: 100%;
          height: 400px;
        }
      `}</style>
      <figure className="highcharts-figure">
        <div id="sankey-container"></div>
      </figure>
    </>
  );
};

export default SankeyChart;