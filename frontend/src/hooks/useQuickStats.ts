import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://ml.healthcheck.news';

export interface DashboardStatsData {
  status: 'success' | 'error';
  data: {
    news_analyzed: {
      value: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    };
    truth_rate: {
      value: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    };
    active_topics: {
      value: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    };
    sources_found: {
      value: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
  metadata: {
    date: string;
    comparison_date: string;
  };
}

export interface UseDashboardStatsReturn {
  stats: DashboardStatsData['data'] | null;
  metadata: DashboardStatsData['metadata'] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardStats = (): UseDashboardStatsReturn => {
  const [stats, setStats] = useState<DashboardStatsData['data'] | null>(null);
  const [metadata, setMetadata] = useState<DashboardStatsData['metadata'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/ml/analytics/quick-stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DashboardStatsData = await response.json();
      
      if (result.status === 'success') {
        setStats(result.data);
        setMetadata(result.metadata);
      } else {
        throw new Error('Failed to fetch dashboard stats');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching dashboard stats:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    stats,
    metadata,
    loading,
    error,
    refetch: fetchDashboardStats
  };
};