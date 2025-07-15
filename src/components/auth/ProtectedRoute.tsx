import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRouteGuards } from './RouteGuards';
import { useSmartRedirect } from '@/hooks/useSmartRedirect';
import { RouteProtectionLevel, PlanType } from '@/types/routes';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RouteErrorDisplay } from '@/components/ui/RouteErrorDisplay';

interface ProtectedRouteProps {
  children: React.ReactNode;
  protection?: RouteProtectionLevel;
  requiredPlan?: PlanType;
  requiresEmailVerification?: boolean;
  requiresSearchLimit?: boolean;
  fallbackRoute?: string;
  customLoadingComponent?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  protection = RouteProtectionLevel.AUTHENTICATED,
  requiredPlan,
  requiresEmailVerification = false,
  requiresSearchLimit = false,
  fallbackRoute,
  customLoadingComponent
}) => {
  const { user, profile, initialized, loading } = useAuth();
  const location = useLocation();
  const { saveIntendedRoute } = useSmartRedirect();
  const {
    emailVerificationGuard,
    subscriptionGuard,
    searchLimitGuard,
    adminGuard,
    guestOnlyGuard,
    maintenanceGuard
  } = useRouteGuards();

  // Show loading while checking auth state
  if (!initialized || loading) {
    return customLoadingComponent || <LoadingSpinner />;
  }

  // Check maintenance mode first
  const maintenanceResult = maintenanceGuard();
  if (!maintenanceResult.allowed) {
    return <Navigate to={maintenanceResult.redirectTo || '/maintenance'} replace />;
  }

  // Handle different protection levels
  switch (protection) {
    case RouteProtectionLevel.PUBLIC:
      // Allow everyone
      return <>{children}</>;

    case RouteProtectionLevel.GUEST_ONLY:
      const guestResult = guestOnlyGuard();
      if (!guestResult.allowed) {
        return <Navigate to={guestResult.redirectTo || '/dashboard'} replace />;
      }
      return <>{children}</>;

    case RouteProtectionLevel.AUTHENTICATED:
      if (!user) {
        saveIntendedRoute(location.pathname + location.search);
        return <Navigate to={fallbackRoute || '/login'} replace />;
      }

      // Check email verification if required
      if (requiresEmailVerification) {
        const emailResult = emailVerificationGuard();
        if (!emailResult.allowed) {
          return <RouteErrorDisplay 
            title="E-posta Doğrulaması Gerekli"
            message="Bu sayfaya erişmek için e-posta adresinizi doğrulamanız gerekiyor."
            redirectTo={emailResult.redirectTo}
            redirectText="E-posta Doğrulama"
          />;
        }
      }

      // Check search limit if required
      if (requiresSearchLimit) {
        const searchResult = searchLimitGuard();
        if (!searchResult.allowed) {
          return <RouteErrorDisplay 
            title="Arama Limitine Ulaştınız"
            message="Bu ay için arama limitinize ulaştınız. Premium plana geçerek daha fazla arama yapabilirsiniz."
            redirectTo={searchResult.redirectTo}
            redirectText="Premium'a Geç"
          />;
        }
      }

      return <>{children}</>;

    case RouteProtectionLevel.PLAN_RESTRICTED:
      if (!user) {
        saveIntendedRoute(location.pathname + location.search);
        return <Navigate to={fallbackRoute || '/login'} replace />;
      }

      if (requiredPlan) {
        const planResult = subscriptionGuard(requiredPlan);
        if (!planResult.allowed) {
          return <RouteErrorDisplay 
            title="Premium Özellik"
            message={`Bu özellik ${requiredPlan} planında kullanılabilir. Planınızı yükseltin.`}
            redirectTo={planResult.redirectTo}
            redirectText="Plan Yükselt"
          />;
        }
      }

      return <>{children}</>;

    case RouteProtectionLevel.ADMIN_ONLY:
      if (!user) {
        saveIntendedRoute(location.pathname + location.search);
        return <Navigate to={fallbackRoute || '/login'} replace />;
      }

      const adminResult = adminGuard();
      if (!adminResult.allowed) {
        return <RouteErrorDisplay 
          title="Yetkisiz Erişim"
          message="Bu sayfaya erişim yetkiniz bulunmamaktadır."
          redirectTo={adminResult.redirectTo}
          redirectText="Ana Sayfa"
        />;
      }

      return <>{children}</>;

    default:
      return <>{children}</>;
  }
};