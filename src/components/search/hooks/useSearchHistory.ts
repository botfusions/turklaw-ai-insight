import { useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SearchHistoryItem, DataSource } from '../types';

const MAX_HISTORY_SIZE = 50;

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useLocalStorage<SearchHistoryItem[]>('mevzuat_search_history', []);
  
  const addToHistory = useCallback((
    query: string,
    resultCount: number,
    dataSource: DataSource,
    responseTime: number
  ) => {
    const historyItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: Date.now(),
      resultCount,
      dataSource,
      responseTime
    };
    
    setSearchHistory(prev => {
      // Aynı sorguyu tekrar aratmışsa eskisini kaldır
      const filtered = prev.filter(item => item.query !== query.trim());
      
      // Yeni öğeyi başa ekle
      const newHistory = [historyItem, ...filtered];
      
      // Limiti aş
      return newHistory.slice(0, MAX_HISTORY_SIZE);
    });
  }, [setSearchHistory]);
  
  const removeFromHistory = useCallback((id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  }, [setSearchHistory]);
  
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, [setSearchHistory]);
  
  const getHistorySize = useCallback(() => {
    return searchHistory.length;
  }, [searchHistory]);
  
  const getRecentQueries = useCallback((limit: number = 10) => {
    return searchHistory
      .slice(0, limit)
      .map(item => item.query);
  }, [searchHistory]);
  
  const getHistoryStats = useCallback(() => {
    const stats = {
      total: searchHistory.length,
      byDataSource: {
        primary: 0,
        fallback: 0,
        cache: 0,
        error: 0
      },
      averageResponseTime: 0,
      averageResultCount: 0
    };
    
    if (searchHistory.length === 0) return stats;
    
    let totalResponseTime = 0;
    let totalResultCount = 0;
    
    searchHistory.forEach(item => {
      stats.byDataSource[item.dataSource]++;
      totalResponseTime += item.responseTime;
      totalResultCount += item.resultCount;
    });
    
    stats.averageResponseTime = totalResponseTime / searchHistory.length;
    stats.averageResultCount = totalResultCount / searchHistory.length;
    
    return stats;
  }, [searchHistory]);
  
  return {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistorySize,
    getRecentQueries,
    getHistoryStats
  };
};