
export interface MevzuatResult {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
  url?: string;
  relevance?: number;
  source?: 'primary' | 'fallback' | 'cache' | 'github' | 'static';
}

export type DataSource = 'primary' | 'fallback' | 'cache' | 'github' | 'static' | 'error';

export interface SearchFilters {
  dateFrom?: Date;
  dateTo?: Date;
  court?: string;
  department?: string;
  legalField?: string;
  documentType?: string;
}

export interface PerformanceInfo {
  responseTime: number;
  cacheHit: boolean;
  apiAttempts: number;
  dataSource: DataSource;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultCount: number;
  dataSource: DataSource;
  responseTime: number;
}

export interface CacheEntry {
  query: string;
  results: MevzuatResult[];
  timestamp: number;
  dataSource: DataSource;
  expiresAt: number;
}

export interface HybridSearchState {
  query: string;
  results: MevzuatResult[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  dataSource: DataSource;
  searchHistory: SearchHistoryItem[];
  performanceInfo: PerformanceInfo;
  cacheSize: number;
  historySize: number;
  lastCacheCleared: number | null;
  githubDataStatus?: 'active' | 'loading' | 'error';
}

export interface MevzuatSearchState extends HybridSearchState {
  filters: SearchFilters;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface MevzuatSearchProps {
  initialQuery?: string;
  maxResults?: number;
  onSearchComplete?: (results: MevzuatResult[]) => void;
  filters?: SearchFilters;
  className?: string;
}
