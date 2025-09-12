/**
 * TurkLawAI Standalone Auth Client
 * Replacement for Supabase client with JWT authentication
 */

interface User {
  id: string;
  email: string;
  full_name: string;
  plan: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
  error?: string;
}

class TurkLawAIAuth {
  private baseUrl: string;
  private token: string | null = null;
  
  constructor() {
    this.baseUrl = window.location.origin;
    this.token = localStorage.getItem('turklawai_token');
  }

  private async apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}/.netlify/functions/auth/${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log(`🔧 Auth API Request: ${url}`, config);

    const response = await fetch(url, config);
    const data = await response.json();

    console.log(`🔧 Auth API Response:`, { status: response.status, data });

    if (!response.ok && !data.success) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  // Authentication methods
  async signUp(email: string, password: string, fullName?: string): Promise<AuthResponse> {
    try {
      const response = await this.apiRequest('register', {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name: fullName || '' }),
      });

      if (response.success && response.token) {
        this.token = response.token;
        localStorage.setItem('turklawai_token', this.token);
        this.notifyAuthChange();
      }

      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async signInWithPassword(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.apiRequest('login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success && response.token) {
        this.token = response.token;
        localStorage.setItem('turklawai_token', this.token);
        this.notifyAuthChange();
      }

      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async signOut(): Promise<void> {
    this.token = null;
    localStorage.removeItem('turklawai_token');
    this.notifyAuthChange();
  }

  async getUser(): Promise<User | null> {
    if (!this.token) return null;

    try {
      const response = await this.apiRequest('verify', {
        method: 'POST',
      });

      return response.success ? response.user : null;
    } catch (error) {
      console.error('🚨 Failed to verify token:', error);
      this.signOut(); // Clear invalid token
      return null;
    }
  }

  // Session management
  getSession(): { user: User | null } {
    // This is synchronous for compatibility, actual user data fetched separately
    return { user: null };
  }

  onAuthStateChange(callback: (event: string, session: any) => void): { data: { subscription: { unsubscribe: () => void } } } {
    // Store callback for auth state changes
    const key = `auth_callback_${Date.now()}`;
    (window as any)[key] = callback;

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            delete (window as any)[key];
          }
        }
      }
    };
  }

  private notifyAuthChange() {
    // Notify all registered callbacks
    Object.keys(window).forEach(key => {
      if (key.startsWith('auth_callback_')) {
        const callback = (window as any)[key];
        if (typeof callback === 'function') {
          callback(this.token ? 'SIGNED_IN' : 'SIGNED_OUT', { user: null });
        }
      }
    });
  }

  // Password reset (placeholder - implement if needed)
  async resetPasswordForEmail(email: string): Promise<{ error?: any }> {
    console.log('🔧 Password reset not implemented for standalone auth');
    return { error: { message: 'Password reset not implemented' } };
  }

  // Confirmation resend (placeholder - implement if needed)
  async resend(options: any): Promise<{ error?: any }> {
    console.log('🔧 Email confirmation not implemented for standalone auth');
    return { error: null };
  }

  // Health check
  async health(): Promise<any> {
    try {
      return await this.apiRequest('health', { method: 'GET' });
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }
}

// Create singleton instance
export const standaloneAuth = new TurkLawAIAuth();

// Export compatible interface for Supabase replacement
export const supabase = {
  auth: {
    signUp: (options: { email: string; password: string; options?: { data?: { full_name?: string } } }) =>
      standaloneAuth.signUp(options.email, options.password, options.options?.data?.full_name),
    
    signInWithPassword: (credentials: { email: string; password: string }) =>
      standaloneAuth.signInWithPassword(credentials.email, credentials.password),
    
    signOut: () => standaloneAuth.signOut(),
    
    getUser: () => standaloneAuth.getUser(),
    
    getSession: () => standaloneAuth.getSession(),
    
    onAuthStateChange: (callback: (event: string, session: any) => void) =>
      standaloneAuth.onAuthStateChange(callback),
    
    resetPasswordForEmail: (email: string, options?: any) =>
      standaloneAuth.resetPasswordForEmail(email),
    
    resend: (options: any) =>
      standaloneAuth.resend(options),
  },
  
  // Placeholder for other Supabase methods
  from: (table: string) => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
  }),
};

export default supabase;