import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthData } from '@/contexts/AuthDataContext';
import { supabase } from '@/integrations/supabase/client';
import { useApiState } from './useApiState';

interface DashboardStats {
  totalCases: number;
  savedCasesCount: number;
  recentSearches: any[];
  savedCases: any[];
  monthlySearches: number;
  searchTrends: any[];
}

export const useDashboard = () => {
  const { user, profile } = useAuthData();
  const apiState = useApiState<DashboardStats>({
    totalCases: 0,
    savedCasesCount: 0,
    recentSearches: [],
    savedCases: [],
    monthlySearches: 0,
    searchTrends: []
  });

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    const fetchPromise = (async () => {
      // Fetch user searches
      const { data: searches, error: searchError } = await supabase
        .from('user_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('search_date', { ascending: false })
        .limit(5);

      if (searchError) throw searchError;

      // Fetch saved cases
      const { data: savedCases, error: savedError } = await supabase
        .from('saved_cases')
        .select(`
          *,
          legal_cases (
            title,
            court,
            decision_date,
            case_number
          )
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false })
        .limit(3);

      if (savedError) throw savedError;

      // Fetch total legal cases count
      const { count: totalCases, error: countError } = await supabase
        .from('legal_cases')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Generate search trends for the last 7 days
      const searchTrends = await generateSearchTrends(user.id);

      return {
        totalCases: totalCases || 0,
        savedCasesCount: savedCases?.length || 0,
        recentSearches: searches || [],
        savedCases: savedCases || [],
        monthlySearches: profile?.monthly_search_count || 0,
        searchTrends
      };
    })();

    return apiState.execute(fetchPromise);
  }, [user, profile?.monthly_search_count, apiState]);

  const generateSearchTrends = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_searches')
        .select('search_date')
        .eq('user_id', userId)
        .gte('search_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Group by date and count
      const trendsMap = new Map();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toDateString();
      }).reverse();

      // Initialize with 0
      last7Days.forEach(date => trendsMap.set(date, 0));

      // Count searches by date
      data?.forEach(search => {
        const searchDate = new Date(search.search_date).toDateString();
        if (trendsMap.has(searchDate)) {
          trendsMap.set(searchDate, trendsMap.get(searchDate) + 1);
        }
      });

      return Array.from(trendsMap.entries()).map(([date, count]) => ({
        date,
        searches: count
      }));
    } catch (error) {
      console.error('Error generating search trends:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  const refreshData = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Memoized stats with fallback
  const stats = useMemo(() => apiState.data || {
    totalCases: 0,
    savedCasesCount: 0,
    recentSearches: [],
    savedCases: [],
    monthlySearches: 0,
    searchTrends: []
  }, [apiState.data]);

  return {
    stats,
    loading: apiState.loading,
    error: apiState.error,
    refreshData,
    user,
    profile
  };
};