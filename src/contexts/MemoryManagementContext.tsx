
import React, { createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useMemoryMonitor } from '@/hooks/useMemoryMonitor';
import { useMemorySafeTimer } from '@/hooks/useMemorySafeTimer';
import { useMemorySafeEventListener } from '@/hooks/useMemorySafeEventListener';
import { useMemorySafeRequest } from '@/hooks/useMemorySafeRequest';

interface MemoryManagementContextType {
  forceCleanup: () => void;
  getMemoryReport: () => any;
  getActiveResourceCounts: () => {
    timers: number;
    listeners: number;
    requests: number;
  };
  isMemoryHigh: boolean;
  isMemorycritical: boolean;
}

const MemoryManagementContext = createContext<MemoryManagementContextType | undefined>(undefined);

interface MemoryManagementProviderProps {
  children: ReactNode;
}

export const MemoryManagementProvider: React.FC<MemoryManagementProviderProps> = ({ children }) => {
  const isDev = import.meta.env.DEV;
  
  const { 
    memoryStats, 
    forceGarbageCollection, 
    getMemoryReport 
  } = useMemoryMonitor('MemoryManagementProvider');
  
  const { clearAll: clearAllTimers, getActiveCount: getTimerCount } = useMemorySafeTimer();
  const { removeAll: removeAllListeners, getActiveCount: getListenerCount } = useMemorySafeEventListener();
  const { cancelAll: cancelAllRequests, getActiveCount: getRequestCount } = useMemorySafeRequest();

  // Auto cleanup on high memory usage - only in development
  useEffect(() => {
    if (!isDev) return;
    
    if (memoryStats?.isCritical) {
      console.warn('MemoryManagement: Critical memory detected, forcing cleanup');
      forceCleanup();
    }
  }, [memoryStats?.isCritical, isDev]);

  // Periodic cleanup - only in development and less frequent
  useEffect(() => {
    if (!isDev) return;
    
    const interval = setInterval(() => {
      if (memoryStats?.isHigh) {
        console.log('MemoryManagement: Performing periodic cleanup due to high memory');
        forceCleanup();
      }
    }, 120000); // Every 2 minutes instead of 1

    return () => clearInterval(interval);
  }, [memoryStats?.isHigh, isDev]);

  const forceCleanup = useCallback(() => {
    if (isDev) console.log('MemoryManagement: Starting forced cleanup');
    
    // Clear all managed resources
    clearAllTimers();
    removeAllListeners();
    cancelAllRequests();
    
    // Force garbage collection
    forceGarbageCollection();
    
    if (isDev) console.log('MemoryManagement: Cleanup completed');
  }, [clearAllTimers, removeAllListeners, cancelAllRequests, forceGarbageCollection, isDev]);

  const getActiveResourceCounts = useCallback(() => {
    const timerCounts = getTimerCount();
    return {
      timers: timerCounts.total,
      listeners: getListenerCount(),
      requests: getRequestCount().requests
    };
  }, [getTimerCount, getListenerCount, getRequestCount]);

  const value: MemoryManagementContextType = {
    forceCleanup,
    getMemoryReport,
    getActiveResourceCounts,
    isMemoryHigh: isDev ? (memoryStats?.isHigh || false) : false,
    isMemorycritical: isDev ? (memoryStats?.isCritical || false) : false
  };

  return (
    <MemoryManagementContext.Provider value={value}>
      {children}
    </MemoryManagementContext.Provider>
  );
};

export const useMemoryManagement = (): MemoryManagementContextType => {
  const context = useContext(MemoryManagementContext);
  if (context === undefined) {
    throw new Error('useMemoryManagement must be used within a MemoryManagementProvider');
  }
  return context;
};
