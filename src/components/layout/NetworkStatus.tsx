
import { Wifi, WifiOff, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

export const NetworkStatus = () => {
  const { isOffline, isInstallable, installApp, isInstalled } = usePWA();

  if (!isOffline && !isInstallable) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-50 space-y-2">
      {/* Offline Indicator */}
      {isOffline && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
          <WifiOff className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Bağlantı yok - Çevrimdışı moddasınız</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              <span className="text-xs">Offline</span>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* PWA Install Prompt */}
      {isInstallable && !isInstalled && (
        <Alert className="bg-primary/10 border-primary/20">
          <Download className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>TurkLaw AI'yi cihazınıza yükleyin</span>
            <Button
              size="sm"
              onClick={installApp}
              className="ml-2"
            >
              Yükle
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Online Indicator (temporary show when coming back online) */}
      {!isOffline && (
        <Alert className="bg-success/10 border-success/20 animate-fade-in">
          <Wifi className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Bağlantı geri geldi</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-xs">Online</span>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
