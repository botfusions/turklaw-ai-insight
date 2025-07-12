import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, Profile, AuthResult } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Turkish error messages
const getErrorMessage = (error: any): string => {
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'E-posta veya şifre hatalı',
    'User already registered': 'Bu e-posta adresi zaten kayıtlı',
    'Email not confirmed': 'E-posta adresinizi doğrulamanız gerekiyor',
    'Password should be at least 6 characters': 'Şifre en az 6 karakter olmalıdır',
    'Email rate limit exceeded': 'Çok fazla e-posta gönderildi. Lütfen bekleyin',
    'Signup requires email verification': 'Kayıt için e-posta doğrulaması gerekiyor',
    'Invalid email format': 'Geçersiz e-posta formatı',
    'Weak password': 'Şifre çok zayıf',
    'User not found': 'Kullanıcı bulunamadı',
    'Email already exists': 'Bu e-posta adresi zaten kullanılıyor'
  };
  
  const message = error?.message || error;
  return errorMessages[message] || 'Bir hata oluştu. Lütfen tekrar deneyin.';
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to avoid potential deadlock
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

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
      setUser(null);
      setProfile(null);
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

      // Refresh profile data
      await fetchProfile(user.id);
      
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

  const canSearch = (): boolean => {
    if (!profile) return false;
    return profile.monthly_search_count < profile.max_searches;
  };

  const incrementSearchCount = async (): Promise<void> => {
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

      // Update local profile state
      setProfile(prev => prev ? {
        ...prev,
        search_count: prev.search_count + 1,
        monthly_search_count: prev.monthly_search_count + 1
      } : null);
    } catch (error) {
      console.error('Error incrementing search count:', error);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    initialized,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    canSearch,
    incrementSearchCount,
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