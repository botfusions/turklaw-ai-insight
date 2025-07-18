
import { useAuthData } from '@/contexts/AuthDataContext';
import { useAuthActions } from '@/contexts/AuthActionsContext';
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

export const useOptimizedAuth = () => {
  const authData = useAuthData();
  const authActions = useAuthActions();

  const optimizedStates = useMemo((): OptimizedAuthStates => {
    const isInitializing = !authData.initialized;
    const isReady = authData.initialized;
    const hasAuthError = false;
    const isUserAuthenticated = isReady && !!authData.user && !!authData.profile;
    const isProfileLoading = false;
    const isActionInProgress = authActions.loading;
    const canRenderApp = isReady;

    return {
      isInitializing,
      isReady,
      hasAuthError,
      isUserAuthenticated,
      isProfileLoading,
      isActionInProgress,
      canRenderApp,
    };
  }, [authData.initialized, authData.user, authData.profile, authActions.loading]);

  return useMemo(() => ({
    // Auth data
    user: authData.user,
    profile: authData.profile,
    initialized: authData.initialized,
    authLoading: !authData.initialized,
    actionLoading: authActions.loading,
    profileLoading: false,
    authError: null,
    profileError: null,
    
    // Actions
    signUp: authActions.signUp,
    signIn: authActions.signIn,
    signOut: authActions.signOut,
    resetPassword: authActions.resetPassword,
    updateProfile: authActions.updateProfile,
    resendConfirmation: authActions.resendConfirmation,
    refreshProfile: authData.refreshProfile,
    clearAuthError: () => {},
    clearProfileError: () => {},
    
    // Optimized states
    ...optimizedStates,
  }), [authData, authActions, optimizedStates]);
};
