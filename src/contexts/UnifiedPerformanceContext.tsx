
import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { useMemoryMonitor } from '@/hooks/useMemoryMonitor';
import { useMemorySafeTimer } from '@/hooks/useMemorySafeTimer';
import { useMemorySafeEventListener } from '@/hooks/useMemorySafeEventListener';
import { useMemorySafeRequest } from '@/hooks/useMemorySafeRequest';

export interface PerformanceState {
  // Loading states
  auth: boolean;
  profile: boolean;
  action: boolean;
  search: boolean;
  data: boolean;
  navigation: boolean;
  
  // Network & performance
  networkStatus: 'online' | 'offline' | 'slow';
  lastActivity: number;
  retryCount: number;
  
  // Progress tracking
  currentOperation: string | null;
  progress: number;
  estimatedTime: number | null;
  
  // Memory tracking
  isMemoryHigh: boolean;
  isMemoryCritical: boolean;
}

interface PerformanceAction {
  type: 'SET_LOADING' | 'CLEAR_LOADING' | 'SET_NETWORK_STATUS' | 'UPDATE_PROGRESS' | 'RESET_RETRY' | 'INCREMENT_RETRY' | 'SET_MEMORY_STATUS';
  payload?: any;
}

interface UnifiedPerformanceContextType {
  state: PerformanceState;
  setLoading: (key: keyof PerformanceState, value: boolean, operation?: string) => void;
  updateProgress: (progress: number, estimatedTime?: number) => void;
  resetRetry: () => void;
  incrementRetry: () => void;
  isLoading: (keys?: (keyof PerformanceState)[]) => boolean;
  isCriticalLoading: () => boolean;
  isBackgroundLoading: () => boolean;
  forceCleanup: () => void;
  getMemoryReport: () => any;
  getActiveResourceCounts: () => {
    timers: number;
    listeners: number;
    requests: number;
  };
}

const initialState: PerformanceState = {
  auth: false,
  profile: false,
  action: false,
  search: false,
  data: false,
  navigation: false,
  networkStatus: 'online',
  lastActivity: Date.now(),
  retryCount: 0,
  currentOperation: null,
  progress: 0,
  estimatedTime: null,
  isMemoryHigh: false,
  isMemoryCritical: false,
};

const performanceReducer = (state: PerformanceState, action: PerformanceAction): PerformanceState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        [action.payload.key]: action.payload.value,
        currentOperation: action.payload.value ? action.payload.operation || null : null,
        progress: action.payload.value ? 0 : state.progress,
        lastActivity: Date.now(),
      };
    
    case 'CLEAR_LOADING':
      return {
        ...state,
        [action.payload.key]: false,
        currentOperation: null,
        progress: 0,
        estimatedTime: null,
      };
    
    case 'SET_NETWORK_STATUS':
      return {
        ...state,
        networkStatus: action.payload.status,
      };
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: action.payload.progress,
        estimatedTime: action.payload.estimatedTime || state.estimatedTime,
      };
    
    case 'RESET_RETRY':
      return {
        ...state,
        retryCount: 0,
      };
    
    case 'INCREMENT_RETRY':
      return {
        ...state,
        retryCount: state.retryCount + 1,
      };
    
    case 'SET_MEMORY_STATUS':
      return {
        ...state,
        isMemoryHigh: action.payload.isHigh,
        isMemoryCritical: action.payload.isCritical,
      };
    
    default:
      return state;
  }
};

const UnifiedPerformanceContext = createContext<UnifiedPerformanceContextType | undefined>(undefined);

interface UnifiedPerformanceProviderProps {
  children: ReactNode;
}

