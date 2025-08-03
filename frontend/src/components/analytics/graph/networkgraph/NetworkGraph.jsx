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
      const accessibility = await import('highcharts/modules/accessibility');
      const adaptive = await import('highcharts/themes/adaptive');

      applyModule(networkgraph, Highcharts);
      applyModule(exporting, Highcharts);
      applyModule(accessibility, Highcharts);
      applyModule(adaptive, Highcharts);

      Highcharts.addEvent(
        Highcharts.Series,
        'afterSetOptions',
        function (e) {
          const colors = Highcharts.getOptions().colors;
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
                  marker: { radius: 20 }
                };
                nodes[link[1]] = {
                  id: link[1],
                  marker: { radius: 12 },
                  color: colors[i++]
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
              lineWidth: 1
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
              fontWeight: 'normal'
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
