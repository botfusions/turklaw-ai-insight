
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { MevzuatResult } from '@/components/search/types';

export interface GitHubDataState {
  mevzuatData: MevzuatResult[];
  yargiData: MevzuatResult[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  autoRefresh: boolean;
  dataStatus: 'active' | 'loading' | 'error';
}

const GITHUB_ENDPOINTS = {
  mevzuat: 'https://raw.githubusercontent.com/botfusions/mevzuat-mcp/main/public/mevzuat-data.json',
  yargi: 'https://raw.githubusercontent.com/botfusions/yargi-mcp/main/public/yargitay-data.json'
};

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY_MEVZUAT = 'github_mevzuat_data';
const CACHE_KEY_YARGI = 'github_yargi_data';
const CACHE_KEY_LAST_UPDATE = 'github_data_last_update';

export const useGitHubDataSource = () => {
  // Use localStorage hooks with proper error handling
  const [mevzuatCache, setMevzuatCache] = useLocalStorage<MevzuatResult[]>(CACHE_KEY_MEVZUAT, []);
  const [yargiCache, setYargiCache] = useLocalStorage<MevzuatResult[]>(CACHE_KEY_YARGI, []);
  const [lastUpdateCache, setLastUpdateCache] = useLocalStorage<string | null>(CACHE_KEY_LAST_UPDATE, null);

  const [state, setState] = useState<GitHubDataState>(() => {
    try {
      return {
        mevzuatData: mevzuatCache || [],
        yargiData: yargiCache || [],
        loading: false,
        error: null,
        lastUpdate: lastUpdateCache ? new Date(lastUpdateCache) : null,
        autoRefresh: true,
        dataStatus: (mevzuatCache && mevzuatCache.length > 0) || (yargiCache && yargiCache.length > 0) ? 'active' : 'loading'
      };
    } catch (error) {
      console.warn('State initialization error in useGitHubDataSource:', error);
      return {
        mevzuatData: [],
        yargiData: [],
        loading: false,
        error: null,
        lastUpdate: null,
        autoRefresh: true,
        dataStatus: 'error'
      };
    }
  });

  const normalizeData = useCallback((data: any[], source: 'mevzuat' | 'yargi'): MevzuatResult[] => {
    try {
      if (!Array.isArray(data)) return [];
      
      return data.map((item: any, index: number) => ({
        id: item.id || `${source}-${index}`,
        title: item.title || item.name || 'Başlık bulunamadı',
        content: item.content || item.description || item.summary || '',
        date: item.date || item.publication_date || '',
        type: source === 'mevzuat' ? 'mevzuat' : 'yargi',
        url: item.url || item.link || '',
        relevance: item.relevance || item.score || 0,
        source: 'github'
      }));
    } catch (error) {
      console.warn(`Data normalization error for ${source}:`, error);
      return [];
    }
  }, []);

  const fetchGitHubData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null, dataStatus: 'loading' }));

      const [mevzuatResponse, yargiResponse] = await Promise.allSettled([
        fetch(GITHUB_ENDPOINTS.mevzuat, { 
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        }).catch(error => {
          console.warn('Mevzuat fetch error:', error);
          return null;
        }),
        fetch(GITHUB_ENDPOINTS.yargi, { 
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        }).catch(error => {
          console.warn('Yargi fetch error:', error);
          return null;
        })
      ]);

      let mevzuatData: MevzuatResult[] = [];
      let yargiData: MevzuatResult[] = [];

      // Process mevzuat data with comprehensive error handling
      try {
        if (mevzuatResponse.status === 'fulfilled' && mevzuatResponse.value && mevzuatResponse.value.ok) {
          const rawMevzuat = await mevzuatResponse.value.json();
          mevzuatData = normalizeData(rawMevzuat.data || rawMevzuat, 'mevzuat');
          console.log(`Mevzuat data fetched: ${mevzuatData.length} items`);
        }
      } catch (error) {
        console.warn('Mevzuat processing error:', error);
      }

      // Process yargi data with comprehensive error handling
      try {
        if (yargiResponse.status === 'fulfilled' && yargiResponse.value && yargiResponse.value.ok) {
          const rawYargi = await yargiResponse.value.json();
          yargiData = normalizeData(rawYargi.data || rawYargi, 'yargi');
          console.log(`Yargi data fetched: ${yargiData.length} items`);
        }
      } catch (error) {
        console.warn('Yargi processing error:', error);
      }

      const now = new Date();

      // Save to cache with error handling
      try {
        if (typeof setMevzuatCache === 'function') setMevzuatCache(mevzuatData);
        if (typeof setYargiCache === 'function') setYargiCache(yargiData);
        if (typeof setLastUpdateCache === 'function') setLastUpdateCache(now.toISOString());
      } catch (error) {
        console.warn('Cache save error:', error);
      }

      setState(prev => ({
        ...prev,
        mevzuatData,
        yargiData,
        loading: false,
        lastUpdate: now,
        dataStatus: mevzuatData.length > 0 || yargiData.length > 0 ? 'active' : 'error',
        error: null
      }));

      console.log(`GitHub data fetch completed: ${mevzuatData.length} mevzuat, ${yargiData.length} yargi`);

    } catch (error) {
      console.error('GitHub data fetch error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'GitHub veri çekme hatası',
        dataStatus: 'error'
      }));
    }
  }, [normalizeData]);

  const searchInGitHubData = useCallback((query: string, maxResults: number = 10): MevzuatResult[] => {
    try {
      const searchTerm = query.trim().toLowerCase();
      if (!searchTerm) return [];
      
      const allData = [...state.mevzuatData, ...state.yargiData];
      
      const filteredResults = allData.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.content.toLowerCase().includes(searchTerm)
      );

      // Calculate relevance score
      const scoredResults = filteredResults.map(item => {
        let score = 0;
        
        if (item.title.toLowerCase().includes(searchTerm)) {
          score += 2;
        }
        
        if (item.content.toLowerCase().includes(searchTerm)) {
          score += 1;
        }
        
        return {
          ...item,
          relevance: score
        };
      });
      
      return scoredResults
        .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
        .slice(0, maxResults);
    } catch (error) {
      console.warn('GitHub data search error:', error);
      return [];
    }
  }, [state.mevzuatData, state.yargiData]);

  const toggleAutoRefresh = useCallback(() => {
    try {
      setState(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }));
    } catch (error) {
      console.warn('Toggle auto refresh error:', error);
    }
  }, []);

  const manualRefresh = useCallback(() => {
    try {
      fetchGitHubData();
    } catch (error) {
      console.warn('Manual refresh error:', error);
    }
  }, [fetchGitHubData]);

  // Auto-refresh effect with error handling
  useEffect(() => {
    if (!state.autoRefresh) return;

    let interval: NodeJS.Timeout;
    
    try {
      interval = setInterval(() => {
        fetchGitHubData();
      }, REFRESH_INTERVAL);
    } catch (error) {
      console.warn('Auto refresh setup error:', error);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.autoRefresh, fetchGitHubData]);

  // Initial fetch with error handling
  useEffect(() => {
    try {
      // Only fetch if we don't have cached data or it's older than 5 minutes
      const shouldFetch = !state.lastUpdate || 
        (Date.now() - state.lastUpdate.getTime()) > REFRESH_INTERVAL;
      
      if (shouldFetch) {
        fetchGitHubData();
      }
    } catch (error) {
      console.warn('Initial fetch error:', error);
    }
  }, []);

  return {
    ...state,
    searchInGitHubData,
    toggleAutoRefresh,
    manualRefresh,
    totalRecords: (state.mevzuatData?.length || 0) + (state.yargiData?.length || 0)
  };
};
