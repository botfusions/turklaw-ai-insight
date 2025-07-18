
import { useAuthData } from '@/contexts/AuthDataContext';
import { useAuthActions } from '@/contexts/AuthActionsContext';
import { AuthContextType } from '@/types/auth';

export const useAuth = (): AuthContextType => {
  console.log('useAuth hook called...');
  
  try {
    const authData = useAuthData();
    console.log('useAuth authData:', { 
      user: !!authData?.user, 
      profile: !!authData?.profile, 
      initialized: authData?.initialized 
    });
    
    const authActions = useAuthActions();
    console.log('useAuth authActions:', { 
      loading: authActions?.loading,
      hasSignUp: !!authActions?.signUp,
      hasSignIn: !!authActions?.signIn 
    });

    const result = {
      ...authData,
      ...authActions
    };
    
    console.log('useAuth returning:', { 
      user: !!result.user, 
      profile: !!result.profile, 
      loading: result.loading,
      initialized: result.initialized 
    });
    
    return result;
  } catch (error) {
    console.error('useAuth error:', error);
    // Fallback değerler döndür
    return {
      user: null,
      profile: null,
      loading: false,
      initialized: true,
      refreshProfile: async () => {},
      signUp: async () => ({ success: false, error: 'Auth not available' }),
      signIn: async () => ({ success: false, error: 'Auth not available' }),
      signOut: async () => {},
      resetPassword: async () => ({ success: false, error: 'Auth not available' }),
      updateProfile: async () => ({ success: false, error: 'Auth not available' }),
      resendConfirmation: async () => ({ success: false, error: 'Auth not available' })
    };
  }
};
