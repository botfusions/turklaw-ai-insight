
import React from 'react';
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useAuth } from '../useAuth';
import { AuthDataProvider } from '@/contexts/AuthDataContext';
import { AuthActionsProvider } from '@/contexts/AuthActionsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Test wrapper
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthDataProvider>
          <AuthActionsProvider>
            {children}
          </AuthActionsProvider>
        </AuthDataProvider>
      </QueryClientProvider>
    );
  };
}

describe('useAuth', () => {
  it('should return initial auth state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
    expect(result.current.authLoading).toBe(true);
    expect(result.current.initialized).toBe(false);
  });

  it('should provide auth actions', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.signUp).toBe('function');
    expect(typeof result.current.signIn).toBe('function');
    expect(typeof result.current.signOut).toBe('function');
    expect(typeof result.current.resetPassword).toBe('function');
    expect(typeof result.current.updateProfile).toBe('function');
  });

});
