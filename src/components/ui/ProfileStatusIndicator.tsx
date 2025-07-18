import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  CheckCircle, 
  RefreshCw, 
  AlertTriangle, 
  Clock, 
  Wifi, 
  WifiOff 
} from 'lucide-react';
import { useNonBlockingProfile } from '@/hooks/useNonBlockingProfile';

interface ProfileStatusIndicatorProps {
  showLabel?: boolean;
  variant?: 'dot' | 'badge' | 'icon';
  className?: string;
}

export const ProfileStatusIndicator: React.FC<ProfileStatusIndicatorProps> = ({
  showLabel = false,
  variant = 'dot',
  className = ''
}) => {
  const {
    hasProfile,
    error,
    isBackgroundRefreshing,
    isProfileStale,
    cacheInfo
  } = useNonBlockingProfile();

  const getStatus = () => {
    if (error) {
      return {
        icon: AlertTriangle,
        color: 'text-destructive',
        bgColor: 'bg-destructive',
        label: 'Profil Hatası',
        description: error.message,
        variant: 'destructive' as const
      };
    }

    if (isBackgroundRefreshing) {
      return {
        icon: RefreshCw,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500',
        label: 'Güncelleniyor',
        description: 'Profil bilgileri güncelleniyor',
        variant: 'default' as const,
        animate: 'animate-spin'
      };
    }

    if (hasProfile && !isProfileStale) {
      return {
        icon: CheckCircle,
        color: 'text-green-500',
        bgColor: 'bg-green-500',
        label: 'Güncel',
        description: 'Profil bilgileri güncel',
        variant: 'default' as const
      };
    }

    if (hasProfile && isProfileStale) {
      return {
        icon: Clock,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500',
        label: 'Eski Veri',
        description: cacheInfo ? `${Math.round(cacheInfo.age / 1000)}s önce yüklendi` : 'Eski profil verisi',
        variant: 'secondary' as const
      };
    }

    return {
      icon: WifiOff,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted-foreground',
      label: 'Yükleniyor',
      description: 'Profil bilgileri yükleniyor',
      variant: 'outline' as const
    };
  };

  const status = getStatus();
  const Icon = status.icon;

  const renderContent = () => {
    switch (variant) {
      case 'dot':
        return (
          <div 
            className={`w-2 h-2 rounded-full ${status.bgColor} ${status.animate || ''} ${className}`}
          />
        );

      case 'icon':
        return (
          <Icon 
            className={`w-3 h-3 ${status.color} ${status.animate || ''} ${className}`}
          />
        );

      case 'badge':
        return (
          <Badge variant={status.variant} className={`text-xs ${className}`}>
            <Icon className={`w-3 h-3 mr-1 ${status.animate || ''}`} />
            {showLabel && status.label}
          </Badge>
        );

      default:
        return null;
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="cursor-help">
          {renderContent()}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-1">
          <p className="font-medium">{status.label}</p>
          <p className="text-xs text-muted-foreground">{status.description}</p>
          {cacheInfo && (
            <div className="text-xs text-muted-foreground space-y-1 pt-1 border-t">
              <p>Ağ: {cacheInfo.networkStatus}</p>
              <p>Yaş: {Math.round(cacheInfo.age / 1000)}s</p>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};