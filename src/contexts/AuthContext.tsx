
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, AuthResult, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Core auth state
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  // Granular loading states
  const [authLoading, setAuthLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  // Error states
  const [authError, setAuthError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Error management functions
  const clearAuthError = useCallback(() => setAuthError(null), []);
  const clearProfileError = useCallback(() => setProfileError(null), []);

  // Non-blocking profile fetch with retry mechanism
  const fetchProfile = useCallback(async (userId: string, retryCount = 0) => {
    try {
      setProfileLoading(true);
      setProfileError(null);
      
      console.log('AuthContext: Fetching profile for user:', userId, 'retry:', retryCount);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('AuthContext: Profile fetch error:', error);
        if (retryCount < 2) {
          // Retry after delay
          setTimeout(() => fetchProfile(userId, retryCount + 1), 1000 * (retryCount + 1));
          return;
        }
        setProfileError('Profil bilgileri yüklenemedi');
        setProfile(null);
        return;
      }
      
      console.log('AuthContext: Profile fetched successfully:', data);
      setProfile(data as Profile);
      setProfileError(null);
    } catch (error: any) {
      console.error('AuthContext: Profile fetch exception:', error);
      if (retryCount < 2) {
        setTimeout(() => fetchProfile(userId, retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      setProfileError('Profil bilgileri yüklenirken hata oluştu');
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Refresh profile with proper loading state management
  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  // Enhanced error message handling
  const getErrorMessage = useCallback((error: any): string => {
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
  }, []);

  // Optimized auth actions with proper loading states
  const signUp = useCallback(async (email: string, password: string, fullName?: string): Promise<AuthResult> => {
    try {
      setActionLoading(true);
      setAuthError(null);
      
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
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setActionLoading(false);
    }
  }, [getErrorMessage]);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      setActionLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setActionLoading(false);
    }
  }, [getErrorMessage]);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      setActionLoading(true);
      setAuthError(null);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      setAuthError('Çıkış yapılırken hata oluştu');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      setActionLoading(true);
      setAuthError(null);
      
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setActionLoading(false);
    }
  }, [getErrorMessage]);

  const updateProfile = useCallback(async (updates: Partial<Profile>): Promise<AuthResult> => {
    if (!user) {
      const errorMessage = 'Kullanıcı oturum açmamış';
      setProfileError(errorMessage);
      return { success: false, error: errorMessage };
    }

    try {
      setActionLoading(true);
      setProfileError(null);
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      
      return { success: true };
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setProfileError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setActionLoading(false);
    }
  }, [user, refreshProfile, getErrorMessage]);

  const resendConfirmation = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      setActionLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-verification`
        }
      });

      if (error) {
        const errorMessage = getErrorMessage(error);
        setAuthError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  }, [getErrorMessage]);

  // Optimized auth initialization with improved state machine
  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Starting optimized initialization...');
        setAuthLoading(true);
        setAuthError(null);
        
        // Set up auth state listener first
        authSubscription = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return;
            
            console.log('AuthContext: Auth state changed:', event, session?.user?.id);
            
            // Clear auth errors on successful auth change
            if (session?.user) {
              setAuthError(null);
            }
            
            // Update user state immediately
            setUser(session?.user ?? null);
            
            // Non-blocking profile fetch
            if (session?.user && mounted) {
              // Small delay to prevent race conditions
              setTimeout(() => {
                if (mounted) {
                  fetchProfile(session.user.id);
                }
              }, 50);
            } else {
              setProfile(null);
              setProfileError(null);
              setProfileLoading(false);
            }
          }
        );

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthContext: Session fetch error:', error);
          setAuthError('Oturum kontrol edilemedi');
        }
        
        if (!mounted) return;
        
        console.log('AuthContext: Initial session loaded:', session?.user?.id);
        
        // Set initial user state
        setUser(session?.user ?? null);
        
        // Non-blocking profile fetch for initial session
        if (session?.user && mounted) {
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id);
            }
          }, 50);
        }
        
        // Mark as initialized (always happens regardless of profile loading)
        if (mounted) {
          setInitialized(true);
          setAuthLoading(false);
          console.log('AuthContext: Initialization completed');
        }
      } catch (error) {
        console.error('AuthContext: Initialization error:', error);
        if (mounted) {
          setAuthError('Sistem başlatılırken hata oluştu');
          setInitialized(true);
          setAuthLoading(false);
        }
      }
    };

    // Start initialization
    initializeAuth();

    // Cleanup function
    return () => {
      console.log('AuthContext: Cleaning up auth...');
      mounted = false;
      
      // Unsubscribe from auth changes
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, [fetchProfile]);

  const value: AuthContextType = {
    // State
    user,
    profile,
    authLoading,
    actionLoading,
    profileLoading,
    initialized,
    authError,
    profileError,
    
    // Actions
    refreshProfile,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    resendConfirmation,
    clearAuthError,
    clearProfileError
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
