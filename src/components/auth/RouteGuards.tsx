import { useAuth } from '@/hooks/useAuth';
import { RouteGuardResult, PlanType } from '@/types/routes';

export const useRouteGuards = () => {
  const { user, profile, initialized } = useAuth();

  const emailVerificationGuard = (): RouteGuardResult => {
    if (!user) {
      return { allowed: false, redirectTo: '/login', reason: 'not_authenticated' };
    }

    if (!user.email_confirmed_at) {
      return { 
        allowed: false, 
        redirectTo: '/verify-email', 
        reason: 'email_not_verified' 
      };
    }

    return { allowed: true };
  };

  const subscriptionGuard = (requiredPlan: PlanType): RouteGuardResult => {
    if (!profile) {
      return { allowed: false, redirectTo: '/login', reason: 'no_profile' };
    }

    const planHierarchy: Record<PlanType, number> = {
      free: 0,
      pro: 1,
      enterprise: 2
    };

    const userPlanLevel = planHierarchy[profile.plan as PlanType] || 0;
    const requiredLevel = planHierarchy[requiredPlan];

    if (userPlanLevel < requiredLevel) {
      return { 
        allowed: false, 
        redirectTo: '/subscription', 
        reason: 'insufficient_plan' 
      };
    }

    return { allowed: true };
  };

  const searchLimitGuard = (): RouteGuardResult => {
    if (!profile) {
      return { allowed: false, redirectTo: '/login', reason: 'no_profile' };
    }

    if (profile.monthly_search_count >= profile.max_searches) {
      return { 
        allowed: false, 
        redirectTo: '/subscription', 
        reason: 'search_limit_exceeded' 
      };
    }

    return { allowed: true };
  };

  const adminGuard = (): RouteGuardResult => {
    if (!user || !profile) {
      return { allowed: false, redirectTo: '/login', reason: 'not_authenticated' };
    }

    // For now, admin is determined by plan type
    // In a real app, you'd have a separate admin role system
    if (profile.plan !== 'enterprise') {
      return { 
        allowed: false, 
        redirectTo: '/dashboard', 
        reason: 'insufficient_permissions' 
      };
    }

    return { allowed: true };
  };

  const guestOnlyGuard = (): RouteGuardResult => {
    if (user && initialized) {
      return { 
        allowed: false, 
        redirectTo: '/dashboard', 
        reason: 'already_authenticated' 
      };
    }

    return { allowed: true };
  };

  const maintenanceGuard = (): RouteGuardResult => {
    // Check for maintenance mode (could be from config or feature flag)
    const isMaintenanceMode = false; // This would come from your config
    
    if (isMaintenanceMode) {
      return { 
        allowed: false, 
        redirectTo: '/maintenance', 
        reason: 'maintenance_mode' 
      };
    }

    return { allowed: true };
  };

  return {
    emailVerificationGuard,
    subscriptionGuard,
    searchLimitGuard,
    adminGuard,
    guestOnlyGuard,
    maintenanceGuard
  };
};