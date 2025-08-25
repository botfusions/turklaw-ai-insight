import { z } from 'zod';

// API Base URL - can be configured via environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? 'https://turklaw-ai-insight-production.up.railway.app' : 'http://localhost:8001');

// Response schemas
const SearchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  court: z.string(),
  chamber: z.string().optional(),
  date: z.string(),
  summary: z.string(),
  caseNumber: z.string().optional(),
  decisionNumber: z.string().optional(),
  documentType: z.string(),
  url: z.string().optional(),
  relevanceScore: z.number().optional(),
  highlights: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

const SearchResponseSchema = z.object({
  results: z.array(SearchResultSchema),
  total_records: z.number(),
  requested_page: z.number(),
  page_size: z.number(),
  searched_courts: z.array(z.string()).optional(),
  query: z.string().optional(),
});

const DocumentMetadataSchema = z.object({
  id: z.string(),
  title: z.string(),
  court: z.string(),
  chamber: z.string().optional(),
  date: z.string(),
  caseNumber: z.string().optional(),
  decisionNumber: z.string().optional(),
  documentType: z.string(),
  url: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

const DocumentContentSchema = z.object({
  markdown_content: z.string(),
  source_url: z.string().optional(),
  mime_type: z.string().optional(),
});

// Types
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type DocumentMetadata = z.infer<typeof DocumentMetadataSchema>;
export type DocumentContent = z.infer<typeof DocumentContentSchema>;

// API Error class
export class LegalApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'LegalApiError';
  }
}

