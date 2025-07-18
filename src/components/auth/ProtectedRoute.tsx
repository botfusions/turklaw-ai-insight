
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { useSmartRedirect } from '@/hooks/useSmartRedirect';
import { RouteProtectionLevel } from '@/types/routes';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  protection?: RouteProtectionLevel;
  fallbackRoute?: string;
  customLoadingComponent?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  protection = RouteProtectionLevel.AUTHENTICATED,
  fallbackRoute,
  customLoadingComponent
}) => {
  try {
    const { user, initialized, loading } = useAuth();
    const location = useLocation();
    const { saveIntendedRoute } = useSmartRedirect();

    // Show loading while checking auth state
    if (!initialized || loading) {
      return customLoadingComponent || <LoadingSpinner />;
    }

    // Handle different protection levels
    switch (protection) {
      case RouteProtectionLevel.PUBLIC:
        // Allow everyone
        return <>{children}</>;

      case RouteProtectionLevel.GUEST_ONLY:
        if (user && initialized) {
          return <Navigate to="/dashboard" replace />;
        }
        return <>{children}</>;

      case RouteProtectionLevel.AUTHENTICATED:
        if (!user) {
          saveIntendedRoute(location.pathname + location.search);
          return <Navigate to={fallbackRoute || '/login'} replace />;
        }
        return <>{children}</>;

      default:
        return <>{children}</>;
    }
  } catch (error) {
    console.error('ProtectedRoute error:', error);
    // If contexts fail, show loading fallback
    return customLoadingComponent || <LoadingSpinner />;
  }
};
