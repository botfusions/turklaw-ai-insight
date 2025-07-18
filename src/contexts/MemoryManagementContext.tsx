
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
  const { 
    memoryStats, 
    forceGarbageCollection, 
    getMemoryReport 
  } = useMemoryMonitor('MemoryManagementProvider');
  
  const { clearAll: clearAllTimers, getActiveCount: getTimerCount } = useMemorySafeTimer();
  const { removeAll: removeAllListeners, getActiveCount: getListenerCount } = useMemorySafeEventListener();
  const { cancelAll: cancelAllRequests, getActiveCount: getRequestCount } = useMemorySafeRequest();

  // Auto cleanup on high memory usage
  useEffect(() => {
    if (memoryStats?.isCritical) {
      console.warn('MemoryManagement: Critical memory detected, forcing cleanup');
      forceCleanup();
    }
  }, [memoryStats?.isCritical]);

  // Periodic cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      if (memoryStats?.isHigh) {
        console.log('MemoryManagement: Performing periodic cleanup due to high memory');
        forceCleanup();
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [memoryStats?.isHigh]);

  const forceCleanup = useCallback(() => {
    console.log('MemoryManagement: Starting forced cleanup');
    
    // Clear all managed resources
    clearAllTimers();
    removeAllListeners();
    cancelAllRequests();
    
    // Force garbage collection
    forceGarbageCollection();
    
    console.log('MemoryManagement: Cleanup completed');
  }, [clearAllTimers, removeAllListeners, cancelAllRequests, forceGarbageCollection]);

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
    isMemoryHigh: memoryStats?.isHigh || false,
    isMemorycritical: memoryStats?.isCritical || false
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
