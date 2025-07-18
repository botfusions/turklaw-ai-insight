
import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { useMemorySafeEventListener } from '@/hooks/useMemorySafeEventListener';
import { useMemoryMonitor } from '@/hooks/useMemoryMonitor';

export interface LoadingState {
  // Core system loading
  auth: boolean;
  profile: boolean;
  action: boolean;
  
  // Feature-specific loading
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
}

interface LoadingAction {
  type: 'SET_LOADING' | 'CLEAR_LOADING' | 'SET_NETWORK_STATUS' | 'UPDATE_PROGRESS' | 'RESET_RETRY' | 'INCREMENT_RETRY';
  payload?: any;
}

interface SmartLoadingContextType {
  state: LoadingState;
  setLoading: (key: keyof LoadingState, value: boolean, operation?: string) => void;
  updateProgress: (progress: number, estimatedTime?: number) => void;
  resetRetry: () => void;
  incrementRetry: () => void;
  isLoading: (keys?: (keyof LoadingState)[]) => boolean;
  isCriticalLoading: () => boolean;
  isBackgroundLoading: () => boolean;
}

const initialState: LoadingState = {
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
};

const loadingReducer = (state: LoadingState, action: LoadingAction): LoadingState => {
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
    
    default:
      return state;
  }
};

const SmartLoadingContext = createContext<SmartLoadingContextType | undefined>(undefined);

interface SmartLoadingProviderProps {
  children: ReactNode;
}

export const SmartLoadingProvider: React.FC<SmartLoadingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialState);
  
  // Memory-safe utilities
  const { addEventListener } = useMemorySafeEventListener();
  const { logComponentRender } = useMemoryMonitor('SmartLoadingProvider');

  // Log component renders for memory monitoring
  useEffect(() => {
    logComponentRender();
  });

  const setLoading = useCallback((key: keyof LoadingState, value: boolean, operation?: string) => {
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

  const isLoading = useCallback((keys?: (keyof LoadingState)[]) => {
    if (!keys) {
      return Object.keys(state).some(key => 
        ['auth', 'profile', 'action', 'search', 'data', 'navigation'].includes(key) && 
        state[key as keyof LoadingState] === true
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

  // Memory-safe network status monitoring
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
    
    // Use memory-safe event listeners
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

  const value: SmartLoadingContextType = {
    state,
    setLoading,
    updateProgress,
    resetRetry,
    incrementRetry,
    isLoading,
    isCriticalLoading,
    isBackgroundLoading,
  };

  return (
    <SmartLoadingContext.Provider value={value}>
      {children}
    </SmartLoadingContext.Provider>
  );
};

export const useSmartLoading = (): SmartLoadingContextType => {
  const context = useContext(SmartLoadingContext);
  if (context === undefined) {
    throw new Error('useSmartLoading must be used within a SmartLoadingProvider');
  }
  return context;
};
