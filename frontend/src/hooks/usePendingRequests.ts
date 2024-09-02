// hooks/usePendingRequestsCount.ts
import { useState, useEffect } from 'react';
import apiClient from '../apiClient';

const usePendingRequestsCount = () => {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingRequestsCount = async () => {
      try {
        const response = await apiClient.get('/api/update-requests-count');
        setPendingCount(response.data.count);
      } catch (error) {
        console.error('Failed to fetch pending requests count:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred.');
        }
      }
    };

    fetchPendingRequestsCount();
  }, []);

  return { pendingCount, error };
};

export default usePendingRequestsCount;
