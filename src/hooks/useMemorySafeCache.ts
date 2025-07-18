
import { useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface CacheConfig {
  maxSize: number;
  maxAge: number;
  cleanupInterval: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccess: number;
}

export const useMemorySafeCache = <T>(
  cacheKey: string,
  config: Partial<CacheConfig> = {}
) => {
  const defaultConfig: CacheConfig = {
    maxSize: 100,
    maxAge: 30 * 60 * 1000, // 30 minutes
    cleanupInterval: 5 * 60 * 1000, // 5 minutes
  };

  const finalConfig = { ...defaultConfig, ...config };
  
  const [persistentCache, setPersistentCache] = useLocalStorage<Record<string, CacheEntry<T>>>(
    `memory_safe_cache_${cacheKey}`,
    {}
  );
  
  const memoryCache = useRef<Map<string, CacheEntry<T>>>(new Map());
  const cleanupTimerRef = useRef<NodeJS.Timeout | null>(null);
  const statsRef = useRef({
    hits: 0,
    misses: 0,
    evictions: 0,
    cleanups: 0
  });

  // Initialize memory cache from persistent storage
  useEffect(() => {
    Object.entries(persistentCache).forEach(([key, entry]) => {
      if (isValidEntry(entry)) {
        memoryCache.current.set(key, entry);
      }
    });
    
    console.log(`MemorySafeCache: Initialized ${cacheKey} with ${memoryCache.current.size} entries`);
  }, [cacheKey, persistentCache]);

  // Setup cleanup interval
  useEffect(() => {
    cleanupTimerRef.current = setInterval(() => {
      cleanup();
    }, finalConfig.cleanupInterval);

    return () => {
      if (cleanupTimerRef.current) {
        clearInterval(cleanupTimerRef.current);
      }
      
      // Save to persistent storage on unmount
      saveToPersistentStorage();
      
      console.log(`MemorySafeCache: Cleaned up cache ${cacheKey}`);
    };
  }, [finalConfig.cleanupInterval, cacheKey]);

  const isValidEntry = useCallback((entry: CacheEntry<T>): boolean => {
    const now = Date.now();
    return (now - entry.timestamp) < finalConfig.maxAge;
  }, [finalConfig.maxAge]);

  const cleanup = useCallback(() => {
    const now = Date.now();
    let cleanedCount = 0;

    // Remove expired entries
    memoryCache.current.forEach((entry, key) => {
      if (!isValidEntry(entry)) {
        memoryCache.current.delete(key);
        cleanedCount++;
      }
    });

    // If still over limit, remove least recently used
    if (memoryCache.current.size > finalConfig.maxSize) {
      const entries = Array.from(memoryCache.current.entries())
        .sort((a, b) => a[1].lastAccess - b[1].lastAccess);
      
      const toRemove = entries.slice(0, memoryCache.current.size - finalConfig.maxSize);
      toRemove.forEach(([key]) => {
        memoryCache.current.delete(key);
        cleanedCount++;
      });
      
      statsRef.current.evictions += toRemove.length;
    }

    if (cleanedCount > 0) {
      statsRef.current.cleanups++;
      console.log(`MemorySafeCache: Cleaned up ${cleanedCount} entries from ${cacheKey}`);
      saveToPersistentStorage();
    }
  }, [finalConfig.maxSize, finalConfig.maxAge, cacheKey, isValidEntry]);

  const saveToPersistentStorage = useCallback(() => {
    const cacheObject: Record<string, CacheEntry<T>> = {};
    memoryCache.current.forEach((entry, key) => {
      if (isValidEntry(entry)) {
        cacheObject[key] = entry;
      }
    });
    setPersistentCache(cacheObject);
  }, [setPersistentCache, isValidEntry]);

  const get = useCallback((key: string): T | null => {
    const entry = memoryCache.current.get(key);
    
    if (!entry || !isValidEntry(entry)) {
      statsRef.current.misses++;
      return null;
    }

    // Update access info
    entry.accessCount++;
    entry.lastAccess = Date.now();
    
    statsRef.current.hits++;
    return entry.data;
  }, [isValidEntry]);

  const set = useCallback((key: string, data: T): void => {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      accessCount: 1,
      lastAccess: now
    };

    memoryCache.current.set(key, entry);
    
    // Trigger cleanup if needed
    if (memoryCache.current.size > finalConfig.maxSize) {
      cleanup();
    }

    console.log(`MemorySafeCache: Set ${key} in cache ${cacheKey}`);
  }, [finalConfig.maxSize, cleanup, cacheKey]);

  const remove = useCallback((key: string): boolean => {
    const deleted = memoryCache.current.delete(key);
    if (deleted) {
      console.log(`MemorySafeCache: Removed ${key} from cache ${cacheKey}`);
      saveToPersistentStorage();
    }
    return deleted;
  }, [cacheKey, saveToPersistentStorage]);

  const clear = useCallback(() => {
    memoryCache.current.clear();
    setPersistentCache({});
    console.log(`MemorySafeCache: Cleared all entries from cache ${cacheKey}`);
  }, [setPersistentCache, cacheKey]);

  const getStats = useCallback(() => ({
    size: memoryCache.current.size,
    maxSize: finalConfig.maxSize,
    usage: (memoryCache.current.size / finalConfig.maxSize) * 100,
    hitRate: statsRef.current.hits + statsRef.current.misses > 0 
      ? (statsRef.current.hits / (statsRef.current.hits + statsRef.current.misses)) * 100 
      : 0,
    ...statsRef.current
  }), [finalConfig.maxSize]);

  return {
    get,
    set,
    remove,
    clear,
    cleanup,
    getStats,
    isValidEntry
  };
};
