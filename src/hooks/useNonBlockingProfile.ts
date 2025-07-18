import { useCallback, useEffect, useRef, useState } from 'react';
import { Profile } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfileCache } from './useProfileCache';
import { useSmartLoading } from '@/contexts/SmartLoadingContext';

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

  const [profile, setProfile] = useState<Profile | null>(cachedProfile);
  const [error, setError] = useState<ProfileError | null>(null);
  const [isBackgroundRefreshing, setIsBackgroundRefreshing] = useState(false);
  const [lastFetchAttempt, setLastFetchAttempt] = useState<number>(0);

  // Request deduplication
  const fetchRequestRef = useRef<Promise<Profile | null> | null>(null);
  const backgroundRefreshRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced error classification
  const classifyError = useCallback((error: any): ProfileError => {
    if (error?.code === 'PGRST116') {
      return {
        type: 'auth',
        message: 'Kimlik doğrulama gerekli',
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

  // Main profile fetch function with deduplication
  const fetchProfile = useCallback(async (isBackground = false): Promise<Profile | null> => {
    if (!user?.id) return null;

    // Prevent multiple concurrent requests
    if (fetchRequestRef.current && !isBackground) {
      return fetchRequestRef.current;
    }

    const fetchPromise = (async (): Promise<Profile | null> => {
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

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

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
          
          setTimeout(() => {
            if (user?.id) {
              fetchProfile(isBackground);
            }
          }, delay);
        }
        
        return null;
      } finally {
        if (!isBackground) {
          setLoading('profile', false);
        }
        fetchRequestRef.current = null;
      }
    })();

    if (!isBackground) {
      fetchRequestRef.current = fetchPromise;
    }

    return fetchPromise;
  }, [
    user?.id,
    setLoading,
    state.retryCount,
    cacheProfile,
    resetRetry,
    incrementRetry,
    classifyError,
    getRetryDelay
  ]);

  // Background refresh function
  const startBackgroundRefresh = useCallback(() => {
    if (!user?.id || backgroundRefreshRef.current) return;

    const scheduleRefresh = () => {
      backgroundRefreshRef.current = setTimeout(async () => {
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
        
        // Schedule next refresh
        scheduleRefresh();
      }, 5 * 60 * 1000); // Check every 5 minutes
    };

    scheduleRefresh();
  }, [user?.id, shouldBackgroundRefresh, fetchProfile]);

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
      if (backgroundRefreshRef.current) {
        clearTimeout(backgroundRefreshRef.current);
        backgroundRefreshRef.current = null;
      }
    };
  }, [user?.id, cachedProfile, shouldBackgroundRefresh, fetchProfile, startBackgroundRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (backgroundRefreshRef.current) {
        clearTimeout(backgroundRefreshRef.current);
      }
    };
  }, []);

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
    
    // Debug info
    debugInfo: {
      retryCount: state.retryCount,
      lastFetchAttempt: lastFetchAttempt ? new Date(lastFetchAttempt).toISOString() : null,
      cacheInfo: getCacheInfo()
    }
  };
};