
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { RouteProtectionLevel } from '@/types/routes';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RouteErrorDisplay } from '@/components/ui/RouteErrorDisplay';

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

  // Use try-catch to handle auth context errors gracefully
  let user = null;
  let initialized = false;
  let loading = false;
  let authError = false;

  try {
    const authData = useAuth();
    user = authData.user;
    initialized = authData.initialized;
    loading = authData.loading;
  } catch (error) {
    console.error('ProtectedRoute: Auth context error:', error);
    authError = true;
  }

  // Show error state if auth context failed
  if (authError) {
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
  if (!initialized || loading) {
    return <LoadingSpinner message="Yetkilendirme kontrol ediliyor..." />;
  }

  // Handle different protection levels
  switch (protection) {
    case RouteProtectionLevel.PUBLIC:
      return <>{children}</>;

    case RouteProtectionLevel.GUEST_ONLY:
      if (user && initialized) {
        return <Navigate to="/dashboard" replace />;
      }
      return <>{children}</>;

    case RouteProtectionLevel.AUTHENTICATED:
      if (!user) {
        return <Navigate to={fallbackRoute} state={{ from: location }} replace />;
      }
      return <>{children}</>;

    default:
      return <>{children}</>;
  }
};
