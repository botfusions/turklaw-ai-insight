export interface MevzuatSearchProps {
  // Görsel özelleştirme
  className?: string;
  compact?: boolean;
  showFilters?: boolean;
  
  // Fonksiyonel özelleştirme
  maxResults?: number;
  autoSearch?: boolean;
  placeholder?: string;
  
  // Callbacks
  onSearchStart?: (query: string) => void;
  onSearchComplete?: (results: MevzuatResult[]) => void;
  onError?: (error: string) => void;
  
  // Auth kontrolü
  requireAuth?: boolean;
  showLimitWarning?: boolean;
  
  // Hibrit özellikler
  showDataSource?: boolean;
  showHistory?: boolean;
  cacheEnabled?: boolean;
  primaryTimeout?: number;
  fallbackEnabled?: boolean;
  cacheFirst?: boolean;
  showPerformanceInfo?: boolean;
  showCacheControls?: boolean;
  debugMode?: boolean;
}

export interface MevzuatResult {
  id: string;
  title: string;
  content: string;
  date?: string;
  type: string;
  url?: string;
  relevance?: number;
}

export interface MevzuatSearchState {
  query: string;
  results: MevzuatResult[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  dataSource: DataSource;
  searchHistory: SearchHistoryItem[];
  performanceInfo: PerformanceInfo;
}

export interface SearchFilters {
  type: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  category: string;
}

export type DataSource = 'primary' | 'fallback' | 'cache' | 'error';

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultCount: number;
  dataSource: DataSource;
  responseTime: number;
}

// Enhanced search history item matching database schema
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

export interface CacheEntry {
  query: string;
  results: MevzuatResult[];
  timestamp: number;
  dataSource: DataSource;
  expiresAt: number;
}

export interface PerformanceInfo {
  responseTime: number;
  cacheHit: boolean;
  apiAttempts: number;
  dataSource: DataSource;
}

export interface HybridSearchState extends MevzuatSearchState {
  cacheSize: number;
  historySize: number;
  lastCacheCleared: number | null;
}