'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FileText, Link, Search, CheckCircle, XCircle, Info, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import RelatedNewsCard from '@/components/news/RelatedNewsCard';

const API_URL = 'https://ml.healthcheck.news/api';

interface RelatedNews {
  title: string;
  snippet: string;
  url: string;
  classification: string;
  confidence: number;
}

interface VerificationResult {
  news_id: number;
  classification: string;
  confidence: number;
  explanation: string;
  topic: string;
  keywords: string[];
  "Título": string;
  "Autor": string;
  source: string;
  "Fecha de Publicación"?: string;
  "Texto Completo": string;
  related_news: RelatedNews[];
  message: string;
}

const NewsVerifier = () => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'text' | 'url'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (value: string) => {
    setInput(value);
    
    // Auto-detect if input looks like a URL
    const urlPattern = /^(https?:\/\/|www\.)/i;
    const isUrl = urlPattern.test(value.trim());
    
    // Only auto-switch if there's actual content and it's different from current type
    if (value.trim()) {
      if (isUrl && inputType !== 'url') {
        setInputType('url');
      } else if (!isUrl && inputType !== 'text' && value.length > 10) {
        // Switch to text if it's clearly not a URL and has substantial content
        setInputType('text');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      setError('Por favor, introduce contenido para verificar');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const requestData: Record<string, any> = {
        [inputType]: input
      };
      
      if (user) {
        requestData.user_id = user.id;
      }
      
      const response = await fetch(`${API_URL}/ml/classify/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify(requestData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al verificar la información');
      }
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatConfidence = (confidence: number) => {
    return confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence);
  };

  const getClassificationColor = (classification: string) => {
    return classification.toLowerCase() === 'verdadera' 
      ? 'text-green-600 bg-green-50 border-green-200' 
      : 'text-red-600 bg-red-50 border-red-200';
  };

  const getClassificationIcon = (classification: string) => {
    return classification.toLowerCase() === 'verdadera' 
      ? <CheckCircle className="w-4 h-4 inline mr-1" />
      : <XCircle className="w-4 h-4 inline mr-1" />;
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of one card + gap
      const currentScroll = scrollRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* News Verifier */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificador de Noticias</h2>
          <p className="text-gray-600">Verifica la autenticidad de noticias con IA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Type Toggle */}
          <div className="flex mb-4">
            <div className="relative bg-gray-100 rounded-lg p-1 flex">
              {/* Background slider */}
              <div 
                className={`absolute top-1 bottom-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md transition-transform duration-300 ease-in-out shadow-md ${
                  inputType === 'url' ? 'translate-x-[calc(100%-0.25rem)]' : 'translate-x-0'
                }`}
                style={{ 
                  width: 'calc(50% - 0.125rem)',
                  left: '0.25rem'
                }}
              />
              
              {/* Text option */}
              <button
                type="button"
                onClick={() => setInputType('text')}
                className={`relative z-10 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 min-w-[100px] justify-center overflow-hidden group ${
                  inputType === 'text'
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="relative z-10">Texto</span>
                {/* Shimmer effect for active state */}
                {inputType === 'text' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                )}
              </button>
              
              {/* URL option */}
              <button
                type="button"
                onClick={() => setInputType('url')}
                className={`relative z-10 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 min-w-[100px] justify-center overflow-hidden group ${
                  inputType === 'url'
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Link className="w-4 h-4" />
                <span className="relative z-10">URL</span>
                {/* Shimmer effect for active state */}
                {inputType === 'url' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                )}
              </button>
            </div>
          </div>

          {/* Input Field */}
          {inputType === 'text' ? (
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Pega aquí el texto de la noticia que quieres verificar..."
              rows={5}
              className="w-full p-4 text-base text-gray-700 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
            />
          ) : (
            <input
              type="url"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="https://ejemplo.com/noticia"
              className="w-full p-4 text-base text-gray-700 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          )}

          {/* Submit Button - Updated with gradient style and shimmer effect */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 overflow-hidden group relative ${
              isLoading || !input.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center relative z-10">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verificando...
              </span>
            ) : (
              <>
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <Search className="w-5 h-5" />
                  Verificar Noticia
                </span>
                {/* Shimmer effect - only shown when not disabled */}
                {!isLoading && input.trim() && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                )}
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Resultado del Análisis</h3>
            <div className={`px-4 py-2 rounded-lg border font-medium ${getClassificationColor(result.classification)}`}>
              {getClassificationIcon(result.classification)} {result.classification.toUpperCase()}
            </div>
          </div>

          {/* Confidence Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Nivel de confianza</span>
              <span>{formatConfidence(result.confidence)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  result.classification.toLowerCase() === 'verdadera' ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${formatConfidence(result.confidence)}%` }}
              />
            </div>
          </div>

          {/* Explanation */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Explicación</h4>
            <p className="text-gray-600">{result.explanation}</p>
          </div>

          {/* Topic and Keywords */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Tema</h4>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {result.topic}
              </span>
            </div>

            {result.keywords.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Palabras Clave</h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.slice(0, 3).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Source Info */}
          <div className="text-sm text-gray-600 space-y-1">
            {result["Título"] && result["Título"] !== "Not available" && (
              <p><span className="font-medium">Título:</span> {result["Título"]}</p>
            )}
            {result["Autor"] && result["Autor"] !== "Unknown" && (
              <p><span className="font-medium">Autor:</span> {result["Autor"]}</p>
            )}
            {result.source && result.source !== "Direct text input" && (
              <p>
                <span className="font-medium">Fuente:</span>{' '}
                <a href={result.source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                  Ver original
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Related News Carousel */}
      {result?.related_news && result.related_news.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Noticias Relacionadas</h3>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide gap-4 pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {result.related_news.map((news, index) => (
              <RelatedNewsCard 
                key={index} 
                news={news} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsVerifier;