
export interface ApiResponse<T = any> {
  data: T;
  error: string | null;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NetworkStatus {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export interface PerformanceMetrics {
  responseTime: number;
  cacheHit: boolean;
  dataSource: string;
  timestamp: number;
}

export interface ErrorLog {
  id: string;
  timestamp: number;
  level: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
}
