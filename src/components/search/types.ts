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
}

export interface SearchFilters {
  type: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  category: string;
}