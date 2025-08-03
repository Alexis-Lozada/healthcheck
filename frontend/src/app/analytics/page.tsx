'use client';

import NetworkGraph from '@/components/analytics/graph/networkgraph/NetworkGraph';
import Link from 'next/link';

const fakeNewsData = [
  ['Noticias Falsas en Tendencia', 'Salud'],
  ['Noticias Falsas en Tendencia', 'Política'],
  ['Noticias Falsas en Tendencia', 'Tecnología'],
  ['Noticias Falsas en Tendencia', 'Finanzas'],
  ['Salud', 'Vacunas'],
  ['Salud', 'COVID'],
  ['Vacunas', '5G'],
  ['5G', 'ADN'],
  ['Salud', 'Microchips'],
  ['Microchips', 'ADN'],
  ['Salud', 'Ajo'],
  ['Salud', 'Oxígeno'],
  ['Salud', 'Radiación'],
  ['Política', 'Elección'],
  ['Política', 'Fraude'],
  ['Elección', 'Hackers'],
  ['Hackers', 'Urnas'],
  ['Política', 'Plandemia'],
  ['Política', 'Dobles'],
  ['Política', 'Dictadura'],
  ['Política', 'Censura'],
  ['Tecnología', 'ChatGPT'],
  ['Tecnología', 'IA'],
  ['IA', 'Control'],
  ['Tecnología', 'Celulares'],
  ['Celulares', 'Torres'],
  ['Torres', 'Control'],
  ['Tecnología', 'Vigilancia'],
  ['Tecnología', 'Implantes'],
  ['Microchips', 'Implantes'],
  ['Tecnología', 'Drones'],
  ['Finanzas', 'Dólar'],
  ['Finanzas', 'Bitcoin'],
  ['Finanzas', 'Illuminati'],
  ['Finanzas', 'Crack'],
  ['Finanzas', 'Colapso'],
  ['Finanzas', 'Oro'],
  ['Finanzas', 'Inversión'],
  ['Finanzas', 'Banqueros'],
  ['Bitcoin', 'Illuminati'],
  ['Hackers', 'Bitcoin'],
  ['Bitcoin', 'Fraude'],
  ['Bitcoin', 'Inversión'],
  ['5G', 'Torres'],
  ['Oxígeno', 'Radiación']
];

export default function AnalyticsPage() {
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

      {/* Gráfico */}
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <div className="w-full h-[500px] sm:h-[600px]">
          <NetworkGraph data={fakeNewsData} />
        </div>
      </div>
    </section>

    {/* Sección de Contenido Analítico */}
    <section className="px-6 sm:px-12 lg:px-24 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header de estadísticas */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Análisis en Tiempo Real
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Monitoreo continuo de tendencias de desinformación en salud con métricas actualizadas cada hora
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Noticias Analizadas</p>
                <p className="text-2xl font-bold text-gray-900">12,847</p>
                <p className="text-xs text-green-600 mt-1">↗ +8.2% vs ayer</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Veracidad</p>
                <p className="text-2xl font-bold text-gray-900">73.2%</p>
                <p className="text-xs text-green-600 mt-1">↗ +2.1% vs ayer</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas Activas</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
                <p className="text-xs text-red-600 mt-1">↗ +4 vs ayer</p>
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
                <p className="text-sm font-medium text-gray-600">Fuentes Verificadas</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-xs text-green-600 mt-1">↗ +12 vs ayer</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos y análisis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Gráfico de tendencias */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tendencias de Desinformación (7 días)</h3>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Gráfico de líneas temporal</p>
                <p className="text-xs text-gray-500 mt-1">Vacunas: ↓15% | COVID: ↑8% | 5G: ↓22%</p>
              </div>
            </div>
          </div>

          {/* Distribución por categorías */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución por Categorías</h3>
            <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 2.069A9.001 9.001 0 0121.931 11H13V2.069z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Gráfico circular</p>
                <p className="text-xs text-gray-500 mt-1">Salud: 42% | Política: 28% | Tecnología: 30%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de noticias recientes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Últimas Detecciones</h3>
            <p className="text-sm text-gray-600 mt-1">Noticias falsas identificadas en las últimas 24 horas</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confianza</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Nueva vacuna causa alteraciones genéticas</div>
                    <div className="text-sm text-gray-500">facebook.com/salud-natural-mx</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Salud</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">94.2%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Falso</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hace 2h</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Estudio confirma eficacia del ejercicio</div>
                    <div className="text-sm text-gray-500">nature.com/medicine</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Salud</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">97.8%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Verdadero</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hace 4h</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">5G causa cáncer según nuevo reporte</div>
                    <div className="text-sm text-gray-500">noticias-urgentes.info</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Tecnología</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">91.5%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Falso</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hace 6h</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Microchips en vacunas para control mental</div>
                    <div className="text-sm text-gray-500">libertad-total.net</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Salud</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">98.1%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Falso</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hace 8h</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
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