export const UnifiedPerformanceProvider = ({ children }: UnifiedPerformanceProviderProps) => {
  const [state, dispatch] = useReducer(performanceReducer, initialState);
  
  // Memory-safe utilities
  const { addEventListener } = useMemorySafeEventListener();
  const { clearAll: clearAllTimers, getActiveCount: getTimerCount } = useMemorySafeTimer();
  const { removeAll: removeAllListeners, getActiveCount: getListenerCount } = useMemorySafeEventListener();
  const { cancelAll: cancelAllRequests, getActiveCount: getRequestCount } = useMemorySafeRequest();
  
  // Memory monitoring (only in development)
  const { 
    memoryStats, 
    forceGarbageCollection, 
    getMemoryReport 
  } = useMemoryMonitor('UnifiedPerformanceProvider');

  // Update memory status when it changes
  useEffect(() => {
    if (memoryStats) {
      dispatch({
        type: 'SET_MEMORY_STATUS',
        payload: {
          isHigh: memoryStats.isHigh,
          isCritical: memoryStats.isCritical
        }
      });
    }
  }, [memoryStats?.isHigh, memoryStats?.isCritical]);

  // Auto cleanup on critical memory
  useEffect(() => {
    if (state.isMemoryCritical) {
      console.warn('UnifiedPerformance: Critical memory detected, forcing cleanup');
      forceCleanup();
    }
  }, [state.isMemoryCritical]);

  const setLoading = useCallback((key: keyof PerformanceState, value: boolean, operation?: string) => {
    dispatch({
      type: 'SET_LOADING',
      payload: { key, value, operation }
    });
  }, []);

  const updateProgress = useCallback((progress: number, estimatedTime?: number) => {
    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: { progress, estimatedTime }
    });
  }, []);

  const resetRetry = useCallback(() => {
    dispatch({ type: 'RESET_RETRY' });
  }, []);

  const incrementRetry = useCallback(() => {
    dispatch({ type: 'INCREMENT_RETRY' });
  }, []);

  const isLoading = useCallback((keys?: (keyof PerformanceState)[]) => {
    if (!keys) {
      return ['auth', 'profile', 'action', 'search', 'data', 'navigation'].some(key => 
        state[key as keyof PerformanceState] === true
      );
    }
    return keys.some(key => state[key] === true);
  }, [state]);

  const isCriticalLoading = useCallback(() => {
    return state.auth || (!state.auth && state.action);
  }, [state.auth, state.action]);

  const isBackgroundLoading = useCallback(() => {
    return state.profile || state.search || state.data;
  }, [state.profile, state.search, state.data]);

  const forceCleanup = useCallback(() => {
    console.log('UnifiedPerformance: Starting forced cleanup');
    clearAllTimers();
    removeAllListeners();
    cancelAllRequests();
    forceGarbageCollection();
    console.log('UnifiedPerformance: Cleanup completed');
  }, [clearAllTimers, removeAllListeners, cancelAllRequests, forceGarbageCollection]);

  const getActiveResourceCounts = useCallback(() => {
    const timerCounts = getTimerCount();
    return {
      timers: timerCounts.total,
      listeners: getListenerCount(),
      requests: getRequestCount().requests
    };
  }, [getTimerCount, getListenerCount, getRequestCount]);

  // Network status monitoring
  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection;
      let status: 'online' | 'offline' | 'slow' = 'online';
      
      if (!navigator.onLine) {
        status = 'offline';
      } else if (connection && connection.effectiveType && 
                 ['slow-2g', '2g'].includes(connection.effectiveType)) {
        status = 'slow';
      }
      
      dispatch({
        type: 'SET_NETWORK_STATUS',
        payload: { status }
      });
    };

    updateNetworkStatus();
    
    const onlineHandle = addEventListener(window, 'online', updateNetworkStatus, false, 'network_online');
    const offlineHandle = addEventListener(window, 'offline', updateNetworkStatus, false, 'network_offline');
    
    let connectionHandle: { remove: () => void } | null = null;
    if ('connection' in navigator) {
      connectionHandle = addEventListener(
        (navigator as any).connection, 
        'change', 
        updateNetworkStatus, 
        false, 
        'network_connection'
      );
    }

    return () => {
      onlineHandle.remove();
      offlineHandle.remove();
      connectionHandle?.remove();
    };
  }, [addEventListener]);

  const value: UnifiedPerformanceContextType = {
    state,
    setLoading,
    updateProgress,
    resetRetry,
    incrementRetry,
    isLoading,
    isCriticalLoading,
    isBackgroundLoading,
    forceCleanup,
    getMemoryReport,
    getActiveResourceCounts,
  };

  return (
    <UnifiedPerformanceContext.Provider value={value}>
      {children}
    </UnifiedPerformanceContext.Provider>
  );
};

export const useUnifiedPerformance = (): UnifiedPerformanceContextType => {
  const context = useContext(UnifiedPerformanceContext);
  if (context === undefined) {
    throw new Error('useUnifiedPerformance must be used within a UnifiedPerformanceProvider');
  }
  return context;
};
