
import { useAuthData } from '@/contexts/AuthDataContext';
import { useAuthActions } from '@/contexts/AuthActionsContext';
import { useMemo } from 'react';

export const useAuth = () => {
  try {
    const authData = useAuthData();
    const authActions = useAuthActions();

    console.log('🔧 useAuth: Data from contexts', {
      hasUser: !!authData.user,
      initialized: authData.initialized,
      loading: authActions.loading
    });

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
  } catch (error) {
    console.error('🚨 useAuth: Error in hook', error);
    // Return safe fallback
    return {
      user: null,
      profile: null,
      initialized: false,
      authLoading: true,
      actionLoading: false,
      profileLoading: false,
      authError: 'Auth hook hatası',
      profileError: null,
      signUp: async () => ({ success: false, error: 'Auth hook hatası' }),
      signIn: async () => ({ success: false, error: 'Auth hook hatası' }),
      signOut: async () => {},
      resetPassword: async () => ({ success: false, error: 'Auth hook hatası' }),
      updateProfile: async () => ({ success: false, error: 'Auth hook hatası' }),
      resendConfirmation: async () => ({ success: false, error: 'Auth hook hatası' }),
      refreshProfile: async () => {},
      clearAuthError: () => {},
      clearProfileError: () => {},
    };
  }
};
