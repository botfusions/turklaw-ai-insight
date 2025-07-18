
import React, { useEffect, useState, useCallback } from 'react';
import { useSmartLoading } from '@/contexts/SmartLoadingContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';

interface SmartLoaderProps {
  type: 'auth' | 'search' | 'data' | 'action' | 'profile' | 'navigation';
  timeout?: number;
  fallback?: 'cached' | 'offline' | 'error';
  skeleton?: React.ReactNode;
  progressBar?: boolean;
  showNetworkStatus?: boolean;
  onTimeout?: () => void;
  onRetry?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const SmartLoader: React.FC<SmartLoaderProps> = ({
  type,
  timeout = 10000,
  fallback = 'cached',
  skeleton,
  progressBar = false,
  showNetworkStatus = true,
  onTimeout,
  onRetry,
  children,
  className = ''
}) => {
  const { state, setLoading, updateProgress, incrementRetry, resetRetry } = useSmartLoading();
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [startTime] = useState(Date.now());

  const isLoading = state[type];
  const { networkStatus, retryCount, progress, estimatedTime, currentOperation } = state;

  // Timeout handling
  useEffect(() => {
    if (!isLoading) {
      setIsTimedOut(false);
      return;
    }

    const timer = setTimeout(() => {
      if (isLoading) {
        setIsTimedOut(true);
        onTimeout?.();
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [isLoading, timeout, onTimeout]);

  // Progress simulation for better UX
  useEffect(() => {
    if (!isLoading || !progressBar) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const estimatedProgress = Math.min(90, (elapsed / timeout) * 100);
      updateProgress(estimatedProgress, timeout - elapsed);
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading, progressBar, startTime, timeout, updateProgress]);

  const handleRetry = useCallback(() => {
    incrementRetry();
    setIsTimedOut(false);
    onRetry?.();
  }, [incrementRetry, onRetry]);

  const getLoadingMessage = () => {
    if (currentOperation) return currentOperation;
    
    switch (type) {
      case 'auth': return 'Kimlik doğrulanıyor...';
      case 'search': return 'Arama yapılıyor...';
      case 'data': return 'Veriler yükleniyor...';
      case 'action': return 'İşlem gerçekleştiriliyor...';
      case 'profile': return 'Profil bilgileri alınıyor...';
      case 'navigation': return 'Sayfa yükleniyor...';
      default: return 'Yükleniyor...';
    }
  };

  const getNetworkIcon = () => {
    switch (networkStatus) {
      case 'offline': return <WifiOff className="h-4 w-4 text-destructive" />;
      case 'slow': return <Wifi className="h-4 w-4 text-yellow-500" />;
      default: return <Wifi className="h-4 w-4 text-green-500" />;
    }
  };

  const getNetworkMessage = () => {
    switch (networkStatus) {
      case 'offline': return 'İnternet bağlantısı yok';
      case 'slow': return 'Yavaş internet bağlantısı';
      default: return 'İyi bağlantı';
    }
  };

  // Don't show anything if not loading
  if (!isLoading && !isTimedOut) {
    return children ? <>{children}</> : null;
  }

  // Show timeout/error state
  if (isTimedOut) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Alert variant="destructive">
          <Clock className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>İşlem zaman aşımına uğradı</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={retryCount >= 3}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Tekrar Dene ({retryCount}/3)
            </Button>
          </AlertDescription>
        </Alert>
        
        {networkStatus === 'offline' && (
          <Alert>
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              İnternet bağlantınızı kontrol edin ve tekrar deneyin
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // Show loading state
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Skeleton content */}
      {skeleton ? (
        <div className="animate-pulse">
          {skeleton}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground text-center">
            {getLoadingMessage()}
          </p>
        </div>
      )}

      {/* Progress bar */}
      {progressBar && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          {estimatedTime && estimatedTime > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Yaklaşık {Math.ceil(estimatedTime / 1000)} saniye kaldı
            </p>
          )}
        </div>
      )}

      {/* Network status */}
      {showNetworkStatus && networkStatus !== 'online' && (
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          {getNetworkIcon()}
          <span>{getNetworkMessage()}</span>
        </div>
      )}

      {/* Retry information for slow connections */}
      {networkStatus === 'slow' && retryCount > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Yavaş bağlantı nedeniyle tekrar deneme: {retryCount}
        </p>
      )}
    </div>
  );
};
