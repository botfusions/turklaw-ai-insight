
import { useAuth } from '@/hooks/useAuth';
import { useMemo } from 'react';

export interface OptimizedAuthStates {
  isInitializing: boolean;
  isReady: boolean;
  hasAuthError: boolean;
  isUserAuthenticated: boolean;
  isProfileLoading: boolean;
  isActionInProgress: boolean;
  canRenderApp: boolean;
}

export const useOptimizedAuth = (): OptimizedAuthStates & ReturnType<typeof useAuth> => {
  const auth = useAuth();

  const optimizedStates = useMemo((): OptimizedAuthStates => {
    // App is initializing if not initialized or actively loading auth
    const isInitializing = !auth.initialized || auth.authLoading;
    
    // App is ready when initialized and no critical auth loading
    const isReady = auth.initialized && !auth.authLoading;
    
    // Has recoverable auth error
    const hasAuthError = !!auth.authError && auth.initialized;
    
    // User is properly authenticated
    const isUserAuthenticated = isReady && !!auth.user && !!auth.profile;
    
    // Profile is loading but non-blocking
    const isProfileLoading = auth.profileLoading;
    
    // Action is in progress (blocking for UX feedback)
    const isActionInProgress = auth.actionLoading;
    
    // Can render main app (even with profile loading or action loading)
    const canRenderApp = isReady && !hasAuthError;

    return {
      isInitializing,
      isReady,
      hasAuthError,
      isUserAuthenticated,
      isProfileLoading,
      isActionInProgress,
      canRenderApp,
    };
  }, [
    auth.initialized,
    auth.authLoading,
    auth.authError,
    auth.user,
    auth.profile,
    auth.profileLoading,
    auth.actionLoading,
  ]);

  return {
    ...auth,
    ...optimizedStates,
  };
};
