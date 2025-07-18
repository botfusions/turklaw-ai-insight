
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { RouteProtectionLevel } from '@/types/routes';

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
  const { user, initialized, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-lg font-medium text-foreground">Yükleniyor...</div>
        </div>
      </div>
    );
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
