'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { getUrlPreview } from '@/services/newsService';

interface RelatedNews {
  title: string;
  snippet: string;
  url: string;
  classification: string;
  confidence: number;
}

interface RelatedNewsCardProps {
  news: RelatedNews;
}

interface UrlPreviewData {
  title?: string;
  description?: string;
  image?: {
    url: string;
  };
  logo?: {
    url: string;
  };
}

const RelatedNewsCard = ({ news }: RelatedNewsCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [previewData, setPreviewData] = useState<UrlPreviewData | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);
  
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const data = await getUrlPreview(news.url);
        setPreviewData(data);
      } catch (error) {
        console.error('Error fetching preview:', error);
      } finally {
        setIsLoadingPreview(false);
      }
    };

    fetchPreview();
  }, [news.url]);

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

  // Get the best available image
  const getImageUrl = () => {
    if (previewData?.image?.url) {
      return previewData.image.url;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="flex-none w-80 bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      <a href={news.url} target="_blank" rel="noopener noreferrer" className="block">
        {/* Image Section */}
        <div className="p-3">
          <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
            {isLoadingPreview ? (
              <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
            ) : imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt={previewData?.title || news.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(true);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ExternalLink className="w-8 h-8" />
              </div>
            )}
            
            {!imageLoaded && imageUrl && !imageError && !isLoadingPreview && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 pb-4">
          {isLoadingPreview ? (
            // Skeleton for content
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-32"></div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ) : (
            <>
              <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                {previewData?.title || news.title}
              </h4>
              
              {/* Classification Badge */}
              {news.classification !== 'unknown' && (
                <div className="mb-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getClassificationColor(news.classification)}`}>
                    {getClassificationIcon(news.classification)}
                    {news.classification === 'verdadera' ? 'Probablemente verdadera' : 'Probablemente falsa'}
                  </span>
                </div>
              )}

              {/* Confidence Bar */}
              {news.confidence > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          news.classification.toLowerCase() === 'verdadera' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${formatConfidence(news.confidence)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {formatConfidence(news.confidence)}%
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </a>
    </div>
  );
};

export default RelatedNewsCard;