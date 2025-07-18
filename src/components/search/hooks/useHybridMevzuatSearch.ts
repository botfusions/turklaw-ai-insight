
import { useState, useCallback } from 'react';
import { HybridSearchState, MevzuatResult, DataSource, PerformanceInfo } from '../types';
import { useSearchHistory } from './useSearchHistory';
import { useGitHubDataSource } from '@/hooks/useGitHubDataSource';
import { getCacheEntry, setCacheEntry, clearCache, getCacheSize } from '../utils/cacheUtils';
import { fetchPrimaryAPI, fetchFallbackJSON, searchInFallbackData } from '../utils/apiUtils';

export const useHybridMevzuatSearch = (options: {
  cacheEnabled?: boolean;
  primaryTimeout?: number;
  fallbackEnabled?: boolean;
  cacheFirst?: boolean;
  githubEnabled?: boolean;
} = {}) => {
  const {
    cacheEnabled = true,
    primaryTimeout = 5000,
    fallbackEnabled = true,
    cacheFirst = false,
    githubEnabled = true
  } = options;
  
  const { addToHistory, searchHistory, clearHistory, getHistorySize } = useSearchHistory();
  const { searchInGitHubData, dataStatus: githubDataStatus } = useGitHubDataSource();
  
  const [state, setState] = useState<HybridSearchState>({
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
    },
    cacheSize: getCacheSize(),
    historySize: 0,
    lastCacheCleared: null
  });
  
  const searchMevzuat = useCallback(async (query: string, maxResults: number = 10) => {
    if (!query.trim()) return [];
    
    const startTime = Date.now();
    let apiAttempts = 0;
    let finalResults: MevzuatResult[] = [];
    let finalDataSource: DataSource = 'primary';
    let cacheHit = false;
    
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null,
      performanceInfo: { ...prev.performanceInfo, apiAttempts: 0 }
    }));
    
    try {
      // 1. Cache kontrolü (eğer cache-first veya cache enabled ise)
      if (cacheEnabled && (cacheFirst || !navigator.onLine)) {
        const cached = getCacheEntry(query, maxResults);
        if (cached) {
          finalResults = cached.results.slice(0, maxResults);
          finalDataSource = 'cache';
          cacheHit = true;
          
          // Cache-first modunda cache'den sonuç varsa hemen dön
          if (cacheFirst && finalResults.length > 0) {
            const responseTime = Date.now() - startTime;
            const perfInfo: PerformanceInfo = {
              responseTime,
              cacheHit: true,
              apiAttempts: 0,
              dataSource: 'cache'
            };
            
            setState(prev => ({
              ...prev,
              results: finalResults,
              loading: false,
              hasSearched: true,
              dataSource: finalDataSource,
              performanceInfo: perfInfo,
              searchHistory: searchHistory
            }));
            
            addToHistory(query, finalResults.length, finalDataSource, responseTime);
            return finalResults;
          }
        }
      }
      
      // 2. Primary API'yi dene
      try {
        apiAttempts++;
        const primaryResults = await fetchPrimaryAPI(query, primaryTimeout, maxResults);
        finalResults = primaryResults.slice(0, maxResults);
        finalDataSource = 'primary';
        
        // Başarılı sonucu cache'e kaydet
        if (cacheEnabled && finalResults.length > 0) {
          setCacheEntry(query, finalResults, finalDataSource, maxResults);
        }
        
      } catch (primaryError) {
        console.warn('Primary API hatası:', primaryError);
        
        // 3. GitHub Actions data'sını dene (YENİ FALLBACK)
        if (githubEnabled && githubDataStatus === 'active') {
          try {
            finalResults = searchInGitHubData(query, maxResults);
            if (finalResults.length > 0) {
              finalDataSource = 'github';
              
              // GitHub sonucunu da cache'e kaydet
              if (cacheEnabled) {
                setCacheEntry(query, finalResults, finalDataSource, maxResults);
              }
              
              console.log(`GitHub data used: ${finalResults.length} results found`);
            } else {
              throw new Error('GitHub data\'da sonuç bulunamadı');
            }
            
          } catch (githubError) {
            console.warn('GitHub data arama hatası:', githubError);
            
            // 4. Fallback JSON'u dene
            if (fallbackEnabled) {
              try {
                apiAttempts++;
                const fallbackData = await fetchFallbackJSON();
                finalResults = searchInFallbackData(fallbackData, query, maxResults);
                finalDataSource = 'fallback';
                
                // Fallback sonucunu da cache'e kaydet
                if (cacheEnabled && finalResults.length > 0) {
                  setCacheEntry(query, finalResults, finalDataSource, maxResults);
                }
                
              } catch (fallbackError) {
                console.warn('Fallback API hatası:', fallbackError);
                
                // 5. Son çare olarak cache'deki eski veriyi kullan
                if (cacheEnabled && !cacheHit) {
                  const cached = getCacheEntry(query, maxResults);
                  if (cached) {
                    finalResults = cached.results.slice(0, maxResults);
                    finalDataSource = 'cache';
                    cacheHit = true;
                  }
                }
                
                // Hiçbir şey bulunamadıysa hata fırlat
                if (finalResults.length === 0) {
                  finalDataSource = 'error';
                  throw new Error('Tüm veri kaynakları başarısız oldu');
                }
              }
            } else {
              throw githubError;
            }
          }
        } else {
          // GitHub data kullanılamıyorsa doğrudan fallback'e geç
          if (fallbackEnabled) {
            try {
              apiAttempts++;
              const fallbackData = await fetchFallbackJSON();
              finalResults = searchInFallbackData(fallbackData, query, maxResults);
              finalDataSource = 'fallback';
              
              // Fallback sonucunu da cache'e kaydet
              if (cacheEnabled && finalResults.length > 0) {
                setCacheEntry(query, finalResults, finalDataSource, maxResults);
              }
              
            } catch (fallbackError) {
              console.warn('Fallback API hatası:', fallbackError);
              
              // Son çare olarak cache'deki eski veriyi kullan
              if (cacheEnabled && !cacheHit) {
                const cached = getCacheEntry(query, maxResults);
                if (cached) {
                  finalResults = cached.results.slice(0, maxResults);
                  finalDataSource = 'cache';
                  cacheHit = true;
                }
              }
              
              // Hiçbir şey bulunamadıysa hata fırlat
              if (finalResults.length === 0) {
                finalDataSource = 'error';
                throw new Error('Tüm veri kaynakları başarısız oldu');
              }
            }
          } else {
            throw primaryError;
          }
        }
      }
      
      const responseTime = Date.now() - startTime;
      const perfInfo: PerformanceInfo = {
        responseTime,
        cacheHit,
        apiAttempts,
        dataSource: finalDataSource
      };
      
      setState(prev => ({
        ...prev,
        results: finalResults,
        loading: false,
        hasSearched: true,
        dataSource: finalDataSource,
        performanceInfo: perfInfo,
        searchHistory: searchHistory,
        cacheSize: getCacheSize(),
        historySize: getHistorySize()
      }));
      
      // Search history'ye ekle
      addToHistory(query, finalResults.length, finalDataSource, responseTime);
      
      return finalResults;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
        hasSearched: true,
        dataSource: 'error',
        performanceInfo: {
          responseTime,
          cacheHit,
          apiAttempts,
          dataSource: 'error'
        },
        searchHistory: searchHistory,
        cacheSize: getCacheSize(),
        historySize: getHistorySize()
      }));
      
      throw error;
    }
  }, [cacheEnabled, primaryTimeout, fallbackEnabled, cacheFirst, githubEnabled, addToHistory, searchHistory, getHistorySize, searchInGitHubData, githubDataStatus]);
  
  const setQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
  }, []);
  
  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      results: [],
      error: null,
      hasSearched: false,
      dataSource: 'primary',
      performanceInfo: {
        responseTime: 0,
        cacheHit: false,
        apiAttempts: 0,
        dataSource: 'primary'
      }
    }));
  }, []);
  
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);
  
  const clearSearchCache = useCallback(() => {
    clearCache();
    setState(prev => ({
      ...prev,
      cacheSize: 0,
      lastCacheCleared: Date.now()
    }));
  }, []);
  
  const clearSearchHistory = useCallback(() => {
    clearHistory();
    setState(prev => ({
      ...prev,
      historySize: 0
    }));
  }, [clearHistory]);
  
  return {
    ...state,
    searchMevzuat,
    setQuery,
    clearResults,
    clearError,
    clearSearchCache,
    clearSearchHistory,
    githubDataStatus
  };
};
