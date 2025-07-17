import { useState, useCallback } from 'react';
import { MevzuatResult, MevzuatSearchState } from '../types';

export const useMevzuatSearch = () => {
  const [state, setState] = useState<MevzuatSearchState>({
    query: '',
    results: [],
    loading: false,
    error: null,
    hasSearched: false,
    dataSource: 'primary',
    searchHistory: [],
    performanceInfo: {
      responseTime: 0,
      cacheHit: false,
      apiAttempts: 0,
      dataSource: 'primary'
    }
  });

  const searchMevzuat = useCallback(async (query: string, maxResults: number = 10) => {
    if (!query.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('https://n8n.botfusions.com/webhook/mevzuat-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // API yanıtını normalize et
      const normalizedResults: MevzuatResult[] = Array.isArray(data.results) 
        ? data.results.slice(0, maxResults).map((item: any, index: number) => ({
            id: item.id || `result-${index}`,
            title: item.title || item.name || 'Başlık bulunamadı',
            content: item.content || item.description || item.summary || '',
            date: item.date || item.publication_date || '',
            type: item.type || 'mevzuat',
            url: item.url || item.link || '',
            relevance: item.relevance || item.score || 0
          }))
        : [];

      setState(prev => ({
        ...prev,
        results: normalizedResults,
        loading: false,
        hasSearched: true
      }));

      return normalizedResults;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
        hasSearched: true
      }));
      throw error;
    }
  }, []);

  const setQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
  }, []);

  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      results: [],
      error: null,
      hasSearched: false
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    searchMevzuat,
    setQuery,
    clearResults,
    clearError
  };
};