import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNonBlockingProfile } from '@/hooks/useNonBlockingProfile';
import { 
  RefreshCw, 
  Database, 
  Clock, 
  Wifi, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react';

const ProfileDebugPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    profile,
    error,
    isBackgroundRefreshing,
    refreshProfile,
    forceRefresh,
    cacheInfo,
    hasProfile,
    isProfileStale,
    canRetry,
    debugInfo
  } = useNonBlockingProfile();

  if (process.env.NODE_ENV === 'production') return null;

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return 'Hiç';
    return new Date(timestamp).toLocaleTimeString('tr-TR');
  };

  const getStatusColor = () => {
    if (error) return 'destructive';
    if (isBackgroundRefreshing) return 'default';
    if (hasProfile && !isProfileStale) return 'default';
    return 'secondary';
  };

  const getStatusText = () => {
    if (error) return `Hata: ${error.message}`;
    if (isBackgroundRefreshing) return 'Güncelleniyor...';
    if (hasProfile && !isProfileStale) return 'Güncel';
    if (hasProfile && isProfileStale) return 'Eski veri';
    return 'Yükleniyor...';
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="h-4 w-4" />
            Profile Debug
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor()} className="text-xs">
            {getStatusText()}
          </Badge>
          {isBackgroundRefreshing && (
            <RefreshCw className="h-3 w-3 animate-spin" />
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-3 text-xs">
          {/* Profile Status */}
          <div className="space-y-1">
            <h4 className="font-medium flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Profil Durumu
            </h4>
            <div className="pl-4 space-y-1 text-muted-foreground">
              <p>Plan: {profile?.plan || 'Bilinmiyor'}</p>
              <p>İsim: {profile?.full_name || 'Yok'}</p>
              <p>Güncel: {hasProfile && !isProfileStale ? 'Evet' : 'Hayır'}</p>
            </div>
          </div>

          {/* Cache Info */}
          {cacheInfo && (
            <div className="space-y-1">
              <h4 className="font-medium flex items-center gap-1">
                <Database className="h-3 w-3" />
                Cache Bilgisi
              </h4>
              <div className="pl-4 space-y-1 text-muted-foreground">
                <p>Yaş: {Math.round(cacheInfo.age / 1000)}s</p>
                <p>Max Yaş: {Math.round(cacheInfo.maxAge / 1000)}s</p>
                <p>Ağ: {cacheInfo.networkStatus}</p>
                <p>Yenilenmeli: {cacheInfo.shouldRefresh ? 'Evet' : 'Hayır'}</p>
              </div>
            </div>
          )}

          {/* Timing Info */}
          <div className="space-y-1">
            <h4 className="font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Zamanlama
            </h4>
            <div className="pl-4 space-y-1 text-muted-foreground">
              <p>Son İstek: {formatTime(debugInfo.lastFetchAttempt)}</p>
              <p>Deneme Sayısı: {debugInfo.retryCount}</p>
              <p>Cache: {cacheInfo ? formatTime(cacheInfo.cachedAt) : 'Yok'}</p>
            </div>
          </div>

          {/* Error Info */}
          {error && (
            <div className="space-y-1">
              <h4 className="font-medium flex items-center gap-1 text-destructive">
                <AlertTriangle className="h-3 w-3" />
                Hata Detayı
              </h4>
              <div className="pl-4 space-y-1 text-muted-foreground">
                <p>Tür: {error.type}</p>
                <p>Mesaj: {error.message}</p>
                <p>Deneme: {error.retryable ? 'Evet' : 'Hayır'}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => refreshProfile()}
              disabled={isBackgroundRefreshing}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Yenile
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => forceRefresh()}
              disabled={isBackgroundRefreshing}
              className="text-xs"
            >
              <Database className="h-3 w-3 mr-1" />
              Zorla
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ProfileDebugPanel;