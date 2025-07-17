import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type UserSearch = Database['public']['Tables']['user_searches']['Row'];
type UserSearchInsert = Database['public']['Tables']['user_searches']['Insert'];

export interface EnhancedSearchHistoryItem {
  id: string;
  user_id: string;
  query: string;
  filters: {
    category?: string;
    subcategory?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  results_count: number;
  search_date: string;
  response_time?: number;
  data_source: 'primary' | 'fallback' | 'cache' | 'error';
  is_bookmarked?: boolean;
  tags?: string[];
}

const MAX_HISTORY_SIZE = 100;

export const useSearchHistoryDB = () => {
  const [searchHistory, setSearchHistory] = useState<EnhancedSearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fallback to localStorage when offline or not authenticated
  const [localHistory, setLocalHistory] = useLocalStorage<EnhancedSearchHistoryItem[]>('search_history_backup', []);

  // Load search history from database
  const loadSearchHistory = useCallback(async () => {
    if (!user) {
      setSearchHistory(localHistory);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('search_date', { ascending: false })
        .limit(MAX_HISTORY_SIZE);

      if (error) throw error;

      const enhancedHistory: EnhancedSearchHistoryItem[] = data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        query: item.query,
        filters: item.filters as any || {},
        results_count: item.results_count || 0,
        search_date: item.search_date || new Date().toISOString(),
        response_time: undefined,
        data_source: 'primary' as const,
        is_bookmarked: false,
        tags: []
      }));

      setSearchHistory(enhancedHistory);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Arama geçmişi yüklenemedi');
      setSearchHistory(localHistory);
    } finally {
      setLoading(false);
    }
  }, [user, localHistory]);

  // Save search to database
  const addToHistory = useCallback(async (
    query: string,
    resultsCount: number,
    dataSource: 'primary' | 'fallback' | 'cache' | 'error',
    responseTime?: number,
    filters?: any
  ) => {
    const historyItem: EnhancedSearchHistoryItem = {
      id: Date.now().toString(),
      user_id: user?.id || 'anonymous',
      query: query.trim(),
      filters: filters || {},
      results_count: resultsCount,
      search_date: new Date().toISOString(),
      response_time: responseTime,
      data_source: dataSource,
      is_bookmarked: false,
      tags: []
    };

    // Update local state immediately
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.query !== query.trim());
      return [historyItem, ...filtered].slice(0, MAX_HISTORY_SIZE);
    });

    // Save to localStorage as backup
    setLocalHistory(prev => {
      const filtered = prev.filter(item => item.query !== query.trim());
      return [historyItem, ...filtered].slice(0, MAX_HISTORY_SIZE);
    });

    // Save to database if authenticated
    if (user) {
      try {
        const insertData: UserSearchInsert = {
          user_id: user.id,
          query: query.trim(),
          filters: filters || {},
          results_count: resultsCount
        };

        const { error } = await supabase
          .from('user_searches')
          .insert(insertData);

        if (error) throw error;
      } catch (err) {
        console.error('Database save failed:', err);
        toast({
          title: "Uyarı",
          description: "Arama geçmişi kaydedilemedi, ancak arama tamamlandı.",
          variant: "destructive"
        });
      }
    }
  }, [user, toast, setLocalHistory]);

  // Remove item from history
  const removeFromHistory = useCallback(async (id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
    setLocalHistory(prev => prev.filter(item => item.id !== id));

    if (user) {
      try {
        const { error } = await supabase
          .from('user_searches')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (err) {
        console.error('Database delete failed:', err);
        toast({
          title: "Hata",
          description: "Kayıt silinemedi.",
          variant: "destructive"
        });
      }
    }
  }, [user, toast, setLocalHistory]);

  // Clear all history
  const clearHistory = useCallback(async () => {
    setSearchHistory([]);
    setLocalHistory([]);

    if (user) {
      try {
        const { error } = await supabase
          .from('user_searches')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
        
        toast({
          title: "Başarılı",
          description: "Arama geçmişi temizlendi.",
        });
      } catch (err) {
        console.error('Database clear failed:', err);
        toast({
          title: "Hata",
          description: "Geçmiş temizlenemedi.",
          variant: "destructive"
        });
      }
    }
  }, [user, toast, setLocalHistory]);

  // Toggle bookmark
  const toggleBookmark = useCallback(async (id: string) => {
    setSearchHistory(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, is_bookmarked: !item.is_bookmarked }
          : item
      )
    );
  }, []);

  // Get recent queries
  const getRecentQueries = useCallback((limit: number = 10) => {
    return searchHistory
      .slice(0, limit)
      .map(item => item.query);
  }, [searchHistory]);

  // Get bookmarked searches
  const getBookmarkedSearches = useCallback(() => {
    return searchHistory.filter(item => item.is_bookmarked);
  }, [searchHistory]);

  // Get search analytics
  const getSearchAnalytics = useCallback(() => {
    const stats = {
      total: searchHistory.length,
      byDataSource: {
        primary: 0,
        fallback: 0,
        cache: 0,
        error: 0
      },
      averageResponseTime: 0,
      averageResultCount: 0,
      bookmarkedCount: 0,
      recentActivity: searchHistory.slice(0, 5)
    };

    if (searchHistory.length === 0) return stats;

    let totalResponseTime = 0;
    let totalResultCount = 0;
    let responseTimeCount = 0;

    searchHistory.forEach(item => {
      stats.byDataSource[item.data_source]++;
      if (item.response_time) {
        totalResponseTime += item.response_time;
        responseTimeCount++;
      }
      totalResultCount += item.results_count;
      if (item.is_bookmarked) stats.bookmarkedCount++;
    });

    stats.averageResponseTime = responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0;
    stats.averageResultCount = totalResultCount / searchHistory.length;

    return stats;
  }, [searchHistory]);

  // Load history on mount and when user changes
  useEffect(() => {
    loadSearchHistory();
  }, [loadSearchHistory]);

  // Set up real-time subscription for authenticated users
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('search_history_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_searches',
        filter: `user_id=eq.${user.id}`
      }, () => {
        loadSearchHistory();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, loadSearchHistory]);

  return {
    searchHistory,
    loading,
    error,
    isAuthenticated: !!user,
    addToHistory,
    removeFromHistory,
    clearHistory,
    toggleBookmark,
    getRecentQueries,
    getBookmarkedSearches,
    getSearchAnalytics,
    refreshHistory: loadSearchHistory
  };
};