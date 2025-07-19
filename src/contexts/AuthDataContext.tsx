import React from 'react';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

interface AuthDataContextType {
  user: User | null;
  profile: Profile | null;
  initialized: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthDataContext = createContext<AuthDataContextType | undefined>(undefined);

interface AuthDataProviderProps {
  children: ReactNode;
}

export const AuthDataProvider: React.FC<AuthDataProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [initialized, setInitialized] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('AuthDataContext: Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('AuthDataContext: Error fetching profile:', error);
        throw error;
      }
      
      console.log('AuthDataContext: Profile fetched successfully:', data);
      setProfile(data as Profile);
    } catch (error) {
      console.error('AuthDataContext: Error fetching profile:', error);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthDataContext: Auth state changed:', event, !!session?.user);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setInitialized(true);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('AuthDataContext: Initial session check:', !!session?.user);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthDataContextType = {
    user,
    profile,
    initialized,
    refreshProfile
  };

  return <AuthDataContext.Provider value={value}>{children}</AuthDataContext.Provider>;
};

export const useAuthData = (): AuthDataContextType => {
  const context = useContext(AuthDataContext);
  if (context === undefined) {
    throw new Error('useAuthData must be used within an AuthDataProvider');
  }
  return context;
};