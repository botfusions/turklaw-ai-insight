import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, AuthResult } from '@/types/auth';
import { useAuthData } from './AuthDataContext';

interface AuthActionsContextType {
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updateProfile: (updates: Partial<Profile>) => Promise<AuthResult>;
  canSearch: () => boolean;
  incrementSearchCount: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<AuthResult>;
}

const AuthActionsContext = createContext<AuthActionsContextType | undefined>(undefined);

interface AuthActionsProviderProps {
  children: ReactNode;
}

export const AuthActionsProvider: React.FC<AuthActionsProviderProps> = ({ children }) => {
  const { user, profile, refreshProfile } = useAuthData();
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error: any): string => {
    if (!error?.message) return 'Bilinmeyen bir hata oluştu';
    
    const message = error.message.toLowerCase();
    
    if (message.includes('email not confirmed')) {
      return 'E-posta adresiniz doğrulanmamış. Lütfen e-postanızı kontrol edin.';
    }
    if (message.includes('invalid login credentials')) {
      return 'Geçersiz e-posta veya şifre.';
    }
    if (message.includes('user already registered')) {
      return 'Bu e-posta adresi zaten kayıtlı.';
    }
    if (message.includes('password')) {
      return 'Şifre en az 6 karakter olmalıdır.';
    }
    
    return error.message;
  };

  const resendConfirmation = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-verification`
        }
      });

      if (error) {
        return { success: false, error: getErrorMessage(error) };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName || ''
          }
        }
      });
      
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error)
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error)
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error)
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>): Promise<AuthResult> => {
    if (!user) {
      return { success: false, error: 'Kullanıcı oturum açmamış' };
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error)
      };
    } finally {
      setLoading(false);
    }
  }, [user, refreshProfile]);

  const canSearch = useCallback((): boolean => {
    if (!profile) return false;
    return profile.monthly_search_count < profile.max_searches;
  }, [profile]);

  const incrementSearchCount = useCallback(async (): Promise<void> => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          search_count: profile.search_count + 1,
          monthly_search_count: profile.monthly_search_count + 1
        })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
    } catch (error) {
      console.error('Error incrementing search count:', error);
    }
  }, [user, profile, refreshProfile]);

  const value: AuthActionsContextType = {
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    canSearch,
    incrementSearchCount,
    resendConfirmation,
  };

  return <AuthActionsContext.Provider value={value}>{children}</AuthActionsContext.Provider>;
};

export const useAuthActions = (): AuthActionsContextType => {
  const context = useContext(AuthActionsContext);
  if (context === undefined) {
    throw new Error('useAuthActions must be used within an AuthActionsProvider');
  }
  return context;
};