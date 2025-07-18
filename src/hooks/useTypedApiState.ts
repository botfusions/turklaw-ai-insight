
import { useState, useCallback } from 'react';
import { UseApiStateReturn, UseApiStateOptions } from '@/types/hooks';
import { ApiResponse } from '@/types/api';
import { useErrorHandler } from './useErrorHandler';

export function useTypedApiState<T>(
  initialData: T | null = null,
  options: UseApiStateOptions = {}
): UseApiStateReturn<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const execute = useCallback(async (promise: Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await promise;
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bir hata oluştu';
      setError(errorMessage);
      
      handleError(err as Error, {
        component: 'useTypedApiState',
        action: 'execute',
        showToast: true
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}
