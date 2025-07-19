
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
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

  const { user, initialized, loading } = useSimpleAuth();
  
  console.log('🛡️ ProtectedRoute: Auth state for', location.pathname, ':', { 
    hasUser: !!user, 
    initialized, 
    loading,
    protection
  });

  // Show loading only during auth initialization
  if (!initialized) {
    console.log('ProtectedRoute: Showing auth loading state');
    return <LoadingSpinner message="Yetkilendirme kontrol ediliyor..." />;
  }

  // Handle different protection levels
  switch (protection) {
    case RouteProtectionLevel.PUBLIC:
      console.log('ProtectedRoute: Public route, allowing access');
      return <>{children}</>;

    case RouteProtectionLevel.GUEST_ONLY:
      if (user && initialized) {
        console.log('ProtectedRoute: Guest-only route but user authenticated, redirecting to dashboard');
        return <Navigate to="/dashboard" replace />;
      }
      console.log('ProtectedRoute: Guest-only route, allowing access');
      return <>{children}</>;

    case RouteProtectionLevel.AUTHENTICATED:
      if (!user) {
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
