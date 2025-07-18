import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface QueryEnhancement {
  originalQuery: string;
  enhancedQuery: string;
  intent: 'legal_regulation_search' | 'case_search' | 'legal_advice' | 'general_search';
  legalTerms: string[];
  suggestedFilters?: {
    category?: string;
    court?: string;
    dateRange?: string;
  };
  confidence: number;
  suggestions: string[];
}

export interface AIQueryEnhancementState {
  enhancement: QueryEnhancement | null;
  loading: boolean;
  error: string | null;
  enabled: boolean;
}

export const useAIQueryEnhancement = () => {
  const [state, setState] = useState<AIQueryEnhancementState>({
    enhancement: null,
    loading: false,
    error: null,
    enabled: true
  });

  const enhanceQuery = useCallback(async (
    query: string, 
    userHistory: string[] = []
  ): Promise<QueryEnhancement | null> => {
    if (!query.trim() || !state.enabled) {
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('Enhancing query:', query);
      
      const { data, error } = await supabase.functions.invoke('ai-query-enhancement', {
        body: { 
          query: query.trim(),
          userHistory 
        }
      });

      if (error) {
        throw new Error(error.message || 'AI query enhancement failed');
      }

      if (data?.error) {
        console.error('AI Enhancement API Error:', data.error);
        // Use fallback if API fails
        if (data.fallback) {
          const fallbackEnhancement: QueryEnhancement = {
            originalQuery: query,
            enhancedQuery: query,
            intent: 'general_search',
            legalTerms: [query],
            confidence: 0.5,
            suggestions: []
          };
          setState(prev => ({ 
            ...prev, 
            enhancement: fallbackEnhancement, 
            loading: false,
            error: 'AI enhancement unavailable, using basic search'
          }));
          return fallbackEnhancement;
        }
        throw new Error(data.details || 'AI enhancement failed');
      }

      const enhancement: QueryEnhancement = data;
      console.log('Query enhanced:', enhancement);

      setState(prev => ({ 
        ...prev, 
        enhancement, 
        loading: false 
      }));

      return enhancement;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Query enhancement error:', errorMessage);
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        loading: false 
      }));

      // Return fallback enhancement
      const fallbackEnhancement: QueryEnhancement = {
        originalQuery: query,
        enhancedQuery: query,
        intent: 'general_search',
        legalTerms: [query],
        confidence: 0.5,
        suggestions: []
      };

      return fallbackEnhancement;
    }
  }, [state.enabled]);

  const toggleAIEnhancement = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, enabled }));
  }, []);

  const clearEnhancement = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      enhancement: null, 
      error: null 
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    enhanceQuery,
    toggleAIEnhancement,
    clearEnhancement,
    clearError
  };
};