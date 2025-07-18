import { useState, useCallback } from 'react';
import { useHybridMevzuatSearch } from './useHybridMevzuatSearch';
import { useAIQueryEnhancement, QueryEnhancement } from '@/hooks/useAIQueryEnhancement';
import { MevzuatResult, DataSource, PerformanceInfo } from '../types';

export interface AIEnhancedSearchState {
  query: string;
  results: MevzuatResult[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  dataSource: DataSource;
  aiEnhancement: QueryEnhancement | null;
  aiLoading: boolean;
  aiEnabled: boolean;
  searchHistory: string[];
  performanceInfo: PerformanceInfo & {
    aiEnhancementTime?: number;
  };
}

export const useAIEnhancedMevzuatSearch = () => {
  const hybridSearch = useHybridMevzuatSearch();
  const aiEnhancement = useAIQueryEnhancement();
  
  const [aiEnhancedState, setAIEnhancedState] = useState({
    aiEnabled: true,
    searchHistory: [] as string[]
  });

  const searchMevzuat = useCallback(async (
    query: string, 
    maxResults: number = 10
  ): Promise<MevzuatResult[]> => {
    if (!query.trim()) return [];

    const startTime = Date.now();
    let finalQuery = query;
    let enhancement: QueryEnhancement | null = null;

    // AI Enhancement if enabled
    if (aiEnhancedState.aiEnabled) {
      try {
        enhancement = await aiEnhancement.enhanceQuery(
          query, 
          aiEnhancedState.searchHistory
        );
        
        if (enhancement && enhancement.confidence > 0.7) {
          finalQuery = enhancement.enhancedQuery;
          console.log('Using AI enhanced query:', finalQuery);
        }
      } catch (error) {
        console.warn('AI enhancement failed, using original query:', error);
        // Continue with original query if AI fails
      }
    }

    const aiEnhancementTime = Date.now() - startTime;

    // Perform the actual search with enhanced or original query
    const results = await hybridSearch.searchMevzuat(finalQuery, maxResults);

    // Update search history
    setAIEnhancedState(prev => ({
      ...prev,
      searchHistory: [query, ...prev.searchHistory.slice(0, 9)] // Keep last 10 searches
    }));

    return results;
  }, [hybridSearch.searchMevzuat, aiEnhancement.enhanceQuery, aiEnhancedState.aiEnabled, aiEnhancedState.searchHistory]);

  const toggleAIEnhancement = useCallback((enabled: boolean) => {
    setAIEnhancedState(prev => ({ ...prev, aiEnabled: enabled }));
    aiEnhancement.toggleAIEnhancement(enabled);
  }, [aiEnhancement.toggleAIEnhancement]);

  const clearSearchHistory = useCallback(() => {
    setAIEnhancedState(prev => ({ ...prev, searchHistory: [] }));
  }, []);

  // Combine states from hybrid search and AI enhancement
  const combinedState: AIEnhancedSearchState = {
    query: hybridSearch.query,
    results: hybridSearch.results,
    loading: hybridSearch.loading || aiEnhancement.loading,
    error: hybridSearch.error || aiEnhancement.error,
    hasSearched: hybridSearch.hasSearched,
    dataSource: hybridSearch.dataSource,
    aiEnhancement: aiEnhancement.enhancement,
    aiLoading: aiEnhancement.loading,
    aiEnabled: aiEnhancedState.aiEnabled,
    searchHistory: aiEnhancedState.searchHistory,
    performanceInfo: {
      ...hybridSearch.performanceInfo,
      aiEnhancementTime: aiEnhancement.loading ? undefined : 
        (aiEnhancement.enhancement ? 200 : 0) // Estimate if not available
    }
  };

  return {
    ...combinedState,
    searchMevzuat,
    setQuery: hybridSearch.setQuery,
    clearResults: hybridSearch.clearResults,
    clearError: () => {
      hybridSearch.clearError();
      aiEnhancement.clearError();
    },
    clearSearchCache: hybridSearch.clearSearchCache,
    clearSearchHistory,
    toggleAIEnhancement
  };
};