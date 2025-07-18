
import { useEffect, useCallback } from 'react';
import { useSmartLoading } from '@/contexts/SmartLoadingContext';
import { useOptimizedAuth } from './useOptimizedAuth';
import { useNonBlockingProfile } from './useNonBlockingProfile';

export const useSmartLoadingIntegration = () => {
  const { setLoading, resetRetry } = useSmartLoading();
  const {
    authLoading,
    actionLoading,
    profileLoading,
    isInitializing,
    isActionInProgress
  } = useOptimizedAuth();

  // Use non-blocking profile for enhanced profile loading
  const { isBackgroundRefreshing } = useNonBlockingProfile();

  // Sync auth loading states
  useEffect(() => {
    setLoading('auth', authLoading || isInitializing, 'Kimlik doğrulanıyor...');
  }, [authLoading, isInitializing, setLoading]);

  useEffect(() => {
    setLoading('action', actionLoading || isActionInProgress, 'İşlem gerçekleştiriliyor...');
  }, [actionLoading, isActionInProgress, setLoading]);

  // Enhanced profile loading - only show loading for initial fetch, not background refresh
  useEffect(() => {
    // Only show profile loading if it's blocking (not a background refresh)
    const isBlockingProfileLoad = profileLoading && !isBackgroundRefreshing;
    setLoading('profile', isBlockingProfileLoad, 'Profil bilgileri yükleniyor...');
  }, [profileLoading, isBackgroundRefreshing, setLoading]);

  // Smart loading operations with retry logic
  const withSmartLoading = useCallback(
    async <T>(
      operation: () => Promise<T>,
      type: 'search' | 'data' | 'navigation',
      operationName?: string
    ): Promise<T | null> => {
      try {
        setLoading(type, true, operationName);
        resetRetry();
        const result = await operation();
        setLoading(type, false);
        return result;
      } catch (error) {
        setLoading(type, false);
        console.error(`Smart loading error for ${type}:`, error);
        throw error;
      }
    },
    [setLoading, resetRetry]
  );

  // Search operation wrapper
  const withSearchLoading = useCallback(
    (operation: () => Promise<any>, searchTerm?: string) => {
      const operationName = searchTerm 
        ? `"${searchTerm}" için arama yapılıyor...`
        : 'Arama yapılıyor...';
      return withSmartLoading(operation, 'search', operationName);
    },
    [withSmartLoading]
  );

  // Data operation wrapper
  const withDataLoading = useCallback(
    (operation: () => Promise<any>, dataType?: string) => {
      const operationName = dataType
        ? `${dataType} verileri yükleniyor...`
        : 'Veriler yükleniyor...';
      return withSmartLoading(operation, 'data', operationName);
    },
    [withSmartLoading]
  );

  // Navigation operation wrapper
  const withNavigationLoading = useCallback(
    (operation: () => Promise<any>) => {
      return withSmartLoading(operation, 'navigation', 'Sayfa yükleniyor...');
    },
    [withSmartLoading]
  );

  return {
    withSmartLoading,
    withSearchLoading,
    withDataLoading,
    withNavigationLoading,
  };
};