// Base API client
class LegalApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorMessage;
        } catch {
          // Ignore JSON parsing errors for error responses
        }
        throw new LegalApiError(errorMessage, response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof LegalApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new LegalApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Health check
  async checkHealth() {
    return this.request('/health');
  }

  // Yargi API endpoints
  async checkServersHealth() {
    return this.request('/api/yargi/health');
  }

  async searchBedesten(params: {
    phrase: string;
    court_types?: string[];
    birimAdi?: string;
    kararTarihiStart?: string;
    kararTarihiEnd?: string;
    pageNumber?: number;
  }) {
    const response = await this.request<SearchResponse>('/api/yargi/bedesten/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    
    return SearchResponseSchema.parse(response);
  }

  async getBedestenDocument(documentId: string) {
    const response = await this.request<DocumentContent>(`/api/yargi/bedesten/document/${documentId}`);
    return DocumentContentSchema.parse(response);
  }

  async searchAnayasa(params: {
    decision_type: 'bireysel_basvuru' | 'norm_denetimi';
    keywords?: string[];
    keywords_all?: string[];
    keywords_any?: string[];
    page_to_fetch?: number;
    decision_start_date?: string;
    decision_end_date?: string;
    application_date_start?: string;
    application_date_end?: string;
    subject_category?: string;
    norm_type?: string;
    decision_type_norm?: string;
  }) {
    const response = await this.request<any>('/api/yargi/anayasa/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    
    return response;
  }

  async getAnayasaDocument(params: {
    document_url: string;
    page_number?: number;
  }) {
    const queryString = new URLSearchParams(params as any).toString();
    const response = await this.request<DocumentContent>(`/api/yargi/anayasa/document?${queryString}`);
    return DocumentContentSchema.parse(response);
  }

  async searchEmsal(params: {
    keyword?: string;
    start_date?: string;
    end_date?: string;
    page_number?: number;
    selected_regional_civil_chambers?: string[];
    sort_criteria?: string;
    sort_direction?: string;
  }) {
    const response = await this.request<any>('/api/yargi/emsal/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    
    return response;
  }

  async getEmsalDocument(documentId: string) {
    const response = await this.request<DocumentContent>(`/api/yargi/emsal/document/${documentId}`);
    return DocumentContentSchema.parse(response);
  }

  // Mevzuat API endpoints
  async searchMevzuat(params: {
    mevzuat_adi?: string;
    mevzuat_no?: string;
    mevzuat_turleri?: string | string[];
    phrase?: string;
    resmi_gazete_sayisi?: string;
    page_number?: number;
    page_size?: number;
    sort_field?: string;
    sort_direction?: string;
  }) {
    const response = await this.request<any>('/api/mevzuat/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    
    return response;
  }

  async getMevzuatStructure(mevzuatId: string) {
    const response = await this.request<any>(`/api/mevzuat/legislation/${mevzuatId}/structure`);
    return response;
  }

  async getMevzuatArticle(mevzuatId: string, maddeId: string) {
    const response = await this.request<DocumentContent>(`/api/mevzuat/legislation/${mevzuatId}/article/${maddeId}`);
    return DocumentContentSchema.parse(response);
  }

  async getPopularLegislation() {
    return this.request('/api/mevzuat/popular');
  }

  async getLegislationTypes() {
    return this.request('/api/mevzuat/types');
  }

  // Search by name shortcuts
  async searchMevzuatByName(name: string, options?: {
    page?: number;
    size?: number;
    sort?: string;
    order?: string;
  }) {
    const params = new URLSearchParams({
      name,
      page: String(options?.page || 1),
      size: String(options?.size || 10),
      sort: options?.sort || 'RESMI_GAZETE_TARIHI',
      order: options?.order || 'desc',
    });
    
    return this.request(`/api/mevzuat/search/by-name?${params}`);
  }

  async searchMevzuatByNumber(number: string, options?: {
    page?: number;
    size?: number;
  }) {
    const params = new URLSearchParams({
      number,
      page: String(options?.page || 1),
      size: String(options?.size || 10),
    });
    
    return this.request(`/api/mevzuat/search/by-number?${params}`);
  }

  async searchMevzuatFullText(query: string, options?: {
    types?: string[];
    page?: number;
    size?: number;
  }) {
    const params = new URLSearchParams({
      query,
      page: String(options?.page || 1),
      size: String(options?.size || 10),
    });
    
    if (options?.types) {
      options.types.forEach(type => params.append('types', type));
    }
    
    return this.request(`/api/mevzuat/search/full-text?${params}`);
  }
}

// Create singleton instance
export const legalApi = new LegalApiClient();

// Helper functions for common search operations
export const searchHelpers = {
  // Multi-court search
  async searchAllCourts(query: string, options?: {
    courts?: string[];
    dateStart?: string;
    dateEnd?: string;
    page?: number;
  }) {
    return legalApi.searchBedesten({
      phrase: query,
      court_types: options?.courts || ['YARGITAYKARARI', 'DANISTAYKARAR'],
      kararTarihiStart: options?.dateStart,
      kararTarihiEnd: options?.dateEnd,
      pageNumber: options?.page || 1,
    });
  },

  // Constitutional Court search
  async searchConstitutionalCourt(query: string, type: 'bireysel_basvuru' | 'norm_denetimi' = 'bireysel_basvuru') {
    return legalApi.searchAnayasa({
      decision_type: type,
      keywords: [query],
      page_to_fetch: 1,
    });
  },

  // Turkish legislation search
  async searchLegislation(query: string, searchType: 'name' | 'number' | 'fulltext' = 'name') {
    switch (searchType) {
      case 'name':
        return legalApi.searchMevzuatByName(query);
      case 'number':
        return legalApi.searchMevzuatByNumber(query);
      case 'fulltext':
        return legalApi.searchMevzuatFullText(query);
      default:
        return legalApi.searchMevzuatByName(query);
    }
  },

  // Precedent decisions search
  async searchPrecedents(query: string, options?: {
    dateStart?: string;
    dateEnd?: string;
    page?: number;
  }) {
    return legalApi.searchEmsal({
      keyword: query,
      start_date: options?.dateStart,
      end_date: options?.dateEnd,
      page_number: options?.page || 1,
    });
  },
};

// React Query keys for caching
export const queryKeys = {
  health: ['health'] as const,
  serversHealth: ['servers', 'health'] as const,
  search: (type: string, params: any) => ['search', type, params] as const,
  document: (type: string, id: string) => ['document', type, id] as const,
  legislationTypes: ['legislation', 'types'] as const,
  popularLegislation: ['legislation', 'popular'] as const,
};

export default legalApi;