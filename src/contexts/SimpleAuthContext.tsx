import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  initialized: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const SimpleAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 SimpleAuthContext: Setting up auth listeners');
    
    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 SimpleAuthContext: Auth state changed:', event, !!session?.user);
        setUser(session?.user ?? null);
        setInitialized(true);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 SimpleAuthContext: Initial session:', !!session?.user);
      setUser(session?.user ?? null);
      setInitialized(true);
    }).catch(error => {
      console.error('❌ SimpleAuthContext: Error getting initial session:', error);
      setInitialized(true);
    });

    return () => {
      console.log('🧹 SimpleAuthContext: Cleaning up auth listeners');
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    initialized,
    loading,
    signOut
  };

  console.log('🔧 SimpleAuthContext: Rendering with state:', {
    hasUser: !!user,
    initialized,
    loading
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useSimpleAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
};