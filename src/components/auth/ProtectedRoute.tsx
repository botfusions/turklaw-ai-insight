
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

  // Safe auth context access
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
  } catch (error) {
    console.error('ProtectedRoute: Auth context error:', error);
    authState.error = true;
  }

  // Show error state if auth context failed
  if (authState.error) {
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

  // Show loading while checking auth state
  if (!authState.initialized || authState.loading) {
    return <LoadingSpinner message="Yetkilendirme kontrol ediliyor..." />;
  }

  // Handle different protection levels
  switch (protection) {
    case RouteProtectionLevel.PUBLIC:
      return <>{children}</>;

    case RouteProtectionLevel.GUEST_ONLY:
      if (authState.user && authState.initialized) {
        return <Navigate to="/dashboard" replace />;
      }
      return <>{children}</>;

    case RouteProtectionLevel.AUTHENTICATED:
      if (!authState.user) {
        return <Navigate to={fallbackRoute} state={{ from: location }} replace />;
      }
      return <>{children}</>;

    default:
      return <>{children}</>;
  }
};
