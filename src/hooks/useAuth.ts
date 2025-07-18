
import { useAuthData } from '@/contexts/AuthDataContext';
import { useAuthActions } from '@/contexts/AuthActionsContext';
import { useMemo } from 'react';

export const useAuth = () => {
  const authData = useAuthData();
  const authActions = useAuthActions();

  // Combine both contexts to maintain backward compatibility
  const combinedAuth = useMemo(() => ({
    // Auth data
    user: authData.user,
    profile: authData.profile,
    initialized: authData.initialized,
    
    // Loading states - map from new structure
    authLoading: !authData.initialized,
    actionLoading: authActions.loading,
    profileLoading: false, // No longer tracked separately in new structure
    
    // Error states - simplified for compatibility
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
    
    // Compatibility methods
    clearAuthError: () => {},
    clearProfileError: () => {},
  }), [authData, authActions]);

  return combinedAuth;
};
