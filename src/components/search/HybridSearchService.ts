export interface SearchResult {
  id: string;
  title: string;
  case_number?: string;
  court: string;
  department?: string;
  decision_date: string;
  summary: string;
  keywords: string[];
  category: string;
  subcategory: string;
  esas_no?: string;
  karar_no?: string;
  daire?: string;
  date?: string;
}

export interface SearchResponse {
  data: {
    results: SearchResult[];
  };
  source: 'api' | 'cache' | 'static' | 'error';
  responseTime: number;
}

export interface CacheEntry {
  data: SearchResult[];
  timestamp: number;
  source: 'api' | 'static';
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const API_ENDPOINTS = {
  yargi: {
    yargitay: 'https://yargi-mcp-of8a.onrender.com/webhook/yargitay-search',
    danistay: 'https://yargi-mcp-of8a.onrender.com/webhook/danistay-search',
    emsal: 'https://yargi-mcp-of8a.onrender.com/webhook/emsal-search',
    anayasa: 'https://yargi-mcp-of8a.onrender.com/webhook/unified-search'
  },
  static: {
    yargitay: 'https://raw.githubusercontent.com/botfusions/yargi-mcp/main/public/yargitay-data.json',
    danistay: 'https://raw.githubusercontent.com/botfusions/yargi-mcp/main/public/danistay-data.json',
    unified: 'https://raw.githubusercontent.com/botfusions/yargi-mcp/main/public/unified-legal-data.json'
  },
  mevzuat: {
    search: 'https://mevzuat-mcp-2z26.onrender.com/webhook/search',
    static: 'https://raw.githubusercontent.com/botfusions/mevzuat-mcp/main/public/mevzuat-data.json'
  }
};

export class HybridSearchService {
  private getCacheKey(category: string, subcategory: string, query: string): string {
    return `search_${category}_${subcategory}_${query}`;
  }

  private getCache(key: string): CacheEntry | null {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const entry: CacheEntry = JSON.parse(cached);
      if (Date.now() - entry.timestamp > CACHE_TTL) {
        localStorage.removeItem(key);
        return null;
      }
      
      return entry;
    } catch {
      return null;
    }
  }

  private setCache(key: string, data: SearchResult[], source: 'api' | 'static'): void {
    try {
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
        source
      };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // Ignore cache errors
    }
  }

  private async fetchFromAPI(
    category: string, 
    subcategory: string, 
    query: string
  ): Promise<SearchResult[]> {
    const startTime = Date.now();
    
    try {
      let endpoint: string;
      let body: any;

      if (category === 'yargi') {
        endpoint = API_ENDPOINTS.yargi[subcategory as keyof typeof API_ENDPOINTS.yargi];
        body = {
          andKelimeler: query,
          page_size: 15
        };
      } else if (category === 'mevzuat') {
        endpoint = API_ENDPOINTS.mevzuat.search;
        body = {
          query: query,
          page_size: 15
        };
      } else {
        throw new Error('Unsupported category');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.data?.results || [];
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async fetchFromStatic(
    category: string, 
    subcategory: string
  ): Promise<SearchResult[]> {
    try {
      let endpoint: string;
      
      if (category === 'yargi') {
        endpoint = API_ENDPOINTS.static[subcategory as keyof typeof API_ENDPOINTS.static] || API_ENDPOINTS.static.unified;
      } else if (category === 'mevzuat') {
        endpoint = API_ENDPOINTS.mevzuat.static;
      } else {
        throw new Error('Unsupported category');
      }

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Static request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.data?.results || [];
    } catch (error) {
      console.error('Static request failed:', error);
      throw error;
    }
  }

  async search(
    category: string, 
    subcategory: string, 
    query: string
  ): Promise<SearchResponse> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(category, subcategory, query);
    
    // Check cache first
    const cached = this.getCache(cacheKey);
    if (cached) {
      return {
        data: { results: cached.data },
        source: 'cache',
        responseTime: Date.now() - startTime
      };
    }

    // Try API first
    try {
      const results = await this.fetchFromAPI(category, subcategory, query);
      this.setCache(cacheKey, results, 'api');
      
      return {
        data: { results },
        source: 'api',
        responseTime: Date.now() - startTime
      };
    } catch (apiError) {
      // Fallback to static data
      try {
        const results = await this.fetchFromStatic(category, subcategory);
        this.setCache(cacheKey, results, 'static');
        
        return {
          data: { results },
          source: 'static',
          responseTime: Date.now() - startTime
        };
      } catch (staticError) {
        console.error('Both API and static failed:', staticError);
        return {
          data: { results: [] },
          source: 'error',
          responseTime: Date.now() - startTime
        };
      }
    }
  }

  clearCache(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('search_')) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Ignore errors
    }
  }
}

export const searchService = new HybridSearchService();