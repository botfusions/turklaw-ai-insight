
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, AuthResult, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  
  // Use refs to prevent dependencies and race conditions
  const mountedRef = useRef(true);
  const initializingRef = useRef(false);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 2;

  // Simplified profile fetching without complex dependencies
  const fetchProfile = useCallback(async (userId: string): Promise<void> => {
    if (!mountedRef.current || !userId) return;
    
    try {
      console.log('UnifiedAuthContext: Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!mountedRef.current) return;

      if (error) {
        console.error('UnifiedAuthContext: Error fetching profile:', error);
        setProfile(null);
        return;
      }
      
      console.log('UnifiedAuthContext: Profile fetched successfully:', data);
      setProfile(data as Profile);
    } catch (error) {
      console.error('UnifiedAuthContext: Error fetching profile:', error);
      if (mountedRef.current) {
        setProfile(null);
      }
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    const currentUser = user;
    if (currentUser && mountedRef.current) {
      await fetchProfile(currentUser.id);
    }
  }, [user, fetchProfile]);

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
    const currentUser = user;
    if (!currentUser) {
      return { success: false, error: 'Kullanıcı oturum açmamış' };
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', currentUser.id);

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

  // Simplified initialization without complex retry logic
  const initializeAuth = useCallback(async (): Promise<() => void> => {
    if (!mountedRef.current || initializingRef.current) {
      return () => {};
    }

    initializingRef.current = true;

    try {
      console.log('UnifiedAuthContext: Initializing auth...');
      
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (!mountedRef.current) return;
          
          console.log('UnifiedAuthContext: Auth state change:', event, session?.user?.id);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Use setTimeout to prevent blocking
            setTimeout(() => {
              if (mountedRef.current) {
                fetchProfile(session.user.id);
              }
            }, 0);
          } else {
            setProfile(null);
          }
        }
      );

      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!mountedRef.current) {
        subscription.unsubscribe();
        return () => {};
      }
      
      if (error) {
        console.error('UnifiedAuthContext: Error getting initial session:', error);
        setInitError(error.message);
      } else {
        console.log('UnifiedAuthContext: Initial session check:', session?.user?.id);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
        setInitError(null);
      }
      
      setInitialized(true);
      initializingRef.current = false;

      return () => {
        subscription.unsubscribe();
      };
    } catch (error: any) {
      console.error('UnifiedAuthContext: Auth initialization error:', error);
      
      if (mountedRef.current) {
        setInitError(error.message);
        setInitialized(true); // Mark as initialized even with error
      }
      
      initializingRef.current = false;
      return () => {};
    }
  }, [fetchProfile]);

  useEffect(() => {
    mountedRef.current = true;
    let cleanup: () => void;

    initializeAuth().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      mountedRef.current = false;
      if (cleanup) {
        cleanup();
      }
    };
  }, [initializeAuth]);

  const value: AuthContextType = {
    user,
    profile,
    loading,
    initialized,
    refreshProfile,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    resendConfirmation
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
