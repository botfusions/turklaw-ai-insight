import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useRef
} from 'react';
import {
  Session,
  User,
  AuthChangeEvent,
} from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import {
  OptimizedAuthState,
  AuthActions,
  AuthContextType,
  Profile,
  AuthResult
} from '@/types/auth';
import { ErrorBoundary } from '@/components/performance/ErrorBoundary';
import { errorTracker } from '@/services/errorTracking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  const mounted = useRef<boolean>(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  // Utility function to safely update state
  const safeSetState = useCallback(<T extends any>(setState: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    if (mounted.current) {
      setState(value);
    }
  }, []);

  // Enhanced error handling with types
  const handleAuthError = useCallback((error: unknown, action: string): string => {
    let errorMessage: string;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as { message: string }).message;
    } else {
      errorMessage = 'Bilinmeyen bir hata oluştu';
    }

    // Enhanced error tracking with proper typing
    errorTracker.logError(new Error(errorMessage), {
      component: 'AuthContext',
      action,
      metadata: {
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    });

    console.error(`Auth error in ${action}:`, error);
    return errorMessage;
  }, []);

  const clearAuthError = useCallback(() => {
    safeSetState(setAuthError, null);
  }, [safeSetState]);

  const clearProfileError = useCallback(() => {
    safeSetState(setProfileError, null);
  }, [safeSetState]);

  const signUp = useCallback(
    async (email: string, password: string, fullName?: string): Promise<AuthResult> => {
      setActionLoading(true);
      clearAuthError();
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          const errorMessage = handleAuthError(error, 'signUp');
          safeSetState(setAuthError, errorMessage);
          return { success: false, error: errorMessage };
        }

        console.log('Sign up successful', data);
        return { success: true, user: data.user };
      } catch (err) {
        const errorMessage = handleAuthError(err, 'signUp');
        safeSetState(setAuthError, errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setActionLoading(false);
      }
    },
    [handleAuthError, safeSetState]
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setActionLoading(true);
      clearAuthError();
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          const errorMessage = handleAuthError(error, 'signIn');
          safeSetState(setAuthError, errorMessage);
          return { success: false, error: errorMessage };
        }

        console.log('Sign in successful', data);
        return { success: true, user: data.user };
      } catch (err) {
        const errorMessage = handleAuthError(err, 'signIn');
        safeSetState(setAuthError, errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setActionLoading(false);
      }
    },
    [handleAuthError, safeSetState]
  );

  const signOut = useCallback(async (): Promise<void> => {
    setActionLoading(true);
    clearAuthError();
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        const errorMessage = handleAuthError(error, 'signOut');
        safeSetState(setAuthError, errorMessage);
      } else {
        console.log('Sign out successful');
      }
    } catch (err) {
      const errorMessage = handleAuthError(err, 'signOut');
      safeSetState(setAuthError, errorMessage);
    } finally {
      safeSetState(setUser, null);
      safeSetState(setProfile, null);
      setActionLoading(false);
    }
  }, [handleAuthError, safeSetState]);

  const resetPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      setActionLoading(true);
      clearAuthError();
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });

        if (error) {
          const errorMessage = handleAuthError(error, 'resetPassword');
          safeSetState(setAuthError, errorMessage);
          return { success: false, error: errorMessage };
        }

        console.log('Password reset email sent', data);
        return { success: true };
      } catch (err) {
        const errorMessage = handleAuthError(err, 'resetPassword');
        safeSetState(setAuthError, errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setActionLoading(false);
      }
    },
    [handleAuthError, safeSetState]
  );

  const updateProfile = useCallback(
    async (updates: Partial<Profile>): Promise<AuthResult> => {
      setActionLoading(true);
      clearProfileError();
      try {
        if (!user?.id) {
          throw new Error('User ID is missing');
        }

        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();

        if (error) {
          const errorMessage = handleAuthError(error, 'updateProfile');
          safeSetState(setProfileError, errorMessage);
          return { success: false, error: errorMessage };
        }

        console.log('Profile updated successfully', data);
        safeSetState(setProfile, data);
        return { success: true, user };
      } catch (err) {
        const errorMessage = handleAuthError(err, 'updateProfile');
        safeSetState(setProfileError, errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setActionLoading(false);
      }
    },
    [user?.id, handleAuthError, safeSetState]
  );

  const resendConfirmation = useCallback(
    async (email: string): Promise<AuthResult> => {
      setActionLoading(true);
      clearAuthError();
      try {
        const { data, error } = await supabase.auth.resend({
          type: 'signup',
          email,
        });

        if (error) {
          const errorMessage = handleAuthError(error, 'resendConfirmation');
          safeSetState(setAuthError, errorMessage);
          return { success: false, error: errorMessage };
        }

        console.log('Confirmation email resent', data);
        return { success: true };
      } catch (err) {
        const errorMessage = handleAuthError(err, 'resendConfirmation');
        safeSetState(setAuthError, errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setActionLoading(false);
      }
    },
    [handleAuthError, safeSetState]
  );

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;

    safeSetState(setProfileLoading, true);
    clearProfileError();

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        const errorMessage = handleAuthError(error, 'refreshProfile');
        safeSetState(setProfileError, errorMessage);
      } else {
        safeSetState(setProfile, data);
      }
    } catch (err) {
      const errorMessage = handleAuthError(err, 'refreshProfile');
      safeSetState(setProfileError, errorMessage);
    } finally {
      safeSetState(setProfileLoading, false);
    }
  }, [user?.id, handleAuthError, safeSetState]);

  useEffect(() => {
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        safeSetState(setAuthLoading, true);
        
        if (session?.user) {
          safeSetState(setUser, session.user);
          try {
            await refreshProfile();
          } catch (profileErr) {
            const errorMessage = handleAuthError(profileErr, 'onAuthStateChange - refreshProfile');
            safeSetState(setProfileError, errorMessage);
          }
        } else {
          safeSetState(setUser, null);
          safeSetState(setProfile, null);
        }
        safeSetState(setAuthLoading, false);
        safeSetState(setInitialized, true);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [refreshProfile, handleAuthError, safeSetState]);

  const value: AuthContextType = useMemo(() => ({
    user,
    profile,
    authLoading,
    actionLoading,
    profileLoading,
    initialized,
    authError,
    profileError,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    resendConfirmation,
    refreshProfile,
    clearAuthError,
    clearProfileError
  }), [
    user,
    profile,
    authLoading,
    actionLoading,
    profileLoading,
    initialized,
    authError,
    profileError,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    resendConfirmation,
    refreshProfile,
    clearAuthError,
    clearProfileError
  ]);

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-center">Kimlik Doğrulama Hatası</CardTitle>
              <CardDescription className="text-center">
                Kimlik doğrulama sistemi başlatılamadı. Lütfen sayfayı yenileyin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Sayfayı Yenile
              </Button>
            </CardContent>
          </Card>
        </div>
      }
    >
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </ErrorBoundary>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
