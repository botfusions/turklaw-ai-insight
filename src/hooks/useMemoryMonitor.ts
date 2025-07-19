
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMemorySafeTimer } from './useMemorySafeTimer';

export interface MemoryStats {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usagePercentage: number;
  isHigh: boolean;
  isCritical: boolean;
}

export interface ComponentMemoryInfo {
  componentName: string;
  renderCount: number;
  lastRender: number;
  memoryAtRender: number;
}

export const useMemoryMonitor = (componentName?: string) => {
  const [memoryStats, setMemoryStats] = useState<MemoryStats | null>(null);
  const { createInterval } = useMemorySafeTimer();
  const componentStatsRef = useRef<ComponentMemoryInfo>({
    componentName: componentName || 'Unknown',
    renderCount: 0,
    lastRender: Date.now(),
    memoryAtRender: 0
  });

  // Only enable in development
  const isDev = import.meta.env.DEV;

  const getMemoryStats = useCallback((): MemoryStats | null => {
    if (!isDev || !('memory' in performance)) {
      return null;
    }

    const memory = (performance as any).memory;
    const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage,
      isHigh: usagePercentage > 70,
      isCritical: usagePercentage > 90
    };
  }, [isDev]);

  const forceGarbageCollection = useCallback(() => {
    if (!isDev) return;
    
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
      if (isDev) console.log('MemoryMonitor: Forced garbage collection');
    } else {
      // Fallback: trigger potential GC through memory pressure
      try {
        const arrays = [];
        for (let i = 0; i < 10; i++) {
          arrays.push(new Array(1000000).fill(0));
        }
        arrays.length = 0;
        if (isDev) console.log('MemoryMonitor: Attempted to trigger GC through memory pressure');
      } catch (error) {
        if (isDev) console.warn('MemoryMonitor: Could not trigger GC:', error);
      }
    }
  }, [isDev]);

  const logComponentRender = useCallback(() => {
    if (!isDev) return;
    
    const stats = getMemoryStats();
    
    componentStatsRef.current.renderCount++;
    componentStatsRef.current.lastRender = Date.now();
    componentStatsRef.current.memoryAtRender = stats?.usedJSHeapSize || 0;

    if (stats?.isHigh && isDev) {
      console.warn(`MemoryMonitor: High memory usage at ${componentName} render:`, stats);
    }
  }, [componentName, getMemoryStats, isDev]);

  const getComponentStats = useCallback(() => componentStatsRef.current, []);

  // Monitor memory usage only in development
  useEffect(() => {
    if (!isDev) return;

    const interval = createInterval(() => {
      const stats = getMemoryStats();
      if (stats) {
        setMemoryStats(stats);
        
        if (stats.isCritical) {
          console.error('MemoryMonitor: Critical memory usage detected!', stats);
          forceGarbageCollection();
        } else if (stats.isHigh) {
          console.warn('MemoryMonitor: High memory usage detected:', stats);
        }
      }
    }, 10000); // Check every 10 seconds instead of 5

    return () => interval.clear();
  }, [createInterval, getMemoryStats, forceGarbageCollection, isDev]);

  // Log component render only in development
  useEffect(() => {
    if (isDev) {
      logComponentRender();
    }
  });

  const getFormattedMemorySize = useCallback((bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }, []);

  const getMemoryReport = useCallback(() => {
    if (!isDev) return null;
    
    const stats = getMemoryStats();
    const componentStats = getComponentStats();
    
    return {
      memory: stats ? {
        used: getFormattedMemorySize(stats.usedJSHeapSize),
        total: getFormattedMemorySize(stats.totalJSHeapSize),
        limit: getFormattedMemorySize(stats.jsHeapSizeLimit),
        usage: `${stats.usagePercentage.toFixed(2)}%`,
        status: stats.isCritical ? 'critical' : stats.isHigh ? 'high' : 'normal'
      } : null,
      component: {
        name: componentStats.componentName,
        renders: componentStats.renderCount,
        lastRender: new Date(componentStats.lastRender).toISOString(),
        memoryAtRender: getFormattedMemorySize(componentStats.memoryAtRender)
      }
    };
  }, [getMemoryStats, getComponentStats, getFormattedMemorySize, isDev]);

  return {
    memoryStats: isDev ? memoryStats : null,
    getMemoryStats,
    forceGarbageCollection,
    logComponentRender,
    getComponentStats,
    getFormattedMemorySize,
    getMemoryReport
  };
};
