import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  plan: 'basic' | 'premium';
  search_count: number;
  max_searches: number;
  monthly_search_count: number;
  last_search_reset: string | null;
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
  canSearch: () => boolean;
  incrementSearchCount: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<AuthResult>;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export interface AuthContextType extends AuthState, AuthActions {}