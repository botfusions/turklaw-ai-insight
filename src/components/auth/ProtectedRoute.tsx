
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { RouteProtectionLevel } from '@/types/routes';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RouteErrorDisplay } from '@/components/ui/RouteErrorDisplay';
import { ErrorBoundary } from '@/components/performance/ErrorBoundary';

interface ProtectedRouteProps {
  children: React.ReactNode;
  protection?: RouteProtectionLevel;
  fallbackRoute?: string;
}

const ProtectedRouteContent: React.FC<ProtectedRouteProps> = ({ 
  children,
  protection = RouteProtectionLevel.AUTHENTICATED,
  fallbackRoute = '/login'
}) => {
  const location = useLocation();

  // Safe auth context access with error handling
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
      <RouteErrorDisplay
        title="Yetkilendirme Hatası"
        message="Kullanıcı oturumu kontrol edilemiyor. Lütfen sayfayı yenileyin."
        redirectTo="/login"
        redirectText="Giriş Yap"
      />
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

export const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  return (
    <ErrorBoundary>
      <ProtectedRouteContent {...props} />
    </ErrorBoundary>
  );
};
