'use client';

import { useEffect } from 'react';

const NetworkGraph = ({ data }) => {
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
      const networkgraph = await import('highcharts/modules/networkgraph');
      const exporting = await import('highcharts/modules/exporting');

      applyModule(networkgraph, Highcharts);
      applyModule(exporting, Highcharts);

      // Paleta de colores morados que complementa el azul del sitio
      const purpleColors = [
        '#8B5CF6', // Violeta principal
        '#A855F7', // Púrpura brillante
        '#9333EA', // Violeta intenso
        '#7C3AED', // Violeta profundo
        '#6D28D9', // Púrpura oscuro
        '#5B21B6', // Violeta muy oscuro
        '#DDD6FE', // Violeta claro
        '#C4B5FD', // Lavanda
        '#B794F6', // Púrpura suave
        '#AD85EE'  // Violeta medio
      ];

      // Sobrescribir los colores por defecto de Highcharts
      Highcharts.setOptions({
        colors: purpleColors
      });

      Highcharts.addEvent(
        Highcharts.Series,
        'afterSetOptions',
        function (e) {
          const colors = purpleColors;
          const nodes = {};
          let i = 0;

          if (
            this instanceof Highcharts.Series.types.networkgraph &&
            e.options.id === 'fake-news'
          ) {
            e.options.data.forEach(function (link) {
              if (link[0] === 'Noticias Falsas en Tendencia') {
                nodes['Noticias Falsas en Tendencia'] = {
                  id: 'Noticias Falsas en Tendencia',
                  marker: { 
                    radius: 20,
                    fillColor: '#4F46E5' // Azul índigo que combina con el sitio
                  }
                };
                nodes[link[1]] = {
                  id: link[1],
                  marker: { radius: 12 },
                  color: colors[i++ % colors.length]
                };
              } else if (nodes[link[0]] && nodes[link[0]].color) {
                nodes[link[1]] = {
                  id: link[1],
                  color: nodes[link[0]].color
                };
              }
            });

            e.options.nodes = Object.keys(nodes).map(id => nodes[id]);
          }
        }
      );

      Highcharts.chart('container', {
        chart: {
          type: 'networkgraph',
          height: 600,
          backgroundColor: 'transparent'
        },
        title: { text: null },
        subtitle: { text: null },
        exporting: { enabled: false },
        plotOptions: {
          networkgraph: {
            keys: ['from', 'to'],
            link: {
              dashStyle: 'Dash',
              lineWidth: 1,
              color: '#A855F7', // Color morado para las conexiones
              opacity: 0.6
            },
            layoutAlgorithm: {
              enableSimulation: true,
              friction: -0.985,
              gravitationalConstant: 0
            }
          }
        },
        series: [{
          accessibility: { enabled: false },
          dataLabels: {
            enabled: true,
            linkFormat: '',
            style: {
              fontSize: '0.8em',
              fontWeight: 'normal',
              color: '#374151', // Gris oscuro para mejor legibilidad
              textOutline: '1px contrast'
            }
          },
          id: 'fake-news',
          data
        }]
      });
    };

    loadChart();
  }, [data]);

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
          max-width: 800px;
          margin: 1em auto;
        }


      `}</style>
      <figure className="highcharts-figure">
        <div id="container" style={{ height: '600px' }}></div>
      </figure>
    </>
  );
};

export default NetworkGraph;