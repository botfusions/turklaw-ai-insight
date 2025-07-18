
import { useCallback, useEffect, useRef, useState } from 'react';
import { Profile } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfileCache } from './useProfileCache';
import { useSmartLoading } from '@/contexts/SmartLoadingContext';
import { useMemorySafeTimer } from './useMemorySafeTimer';
import { useMemorySafeRequest } from './useMemorySafeRequest';
import { useMemoryMonitor } from './useMemoryMonitor';

interface ProfileError {
  type: 'network' | 'auth' | 'server' | 'unknown';
  message: string;
  retryable: boolean;
}

export const useNonBlockingProfile = () => {
  const { user } = useAuth();
  const { setLoading, incrementRetry, resetRetry, state } = useSmartLoading();
  const {
    cachedProfile,
    cacheProfile,
    shouldBackgroundRefresh,
    clearCache,
    getCacheInfo
  } = useProfileCache();

  // Memory-safe utilities
  const { createTimeout, createInterval } = useMemorySafeTimer();
  const { createRequest } = useMemorySafeRequest();
  const { logComponentRender, getMemoryReport } = useMemoryMonitor('NonBlockingProfile');

  const [profile, setProfile] = useState<Profile | null>(cachedProfile);
  const [error, setError] = useState<ProfileError | null>(null);
  const [isBackgroundRefreshing, setIsBackgroundRefreshing] = useState(false);
  const [lastFetchAttempt, setLastFetchAttempt] = useState<number>(0);

  // Memory-safe refs
  const backgroundRefreshHandleRef = useRef<{ clear: () => void } | null>(null);
  const currentRequestRef = useRef<{ cancel: () => void } | null>(null);

  // Log component renders for memory monitoring
  useEffect(() => {
    logComponentRender();
  });

  // Enhanced error classification
  const classifyError = useCallback((error: any): ProfileError => {
    if (error?.code === 'PGRST116') {
      return {
        type: 'auth',
        message: 'Kimlik doğrulama gerekli',
        retryable: false
      };
    }
    
    if (error?.name === 'AbortError') {
      return {
        type: 'network',
        message: 'İstek iptal edildi',
        retryable: false
      };
    }
    
    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      return {
        type: 'network',
        message: 'Ağ bağlantısı sorunu',
        retryable: true
      };
    }
    
    if (error?.code?.startsWith('5')) {
      return {
        type: 'server',
        message: 'Sunucu hatası',
        retryable: true
      };
    }
    
    return {
      type: 'unknown',
      message: 'Profil yüklenemedi',
      retryable: true
    };
  }, []);

  // Smart retry strategy with exponential backoff
  const getRetryDelay = useCallback((attempt: number): number => {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }, []);

  // Memory-safe profile fetch function
  const fetchProfile = useCallback(async (isBackground = false): Promise<Profile | null> => {
    if (!user?.id) return null;

    // Cancel any existing request
    if (currentRequestRef.current) {
      currentRequestRef.current.cancel();
    }

    const requestHandle = createRequest(async (signal: AbortSignal): Promise<Profile | null> => {
      try {
        if (!isBackground) {
          setLoading('profile', true, 'Profil bilgileri güncelleniyor...');
        }
        setError(null);
        
        console.log('NonBlockingProfile: Fetching profile', { 
          userId: user.id, 
          isBackground, 
          retryCount: state.retryCount 
        });

        // Create a promise that can be aborted
        const fetchPromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        // Create an abortable wrapper
        const abortablePromise = new Promise<any>((resolve, reject) => {
          signal.addEventListener('abort', () => {
            reject(new Error('AbortError'));
          });
          
          fetchPromise.then(resolve).catch(reject);
        });

        const { data, error } = await abortablePromise;

        if (error) throw error;

        const newProfile = data as Profile;
        
        // Update both local state and cache
        setProfile(newProfile);
        if (newProfile) {
          cacheProfile(newProfile);
        }
        
        resetRetry();
        setLastFetchAttempt(Date.now());
        
        console.log('NonBlockingProfile: Profile fetched successfully', { 
          profile: newProfile, 
          isBackground 
        });
        
        return newProfile;
      } catch (error) {
        if (signal.aborted || (error as Error).message === 'AbortError') {
          console.log('NonBlockingProfile: Request was cancelled');
          return null;
        }

        const classifiedError = classifyError(error);
        console.error('NonBlockingProfile: Fetch error', { error, classified: classifiedError });
        
        setError(classifiedError);
        
        // Only retry if error is retryable and we haven't exceeded max retries
        if (classifiedError.retryable && state.retryCount < 3) {
          incrementRetry();
          const delay = getRetryDelay(state.retryCount);
          
          console.log('NonBlockingProfile: Scheduling retry', { 
            attempt: state.retryCount + 1, 
            delay 
          });
          
          createTimeout(() => {
            if (user?.id) {
              fetchProfile(isBackground);
            }
          }, delay, `profile_retry_${state.retryCount}`);
        }
        
        return null;
      } finally {
        if (!isBackground) {
          setLoading('profile', false);
        }
        currentRequestRef.current = null;
      }
    }, `profile_fetch_${Date.now()}`);

    currentRequestRef.current = requestHandle;
    return requestHandle.promise;
  }, [
    user?.id,
    setLoading,
    state.retryCount,
    cacheProfile,
    resetRetry,
    incrementRetry,
    classifyError,
    getRetryDelay,
    createRequest,
    createTimeout
  ]);

  // Memory-safe background refresh function
  const startBackgroundRefresh = useCallback(() => {
    if (!user?.id) return;

    // Clear existing background refresh
    if (backgroundRefreshHandleRef.current) {
      backgroundRefreshHandleRef.current.clear();
    }

    const scheduleRefresh = () => {
      const intervalHandle = createInterval(async () => {
        if (shouldBackgroundRefresh()) {
          console.log('NonBlockingProfile: Starting background refresh');
          setIsBackgroundRefreshing(true);
          
          try {
            await fetchProfile(true);
          } catch (error) {
            console.error('NonBlockingProfile: Background refresh failed', error);
          } finally {
            setIsBackgroundRefreshing(false);
          }
        }
      }, 5 * 60 * 1000, 'profile_background_refresh'); // Check every 5 minutes

      backgroundRefreshHandleRef.current = intervalHandle;
    };

    scheduleRefresh();
  }, [user?.id, shouldBackgroundRefresh, fetchProfile, createInterval]);

  // Manual refresh function
  const refreshProfile = useCallback(async (): Promise<Profile | null> => {
    return fetchProfile(false);
  }, [fetchProfile]);

  // Force refresh (bypass cache)
  const forceRefresh = useCallback(async (): Promise<Profile | null> => {
    clearCache();
    return fetchProfile(false);
  }, [clearCache, fetchProfile]);

  // Initialize profile loading
  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      setError(null);
      return;
    }

    // Use cached profile immediately if available
    if (cachedProfile) {
      setProfile(cachedProfile);
      console.log('NonBlockingProfile: Using cached profile');
    }

    // Always try to fetch fresh data, but don't block if we have cache
    const shouldFetchNow = !cachedProfile || shouldBackgroundRefresh();
    
    if (shouldFetchNow) {
      fetchProfile(!!cachedProfile); // Background fetch if we have cached data
    }

    // Start background refresh cycle
    startBackgroundRefresh();

    return () => {
      // Memory-safe cleanup
      if (backgroundRefreshHandleRef.current) {
        backgroundRefreshHandleRef.current.clear();
        backgroundRefreshHandleRef.current = null;
      }
      
      if (currentRequestRef.current) {
        currentRequestRef.current.cancel();
        currentRequestRef.current = null;
      }
    };
  }, [user?.id, cachedProfile, shouldBackgroundRefresh, fetchProfile, startBackgroundRefresh]);

  return {
    profile,
    error,
    isBackgroundRefreshing,
    lastFetchAttempt,
    refreshProfile,
    forceRefresh,
    cacheInfo: getCacheInfo(),
    
    // Status helpers
    hasProfile: !!profile,
    isProfileStale: shouldBackgroundRefresh(),
    canRetry: error?.retryable && state.retryCount < 3,
    
    // Debug info with memory stats
    debugInfo: {
      retryCount: state.retryCount,
      lastFetchAttempt: lastFetchAttempt ? new Date(lastFetchAttempt).toISOString() : null,
      cacheInfo: getCacheInfo(),
      memoryReport: getMemoryReport()
    }
  };
};
