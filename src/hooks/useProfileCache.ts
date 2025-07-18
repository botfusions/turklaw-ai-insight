import { useCallback, useEffect, useState } from 'react';
import { Profile } from '@/types/auth';

interface CachedProfile {
  data: Profile;
  timestamp: number;
  networkStatus: 'online' | 'offline' | 'slow';
}

const CACHE_KEY = 'smart_profile_cache';
const CACHE_DURATION_ONLINE = 15 * 60 * 1000; // 15 minutes online
const CACHE_DURATION_OFFLINE = 60 * 60 * 1000; // 1 hour offline
const CACHE_DURATION_SLOW = 30 * 60 * 1000; // 30 minutes slow network

export const useProfileCache = () => {
  const [cachedProfile, setCachedProfile] = useState<Profile | null>(null);
  const [cacheTimestamp, setCacheTimestamp] = useState<number | null>(null);

  // Get current network status
  const getNetworkStatus = useCallback((): 'online' | 'offline' | 'slow' => {
    if (!navigator.onLine) return 'offline';
    
    const connection = (navigator as any).connection;
    if (connection && connection.effectiveType && ['slow-2g', '2g'].includes(connection.effectiveType)) {
      return 'slow';
    }
    
    return 'online';
  }, []);

  // Get cache duration based on network status
  const getCacheDuration = useCallback((networkStatus: 'online' | 'offline' | 'slow') => {
    switch (networkStatus) {
      case 'offline': return CACHE_DURATION_OFFLINE;
      case 'slow': return CACHE_DURATION_SLOW;
      default: return CACHE_DURATION_ONLINE;
    }
  }, []);

  // Load cached profile from localStorage
  const loadCachedProfile = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const parsedCache: CachedProfile = JSON.parse(cached);
      const now = Date.now();
      const age = now - parsedCache.timestamp;
      const maxAge = getCacheDuration(parsedCache.networkStatus);

      if (age < maxAge) {
        setCachedProfile(parsedCache.data);
        setCacheTimestamp(parsedCache.timestamp);
        return parsedCache.data;
      } else {
        // Cache expired, remove it
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
    } catch (error) {
      console.error('ProfileCache: Error loading cached profile:', error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, [getCacheDuration]);

  // Save profile to cache
  const cacheProfile = useCallback((profile: Profile) => {
    try {
      const networkStatus = getNetworkStatus();
      const cacheData: CachedProfile = {
        data: profile,
        timestamp: Date.now(),
        networkStatus
      };
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      setCachedProfile(profile);
      setCacheTimestamp(cacheData.timestamp);
      
      console.log('ProfileCache: Profile cached successfully', { networkStatus });
    } catch (error) {
      console.error('ProfileCache: Error caching profile:', error);
    }
  }, [getNetworkStatus]);

  // Check if cache is fresh enough for background refresh
  const shouldBackgroundRefresh = useCallback(() => {
    if (!cacheTimestamp) return true;
    
    const age = Date.now() - cacheTimestamp;
    const networkStatus = getNetworkStatus();
    
    // Background refresh every 5 minutes for online, 10 minutes for slow
    const refreshThreshold = networkStatus === 'online' ? 5 * 60 * 1000 : 10 * 60 * 1000;
    
    return age > refreshThreshold;
  }, [cacheTimestamp, getNetworkStatus]);

  // Clear cache
  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    setCachedProfile(null);
    setCacheTimestamp(null);
  }, []);

  // Get cache info for debugging
  const getCacheInfo = useCallback(() => {
    if (!cachedProfile || !cacheTimestamp) return null;
    
    const age = Date.now() - cacheTimestamp;
    const networkStatus = getNetworkStatus();
    const maxAge = getCacheDuration(networkStatus);
    const isExpired = age >= maxAge;
    const shouldRefresh = shouldBackgroundRefresh();
    
    return {
      hasCache: true,
      age,
      maxAge,
      isExpired,
      shouldRefresh,
      networkStatus,
      cachedAt: new Date(cacheTimestamp).toISOString()
    };
  }, [cachedProfile, cacheTimestamp, getNetworkStatus, getCacheDuration, shouldBackgroundRefresh]);

  // Load cache on mount
  useEffect(() => {
    loadCachedProfile();
  }, [loadCachedProfile]);

  return {
    cachedProfile,
    cacheProfile,
    loadCachedProfile,
    shouldBackgroundRefresh,
    clearCache,
    getCacheInfo,
    isStale: cacheTimestamp ? Date.now() - cacheTimestamp > getCacheDuration(getNetworkStatus()) : true
  };
};