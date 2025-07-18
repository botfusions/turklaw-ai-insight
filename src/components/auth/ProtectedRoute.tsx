
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { RouteProtectionLevel } from '@/types/routes';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  protection?: RouteProtectionLevel;
  fallbackRoute?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  protection = RouteProtectionLevel.AUTHENTICATED,
  fallbackRoute = '/login'
}) => {
  const location = useLocation();

  // Safe auth context access with error boundary
  let authState = {
    user: null,
    initialized: false,
    loading: false,
    error: false
  };

  try {
    const auth = useAuth();
    authState = {
      user: auth.user,
      initialized: auth.initialized,
      loading: auth.loading,
      error: false
    };
    
    console.log('ProtectedRoute: Auth state retrieved:', { 
      hasUser: !!auth.user, 
      initialized: auth.initialized, 
      loading: auth.loading 
    });
  } catch (error) {
    console.error('ProtectedRoute: Auth context error:', error);
    authState.error = true;
  }

  // Show error state if auth context failed
  if (authState.error) {
    console.log('ProtectedRoute: Showing error state due to auth context failure');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Yetkilendirme Hatası</h2>
          <p className="text-muted-foreground mb-4">Kullanıcı oturumu kontrol edilemiyor</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  // Show loading while checking auth state - but only if not initialized yet
  if (!authState.initialized) {
    console.log('ProtectedRoute: Showing loading - auth not initialized yet');
    return <LoadingSpinner message="Yetkilendirme kontrol ediliyor..." />;
  }

  // Don't show loading for normal operation loading states
  if (authState.loading) {
    console.log('ProtectedRoute: Auth is loading but initialized, allowing navigation');
  }

  // Handle different protection levels
  switch (protection) {
    case RouteProtectionLevel.PUBLIC:
      console.log('ProtectedRoute: Public route, allowing access');
      return <>{children}</>;

    case RouteProtectionLevel.GUEST_ONLY:
      if (authState.user && authState.initialized) {
        console.log('ProtectedRoute: Guest-only route but user authenticated, redirecting to dashboard');
        return <Navigate to="/dashboard" replace />;
      }
      console.log('ProtectedRoute: Guest-only route, allowing access');
      return <>{children}</>;

    case RouteProtectionLevel.AUTHENTICATED:
      if (!authState.user) {
        console.log('ProtectedRoute: Authentication required but no user, redirecting to login');
        return <Navigate to={fallbackRoute} state={{ from: location }} replace />;
      }
      console.log('ProtectedRoute: User authenticated, allowing access');
      return <>{children}</>;

    default:
      console.log('ProtectedRoute: Unknown protection level, allowing access');
      return <>{children}</>;
  }
};
