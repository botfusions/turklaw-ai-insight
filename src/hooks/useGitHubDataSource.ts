
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
  const [mevzuatCache, setMevzuatCache] = useLocalStorage<MevzuatResult[]>(CACHE_KEY_MEVZUAT, []);
  const [yargiCache, setYargiCache] = useLocalStorage<MevzuatResult[]>(CACHE_KEY_YARGI, []);
  const [lastUpdateCache, setLastUpdateCache] = useLocalStorage<string | null>(CACHE_KEY_LAST_UPDATE, null);

  const [state, setState] = useState<GitHubDataState>({
    mevzuatData: mevzuatCache,
    yargiData: yargiCache,
    loading: false,
    error: null,
    lastUpdate: lastUpdateCache ? new Date(lastUpdateCache) : null,
    autoRefresh: true,
    dataStatus: mevzuatCache.length > 0 || yargiCache.length > 0 ? 'active' : 'loading'
  });

  const normalizeData = (data: any[], source: 'mevzuat' | 'yargi'): MevzuatResult[] => {
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
  };

  const fetchGitHubData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null, dataStatus: 'loading' }));

    try {
      const [mevzuatResponse, yargiResponse] = await Promise.allSettled([
        fetch(GITHUB_ENDPOINTS.mevzuat),
        fetch(GITHUB_ENDPOINTS.yargi)
      ]);

      let mevzuatData: MevzuatResult[] = [];
      let yargiData: MevzuatResult[] = [];

      // Process mevzuat data
      if (mevzuatResponse.status === 'fulfilled' && mevzuatResponse.value.ok) {
        const rawMevzuat = await mevzuatResponse.value.json();
        mevzuatData = normalizeData(rawMevzuat.data || rawMevzuat, 'mevzuat');
        setMevzuatCache(mevzuatData);
      }

      // Process yargi data
      if (yargiResponse.status === 'fulfilled' && yargiResponse.value.ok) {
        const rawYargi = await yargiResponse.value.json();
        yargiData = normalizeData(rawYargi.data || rawYargi, 'yargi');
        setYargiCache(yargiData);
      }

      const now = new Date();
      setLastUpdateCache(now.toISOString());

      setState(prev => ({
        ...prev,
        mevzuatData,
        yargiData,
        loading: false,
        lastUpdate: now,
        dataStatus: mevzuatData.length > 0 || yargiData.length > 0 ? 'active' : 'error'
      }));

      console.log(`GitHub data fetched: ${mevzuatData.length} mevzuat, ${yargiData.length} yargi`);

    } catch (error) {
      console.error('GitHub data fetch error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'GitHub veri çekme hatası',
        dataStatus: 'error'
      }));
    }
  }, [setMevzuatCache, setYargiCache, setLastUpdateCache]);

  const searchInGitHubData = useCallback((query: string, maxResults: number = 10): MevzuatResult[] => {
    const searchTerm = query.trim().toLowerCase();
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
  }, [state.mevzuatData, state.yargiData]);

  const toggleAutoRefresh = useCallback(() => {
    setState(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }));
  }, []);

  const manualRefresh = useCallback(() => {
    fetchGitHubData();
  }, [fetchGitHubData]);

  // Auto-refresh effect
  useEffect(() => {
    if (!state.autoRefresh) return;

    const interval = setInterval(() => {
      fetchGitHubData();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [state.autoRefresh, fetchGitHubData]);

  // Initial fetch
  useEffect(() => {
    // Only fetch if we don't have cached data or it's older than 5 minutes
    const shouldFetch = !state.lastUpdate || 
      (Date.now() - state.lastUpdate.getTime()) > REFRESH_INTERVAL;
    
    if (shouldFetch) {
      fetchGitHubData();
    }
  }, []);

  return {
    ...state,
    searchInGitHubData,
    toggleAutoRefresh,
    manualRefresh,
    totalRecords: state.mevzuatData.length + state.yargiData.length
  };
};
