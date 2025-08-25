import { useState, useEffect } from 'react';
import { legalApi, searchHelpers } from '@/services/legalApiService';

interface SearchResult {
  id: string;
  title: string;
  summary: string;
  court: string;
  date: string;
  url?: string;
  status?: string;
  type?: string;
  esas_no?: string;
  karar_no?: string;
}

interface SearchState {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  dataSource: 'cache' | 'api' | 'github' | 'fallback';
  responseTime: number;
}

const DATA_SOURCES = {
  github: {
    yargi: 'https://raw.githubusercontent.com/botfusions/yargi-mcp/main/public/yargitay-data.json',
    mevzuat: 'https://raw.githubusercontent.com/botfusions/mevzuat-mcp/main/public/mevzuat-data.json'
  }
};

export const useLegalSearchHybrid = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    dataSource: 'cache',
    responseTime: 0
  });

  // Cache utilities
  const getCacheKey = (query: string, category: string) => 
    `legal-search-${category}-${query.toLowerCase().replace(/\s+/g, '-')}`;

  const getCachedResult = (key: string) => {
    try {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  const setCachedResult = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Cache write failed:', error);
    }
  };

  const isExpired = (cached: any, ttl: number) => {
    return Date.now() - cached.timestamp > ttl;
  };

  // API response mappers
  const mapAPIResponse = (apiData: any, source: 'yargi' | 'mevzuat'): SearchResult[] => {
    const results = apiData?.data?.results || [];
    
    return results.map((item: any) => ({
      id: item.id || `${source}-${Math.random()}`,
      title: item.title || 'Başlık Yok',
      summary: item.summary || item.content || 'Özet mevcut değil',
      court: item.court || item.daire || item.type || 'Mahkeme Bilgisi Yok',
      date: item.date || item.tarih || 'Tarih Yok',
      url: item.url || '#',
      status: item.status || 'normal',
      type: item.type || 'karar',
      esas_no: item.esas_no || '',
      karar_no: item.karar_no || ''
    }));
  };

  const filterGitHubData = (githubData: any, query: string): SearchResult[] => {
    const results = githubData?.data?.results || [];
    const queryLower = query.toLowerCase();
    
    // GitHub static data'sını query'ye göre filtrele
    const filtered = results.filter((item: any) => 
      item.title?.toLowerCase().includes(queryLower) ||
      item.summary?.toLowerCase().includes(queryLower)
    );
    
    return filtered.map((item: any) => ({
      ...item,
      status: 'github_static'
    }));
  };

  const getHardcodedFallback = (query: string, category: string): SearchResult[] => {
    const fallbackData = {
      yargi: [
        {
          id: 'fallback-yargi-1',
          title: `${query} - Yargıtay Kararı (Fallback)`,
          summary: 'Bu fallback veridir. Gerçek API çalışmadığında gösterilir.',
          court: '1. Hukuk Dairesi',
          date: '2024-01-01',
          status: 'hardcoded_fallback',
          type: 'karar'
        }
      ],
      mevzuat: [
        {
          id: 'fallback-mevzuat-1',
          title: `${query} - Mevzuat (Fallback)`,
          summary: 'Bu fallback veridir. Gerçek API çalışmadığında gösterilir.',
          court: 'Kanun',
          date: '2024-01-01',
          status: 'hardcoded_fallback',
          type: 'kanun'
        }
      ]
    };
    
    return fallbackData[category] || [];
  };

  // Main search function with hybrid fallback
  const searchHybrid = async (query: string, category: 'yargi' | 'mevzuat' = 'yargi') => {
    const startTime = Date.now();
    const cacheKey = getCacheKey(query, category);
    
    // 1. Cache kontrolü (5 dakika TTL)
    const cached = getCachedResult(cacheKey);
    if (cached && !isExpired(cached, 5 * 60 * 1000)) {
      setSearchState({
        results: cached.data,
        loading: false,
        error: null,
        dataSource: 'cache',
        responseTime: Date.now() - startTime
      });
      return;
    }

    setSearchState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // 2. Live API denemesi - yeni legalApiService kullanımı
      let apiResults: SearchResult[] = [];
      
      if (category === 'yargi') {
        const response = await searchHelpers.searchAllCourts(query);
        apiResults = response.results.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          court: item.court,
          date: item.date,
          url: item.url || '#',
          status: 'live_api',
          type: item.documentType || 'karar',
          esas_no: item.caseNumber || '',
          karar_no: item.decisionNumber || ''
        }));
      } else {
        const response = await searchHelpers.searchLegislation(query, 'name');
        apiResults = (response.results || response).map((item: any) => ({
          id: item.id || `mevzuat-${Math.random()}`,
          title: item.mevzuat_adi || item.title,
          summary: item.summary || 'Mevzuat özeti',
          court: item.mevzuat_turu || 'Kanun',
          date: item.resmi_gazete_tarihi || item.date || 'Tarih yok',
          url: item.url || '#',
          status: 'live_api',
          type: item.mevzuat_turu || 'kanun'
        }));
      }
      
      // Cache'e kaydet
      setCachedResult(cacheKey, apiResults);
      
      setSearchState({
        results: apiResults,
        loading: false,
        error: null,
        dataSource: 'api',
        responseTime: Date.now() - startTime
      });
      return;
      
    } catch (error) {
      console.warn(`Live API ${category} failed:`, error);
    }

    try {
      // 3. GitHub Actions JSON fallback
      const githubResponse = await fetch(DATA_SOURCES.github[category]);
      
      if (githubResponse.ok) {
        const githubData = await githubResponse.json();
        const results = filterGitHubData(githubData, query);
        
        setSearchState({
          results,
          loading: false,
          error: null,
          dataSource: 'github',
          responseTime: Date.now() - startTime
        });
        return;
      }
    } catch (error) {
      console.warn(`GitHub fallback ${category} failed:`, error);
    }

    // 4. Son çare: Hardcoded fallback
    const fallbackResults = getHardcodedFallback(query, category);
    setSearchState({
      results: fallbackResults,
      loading: false,
      error: 'Tüm veri kaynakları başarısız - fallback data gösteriliyor',
      dataSource: 'fallback',
      responseTime: Date.now() - startTime
    });
  };

  // Auto-search popular queries on load
  useEffect(() => {
    // Sayfa yüklendiğinde popüler bir arama yap
    searchHybrid('güncel kararlar', 'yargi');
  }, []);

  return {
    ...searchState,
    searchHybrid,
    clearCache: () => {
      Object.keys(localStorage)
        .filter(key => key.startsWith('legal-search-'))
        .forEach(key => localStorage.removeItem(key));
    }
  };
};