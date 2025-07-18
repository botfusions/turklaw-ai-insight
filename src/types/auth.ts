
import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  plan: 'free' | 'basic' | 'premium';
  created_at: string | null;
  updated_at: string | null;
}

export interface OptimizedAuthState {
  user: User | null;
  profile: Profile | null;
  
  // Granular loading states
  authLoading: boolean;      // Auth listener & session check
  actionLoading: boolean;    // User actions (login, signup, etc)
  profileLoading: boolean;   // Profile fetch operations
  initialized: boolean;      // Auth system ready
  
  // Error states
  authError: string | null;     // Auth-related errors
  profileError: string | null;  // Profile-related errors
}

export interface AuthActions {
  signUp: (email: string, password: string, fullName?: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updateProfile: (updates: Partial<Profile>) => Promise<AuthResult>;
  resendConfirmation: (email: string) => Promise<AuthResult>;
  refreshProfile: () => Promise<void>;
  clearAuthError: () => void;
  clearProfileError: () => void;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export interface AuthContextType extends OptimizedAuthState, AuthActions {}

// Legacy interface for backward compatibility
export interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
}
