
export interface UseApiStateOptions {
  immediate?: boolean;
  retries?: number;
  retryDelay?: number;
}

export interface UseApiStateReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (promise: Promise<T>) => Promise<T>;
  reset: () => void;
}

export interface UseDebounceOptions {
  delay: number;
  immediate?: boolean;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

export interface UseErrorHandlerOptions {
  showToast?: boolean;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface UseMemoryMonitorReturn {
  memoryUsage: number;
  isHighUsage: boolean;
  clearCache: () => void;
  logComponentRender: (componentName?: string) => void;
  getMemoryReport: () => {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
    percentage: number;
  };
}
