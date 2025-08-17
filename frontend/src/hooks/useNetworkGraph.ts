// hooks/useNetworkGraph.ts
import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://ml.healthcheck.news';

// Network Graph Types
export interface NetworkData {
  status: 'success' | 'error';
  data: Array<[string, string]>;
  metadata: {
    period: string;
    start_date: string;
    end_date: string;
    total_connections: number;
    total_nodes: number;
    levels: number;
    top_topics: Array<{
      topic: string;
      fake_news_count: number;
    }>;
    keywords_per_topic: Record<string, number>;
  };
}

export interface NetworkSummaryData {
  status: 'success' | 'error';
  data: {
    period: {
      start_date: string;
      end_date: string;
      days: number;
    };
    totals: {
      fake_news: number;
      real_news: number;
      total_news: number;
      accuracy_rate: number;
    };
    network_stats: {
      active_topics: number;
      total_keywords: number;
    };
    top_keywords: Array<{
      keyword: string;
      frequency: number;
    }>;
  };
}

export interface UseNetworkGraphReturn {
  data: Array<[string, string]>;
  metadata: NetworkData['metadata'] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseNetworkSummaryReturn {
  summary: NetworkSummaryData['data'] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useNetworkGraph = (): UseNetworkGraphReturn => {
  const [data, setData] = useState<Array<[string, string]>>([]);
  const [metadata, setMetadata] = useState<NetworkData['metadata'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNetworkData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/ml/analytics/network-graph`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: NetworkData = await response.json();
      
      if (result.status === 'success') {
        setData(result.data);
        setMetadata(result.metadata);
      } else {
        throw new Error('Failed to fetch network data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching network graph data:', err);
      setError(errorMessage);
      // Set fallback data to prevent UI crashes
      setData([["Fake News Network", "No Data Available"]]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkData();
  }, []);

  return {
    data,
    metadata,
    loading,
    error,
    refetch: fetchNetworkData
  };
};

export const useNetworkSummary = (): UseNetworkSummaryReturn => {
  const [summary, setSummary] = useState<NetworkSummaryData['data'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/ml/analytics/network-graph/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: NetworkSummaryData = await response.json();
      
      if (result.status === 'success') {
        setSummary(result.data);
      } else {
        throw new Error('Failed to fetch summary data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching network summary:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary
  };
};