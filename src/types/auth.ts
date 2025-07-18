import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  plan: 'free' | 'basic' | 'premium';
  created_at: string | null;
  updated_at: string | null;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
}

export interface AuthActions {
  signUp: (email: string, password: string, fullName?: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updateProfile: (updates: Partial<Profile>) => Promise<AuthResult>;
  resendConfirmation: (email: string) => Promise<AuthResult>;
  refreshProfile: () => Promise<void>;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export interface AuthContextType extends AuthState, AuthActions {}