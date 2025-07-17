import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { SearchHistoryItem, DataSource } from '../types';
import { useSearchHistory } from './useSearchHistory';

export function useSearchHistoryDB() {
  const [dbHistory, setDbHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const localHistory = useSearchHistory();

  // Fetch search history from database
  const fetchHistory = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('search_date', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedHistory: SearchHistoryItem[] = data.map(search => {
        // Parse JSON safely
        const filters = typeof search.filters === 'object' ? search.filters : {};
        
        return {
          id: search.id,
          query: search.query,
          timestamp: new Date(search.search_date || Date.now()).getTime(),
          resultCount: search.results_count || 0,
          dataSource: ((filters as any)?.dataSource as DataSource) || 'cache',
          responseTime: ((filters as any)?.responseTime as number) || 0
        };
      });

      setDbHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching search history:', error);
      toast({
        title: "Arama geçmişi yüklenemedi",
        description: "Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  // Save search to database
  const saveSearch = useCallback(async (
    query: string,
    resultCount: number,
    dataSource: DataSource,
    responseTime: number
  ) => {
    if (!user?.id || !query.trim()) return;

    try {
      // First add to local storage for immediate UI update
      localHistory.addToHistory(query, resultCount, dataSource, responseTime);

      // Then save to database
      const { error } = await supabase
        .from('user_searches')
        .insert({
          user_id: user.id,
          query: query.trim(),
          results_count: resultCount,
          filters: {
            dataSource,
            responseTime,
            timestamp: Date.now()
          }
        });

      if (error) throw error;
      
      // Refresh history after successful save
      await fetchHistory();
    } catch (error) {
      console.error('Error saving search:', error);
      toast({
        title: "Arama kaydedilemedi",
        description: "Arama geçmişi güncellenemedi.",
        variant: "destructive"
      });
    }
  }, [user?.id, fetchHistory, toast, localHistory]);

  // Clear all search history
  const clearHistory = useCallback(async () => {
    if (!user?.id) {
      // If not logged in, just clear local history
      localHistory.clearHistory();
      return;
    }

    try {
      // Clear local history first for immediate UI update
      localHistory.clearHistory();
      
      // Then clear database
      const { error } = await supabase
        .from('user_searches')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setDbHistory([]);
      toast({
        title: "Arama geçmişi temizlendi",
        description: "Tüm arama geçmişi silindi.",
      });
    } catch (error) {
      console.error('Error clearing search history:', error);
      toast({
        title: "Arama geçmişi temizlenemedi",
        description: "Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    }
  }, [user?.id, toast, localHistory]);

  // Remove specific search from history
  const removeSearch = useCallback(async (searchId: string) => {
    // Remove from local history first
    localHistory.removeFromHistory(searchId);
    
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_searches')
        .delete()
        .eq('id', searchId)
        .eq('user_id', user.id);

      if (error) throw error;

      setDbHistory(prev => prev.filter(item => item.id !== searchId));
      toast({
        title: "Arama silindi",
        description: "Arama geçmişten kaldırıldı.",
      });
    } catch (error) {
      console.error('Error removing search:', error);
      toast({
        title: "Arama silinemedi",
        description: "Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    }
  }, [user?.id, toast, localHistory]);

  // Setup real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('user_searches_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_searches',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchHistory]);

  // Initial fetch
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Combine local and DB history
  const combinedHistory = useCallback(() => {
    // When logged in, prefer DB history
    if (user?.id) {
      return dbHistory.length > 0 ? dbHistory : localHistory.searchHistory;
    }
    // When not logged in, use local history
    return localHistory.searchHistory;
  }, [user?.id, dbHistory, localHistory.searchHistory]);

  return {
    history: combinedHistory(),
    loading,
    saveSearch,
    clearHistory,
    removeSearch,
    refreshHistory: fetchHistory
  };
}