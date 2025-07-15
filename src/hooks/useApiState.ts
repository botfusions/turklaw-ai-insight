import { useState, useCallback } from 'react';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface ApiActions<T> {
  execute: (promise: Promise<T>) => Promise<T>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
}

export function useApiState<T = any>(initialData: T | null = null): ApiState<T> & ApiActions<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(async (promise: Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await promise;
      setData(result);
      setSuccess(true);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bir hata oluştu';
      setError(errorMessage);
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    success,
    execute,
    reset,
    setData,
    setError
  };
}