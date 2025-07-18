import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Crown, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNonBlockingProfile } from '@/hooks/useNonBlockingProfile';
import { useAuth } from '@/hooks/useAuth';

interface ProfileProgressiveLoaderProps {
  showRefreshButton?: boolean;
  compact?: boolean;
  className?: string;
}

export const ProfileProgressiveLoader: React.FC<ProfileProgressiveLoaderProps> = ({
  showRefreshButton = false,
  compact = false,
  className = ''
}) => {
  const { user } = useAuth();
  const {
    profile,
    error,
    isBackgroundRefreshing,
    refreshProfile,
    canRetry,
    hasProfile,
    isProfileStale
  } = useNonBlockingProfile();

  if (!user) return null;

  // Basic user info from auth (always available)
  const displayName = user.email?.split('@')[0] || 'Kullanıcı';
  const userInitials = displayName.substring(0, 2).toUpperCase();

  // Progressive enhancement based on profile data availability
  const currentPlan = profile?.plan || 'free';
  const fullName = profile?.full_name || displayName;

  const planNames = {
    free: 'Ücretsiz',
    basic: 'Temel', 
    premium: 'Premium',
    enterprise: 'Kurumsal'
  };

  const planColors = {
    free: 'bg-slate-100 text-slate-700',
    basic: 'bg-blue-100 text-blue-700',
    premium: 'bg-purple-100 text-purple-700',
    enterprise: 'bg-gold-100 text-gold-700'
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          {hasProfile ? (
            <span className="text-sm font-medium truncate">{fullName}</span>
          ) : (
            <Skeleton className="h-4 w-20" />
          )}
        </div>

        {isBackgroundRefreshing && (
          <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Profile Info */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          {hasProfile ? (
            <>
              <p className="font-medium text-sm truncate">
                {fullName}
              </p>
              <div className="flex items-center gap-1">
                <Crown className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">
                  {planNames[currentPlan as keyof typeof planNames]}
                </span>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </>
          )}
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-1">
          {isBackgroundRefreshing && (
            <RefreshCw className="h-3 w-3 animate-spin text-primary" />
          )}
          
          {isProfileStale && !isBackgroundRefreshing && (
            <WifiOff className="h-3 w-3 text-muted-foreground" />
          )}
          
          {hasProfile && !isProfileStale && (
            <Wifi className="h-3 w-3 text-green-500" />
          )}
        </div>
      </div>

      {/* Plan Badge - Enhanced when profile loaded */}
      {hasProfile && (
        <Badge 
          variant="secondary" 
          className={`${planColors[currentPlan as keyof typeof planColors]} text-xs`}
        >
          <Crown className="h-3 w-3 mr-1" />
          {planNames[currentPlan as keyof typeof planNames]}
        </Badge>
      )}

      {/* Error State with Recovery */}
      {error && (
        <div className="text-xs text-destructive space-y-1">
          <p>{error.message}</p>
          {canRetry && showRefreshButton && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => refreshProfile()}
              className="h-6 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Tekrar Dene
            </Button>
          )}
        </div>
      )}

      {/* Background Loading Indicator */}
      {isBackgroundRefreshing && (
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <RefreshCw className="h-3 w-3 animate-spin" />
          Güncelleniyor...
        </div>
      )}
    </div>
  );
};