'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Bienvenido, {user?.nombre}
          </p>
        </div>

        <div className="mt-10">
          <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Verificación de noticias</h2>
              <div className="mt-4">
                <label htmlFor="news-url" className="block text-sm font-medium text-gray-700">
                  URL de la noticia
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="news-url"
                    id="news-url"
                    className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                    placeholder="https://ejemplo.com/noticia"
                  />
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Verificar
                  </button>
                </div>
              </div>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Noticias en tendencia</h2>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Aquí se mostrarán las noticias en tendencia relacionadas con salud.
                </p>
                <div className="mt-2 bg-gray-100 p-4 rounded-md text-center">
                  Función en desarrollo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}