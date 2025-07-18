
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
    // App is initializing if not initialized
    const isInitializing = !authData.initialized;
    
    // App is ready when initialized
    const isReady = authData.initialized;
    
    // No auth errors in new simplified structure
    const hasAuthError = false;
    
    // User is properly authenticated
    const isUserAuthenticated = isReady && !!authData.user && !!authData.profile;
    
    // Profile loading is handled differently in new structure
    const isProfileLoading = false;
    
    // Action is in progress
    const isActionInProgress = authActions.loading;
    
    // Can render main app when ready
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
  }, [authData, authActions]);

  // Combine all auth functionality for backward compatibility
  const combinedAuth = useMemo(() => ({
    // Original auth context structure
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

  return combinedAuth;
};
