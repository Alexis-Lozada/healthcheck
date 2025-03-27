'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Definimos la URL base de la API Gateway
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface VerificationResult {
  "Noticia ID": number;
  "Clasificación": string;
  "Confianza": number;
  "Explicación": string;
  "Tema": string;
  "Palabras Clave": string[];
  "Título": string;
  "Autor": string;
  "Fuente": string;
  "Fecha de Publicación"?: string;
  "Texto Completo": string;
  "Clasificación ID"?: number;
  "Consulta ID"?: number;
}

const NewsVerifier = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar si el usuario está autenticado
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!input.trim()) {
      setError('Por favor, introduce una URL o texto para verificar.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Preparar datos para la API
      const requestData: Record<string, any> = {
        [inputType]: input,
        usuario_id: user.id
      };
      
      console.log('Enviando solicitud a:', `${API_URL}/ml/classify/predict`);
      console.log('Datos:', requestData);
      
      // Enviar solicitud a la API con token de autenticación
      const response = await fetch(`${API_URL}/ml/classify/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData),
      });
      
      const data = await response.json();
      
      console.log('Respuesta recibida:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al verificar la noticia');
      }
      
      setResult(data);
    } catch (err) {
      console.error('Error en la verificación:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getVeracityColor = (clasificacion: string, confianza: number) => {
    if (clasificacion === 'verdadera') {
      return confianza > 80 ? 'text-green-600' : 'text-green-500';
    } else {
      return confianza > 80 ? 'text-red-600' : 'text-red-500';
    }
  };

  // Formatear la confianza para mostrarla como porcentaje
  const formatConfidence = (confidence: number) => {
    // Si la confianza está entre 0 y 1, multiplicarla por 100
    if (confidence <= 1) {
      return (confidence * 100).toFixed(2);
    }
    // Si ya está en porcentaje, simplemente formatearla
    return confidence.toFixed(2);
  };

  return (
    <div className="bg-white py-12 rounded-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-8">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Verificador</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Comprueba la veracidad de la información
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Pega una URL o introduce texto para verificar si la información es confiable o no.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {!user && !loading ? (
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Inicia sesión para verificar noticias</h3>
              <p className="text-blue-700 mb-4">
                Para acceder a esta funcionalidad, es necesario iniciar sesión en la plataforma.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center space-x-4 mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-blue-600"
                    name="inputType"
                    checked={inputType === 'url'}
                    onChange={() => setInputType('url')}
                  />
                  <span className="ml-2 text-gray-700">URL</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-blue-600"
                    name="inputType"
                    checked={inputType === 'text'}
                    onChange={() => setInputType('text')}
                  />
                  <span className="ml-2 text-gray-700">Texto</span>
                </label>
              </div>

              <div>
                {inputType === 'url' ? (
                  <input
                    type="url"
                    placeholder="https://ejemplo.com/noticia"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <textarea
                    placeholder="Introduce el texto de la noticia aquí..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={`px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    (isLoading || !input.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Verificando...' : 'Verificar'}
                </button>
              </div>
            </form>
          )}

          {result && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resultado del análisis</h3>
              
              <div className="mb-4">
                <div className="font-bold text-gray-700">Título:</div>
                <div className="text-gray-900">{result["Título"] !== "No disponible" ? result["Título"] : "No disponible"}</div>
              </div>
              
              {result["Autor"] && result["Autor"] !== "Desconocido" && (
                <div className="mb-4">
                  <div className="font-bold text-gray-700">Autor:</div>
                  <div className="text-gray-900">{result["Autor"]}</div>
                </div>
              )}
              
              {result["Fuente"] && result["Fuente"] !== "Texto ingresado directamente" && (
                <div className="mb-4">
                  <div className="font-bold text-gray-700">Fuente:</div>
                  <div className="text-gray-900">
                    <a href={result["Fuente"]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {result["Fuente"]}
                    </a>
                  </div>
                </div>
              )}
              
              {result["Fecha de Publicación"] && (
                <div className="mb-4">
                  <div className="font-bold text-gray-700">Fecha:</div>
                  <div className="text-gray-900">{result["Fecha de Publicación"]}</div>
                </div>
              )}
              
              <div className="mb-4">
                <div className="font-bold text-gray-700">Clasificación:</div>
                <div className={`text-lg font-bold ${getVeracityColor(result["Clasificación"], result["Confianza"])}`}>
                  {result["Clasificación"].toUpperCase()} ({formatConfidence(result["Confianza"])}% de confianza)
                </div>
              </div>
              
              <div className="mb-4">
                <div className="font-bold text-gray-700">Explicación:</div>
                <div className="text-gray-900">{result["Explicación"]}</div>
              </div>
              
              <div className="mb-4">
                <div className="font-bold text-gray-700">Tema:</div>
                <div className="text-gray-900">{result["Tema"]}</div>
              </div>
              
              {result["Palabras Clave"] && result["Palabras Clave"].length > 0 && (
                <div className="mb-4">
                  <div className="font-bold text-gray-700">Palabras clave:</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {result["Palabras Clave"].map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {result["Texto Completo"] && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="font-bold text-gray-700 mb-2">Contenido completo:</div>
                  <div className="text-gray-700 text-sm bg-white p-4 rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                    {result["Texto Completo"].split('\n').map((paragraph, idx) => (
                      paragraph ? <p key={idx} className="mb-2">{paragraph}</p> : <br key={idx} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsVerifier;