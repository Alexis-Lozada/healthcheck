// services/analytics/charts.tsx
import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://ml.healthcheck.news';

interface TrendsFilters {
  dateRange: '1d' | '7d' | '30d' | '90d';
  truthStatus: 'all' | 'verdadera' | 'falsa';
  limit?: number;
}

interface TrendsSeries {
  name: string;
  data: number[];
}

interface TrendsData {
  series: TrendsSeries[];
}

export const useTrendsData = (filters: TrendsFilters) => {
  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        date_range: filters.dateRange,
        truth_status: filters.truthStatus,
        ...(filters.limit && { limit: filters.limit.toString() })
      });

      const response = await fetch(`${API_BASE_URL}/api/ml/analytics/trends?${params}`);
      const result = await response.json();
      
      if (result.status === 'success' && result.data) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Error fetching data');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendsData();
  }, [filters.dateRange, filters.truthStatus, filters.limit]);

  return { data, loading, error, refetch: fetchTrendsData };
};

export const generateCategories = (dateRange: TrendsFilters['dateRange']) => {
  const categories = {
    '1d': ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    '7d': ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    '30d': ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    '90d': ['Mes 1', 'Mes 2', 'Mes 3']
  };
  return categories[dateRange];
};