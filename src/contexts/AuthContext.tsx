
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

  // Simple profile fetch with proper error handling
  const fetchProfile = async (userId: string, isMounted: () => boolean) => {
    try {
      console.log('AuthContext: Starting profile fetch for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      // Always check if component is still mounted before setting state
      if (!isMounted()) {
        console.log('AuthContext: Component unmounted during profile fetch, skipping state update');
        return;
      }

      if (error) {
        console.error('AuthContext: Profile fetch error:', error);
        // Don't throw - just log and continue without profile
        setProfile(null);
        return;
      }
      
      console.log('AuthContext: Profile fetched successfully:', data);
      setProfile(data as Profile);
    } catch (error) {
      console.error('AuthContext: Profile fetch exception:', error);
      if (isMounted()) {
        setProfile(null);
      }
    }
  };

  const refreshProfile = async () => {
    if (user) {
      let mounted = true;
      const isMounted = () => mounted;
      
      await fetchProfile(user.id, isMounted);
      
      // Cleanup
      mounted = false;
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

  // Stabilized auth initialization with proper cleanup
  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;
    let profileCleanup: (() => void) | null = null;

    const isMounted = () => mounted;

    const initAuth = async () => {
      try {
        console.log('AuthContext: Starting stable initialization...');
        
        // Set up auth state listener
        authSubscription = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!isMounted()) {
              console.log('AuthContext: Component unmounted during auth state change, ignoring');
              return;
            }
            
            console.log('AuthContext: Auth state changed:', event, session?.user?.id);
            
            // Update user state immediately
            setUser(session?.user ?? null);
            
            // Handle profile fetch asynchronously and safely
            if (session?.user) {
              // Clean up any previous profile fetch
              if (profileCleanup) {
                profileCleanup();
                profileCleanup = null;
              }
              
              // Start new profile fetch with timeout to prevent blocking
              const timeoutId = setTimeout(() => {
                if (isMounted()) {
                  fetchProfile(session.user.id, isMounted);
                }
              }, 50); // Small delay to prevent race conditions
              
              // Store timeout cleanup
              profileCleanup = () => clearTimeout(timeoutId);
            } else {
              setProfile(null);
              if (profileCleanup) {
                profileCleanup();
                profileCleanup = null;
              }
            }
          }
        );

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthContext: Session fetch error:', error);
        }
        
        if (!isMounted()) {
          console.log('AuthContext: Component unmounted during session fetch');
          return;
        }
        
        console.log('AuthContext: Initial session loaded:', session?.user?.id);
        
        // Set initial user state
        setUser(session?.user ?? null);
        
        // Fetch initial profile if user exists
        if (session?.user) {
          const timeoutId = setTimeout(() => {
            if (isMounted()) {
              fetchProfile(session.user.id, isMounted);
            }
          }, 50);
          
          profileCleanup = () => clearTimeout(timeoutId);
        }
        
        // Mark as initialized
        if (isMounted()) {
          setInitialized(true);
          console.log('AuthContext: Initialization completed successfully');
        }
      } catch (error) {
        console.error('AuthContext: Initialization error:', error);
        if (isMounted()) {
          setInitialized(true); // Always mark as initialized to prevent infinite loading
        }
      }
    };

    // Start initialization
    initAuth();

    // Cleanup function
    return () => {
      console.log('AuthContext: Cleaning up...');
      mounted = false;
      
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
      
      if (profileCleanup) {
        profileCleanup();
      }
    };
  }, []); // Empty dependency array - run only once

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
