
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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

  // Simple profile fetch without dependencies to prevent race conditions
  const fetchProfile = async (userId: string) => {
    try {
      console.log('AuthContext: Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('AuthContext: Profile fetch error:', error);
        return;
      }
      
      console.log('AuthContext: Profile fetched:', data);
      setProfile(data as Profile);
    } catch (error) {
      console.error('AuthContext: Profile fetch exception:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

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

  const signUp = async (email: string, password: string, fullName?: string): Promise<AuthResult> => {
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
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
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
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
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
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<AuthResult> => {
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
  };

  const resendConfirmation = async (email: string): Promise<AuthResult> => {
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
  };

  // Ultra-simple auth initialization
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log('AuthContext: Starting initialization...');
        
        // Set up listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return;
            
            console.log('AuthContext: Auth state changed:', event, session?.user?.id);
            setUser(session?.user ?? null);
            
            // Non-blocking profile fetch
            if (session?.user) {
              setTimeout(() => {
                if (mounted) fetchProfile(session.user.id);
              }, 100);
            } else {
              setProfile(null);
            }
          }
        );

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) {
          subscription.unsubscribe();
          return;
        }
        
        console.log('AuthContext: Initial session:', session?.user?.id);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            if (mounted) fetchProfile(session.user.id);
          }, 100);
        }
        
        setInitialized(true);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('AuthContext: Initialization error:', error);
        if (mounted) {
          setInitialized(true); // Always mark as initialized
        }
      }
    };

    let cleanup: (() => void) | undefined;
    initAuth().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, []);

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
