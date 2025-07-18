import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi, Globe, AlertTriangle } from 'lucide-react';
import { useErrorMonitoring } from '@/components/system/ErrorMonitoringSystem';
import { errorTracker } from '@/services/errorTracking';

interface NetworkStatus {
  online: boolean;
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
}

const NetworkMonitor: React.FC = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    online: navigator.onLine
  });
  const [lastDisconnect, setLastDisconnect] = useState<Date | null>(null);
  const [connectionIssues, setConnectionIssues] = useState<number>(0);
  const { reportError } = useErrorMonitoring();

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      setNetworkStatus({
        online: navigator.onLine,
        downlink: connection?.downlink,
        effectiveType: connection?.effectiveType,
        rtt: connection?.rtt,
        saveData: connection?.saveData
      });
    };

    const handleOnline = () => {
      console.log('Network: Connection restored');
      updateNetworkStatus();
      
      if (lastDisconnect) {
        const disconnectDuration = Date.now() - lastDisconnect.getTime();
        errorTracker.logInfo('Network connection restored', {
          component: 'NetworkMonitor',
          action: 'connection_restored',
          metadata: {
            disconnectDuration,
            reconnectTime: new Date().toISOString()
          }
        });
      }
    };

    const handleOffline = () => {
      console.log('Network: Connection lost');
      setLastDisconnect(new Date());
      setConnectionIssues(prev => prev + 1);
      updateNetworkStatus();
      
      reportError('Network connection lost', undefined, {
        component: 'NetworkMonitor',
        action: 'connection_lost',
        timestamp: Date.now()
      });
    };

    const handleConnectionChange = () => {
      updateNetworkStatus();
    };

    // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Listen for connection changes
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Initial status update
    updateNetworkStatus();

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [lastDisconnect, reportError]);

  // Monitor for slow connections
  useEffect(() => {
    if (networkStatus.online && networkStatus.rtt && networkStatus.rtt > 2000) {
      errorTracker.logWarning('Slow network connection detected', {
        component: 'NetworkMonitor',
        action: 'slow_connection',
        metadata: {
          rtt: networkStatus.rtt,
          effectiveType: networkStatus.effectiveType,
          downlink: networkStatus.downlink
        }
      });
    }
  }, [networkStatus]);

  // Don't render in production unless there are issues
  if (!import.meta.env.DEV && networkStatus.online && connectionIssues === 0) {
    return null;
  }

  const getConnectionQuality = () => {
    if (!networkStatus.online) return 'offline';
    if (!networkStatus.rtt) return 'unknown';
    
    if (networkStatus.rtt < 100) return 'excellent';
    if (networkStatus.rtt < 300) return 'good';
    if (networkStatus.rtt < 1000) return 'fair';
    return 'poor';
  };

  const getConnectionBadge = () => {
    const quality = getConnectionQuality();
    
    switch (quality) {
      case 'offline':
        return <Badge variant="destructive" className="gap-1"><WifiOff className="h-3 w-3" />Offline</Badge>;
      case 'excellent':
        return <Badge variant="default" className="gap-1 bg-green-100 text-green-800"><Wifi className="h-3 w-3" />Excellent</Badge>;
      case 'good':
        return <Badge variant="default" className="gap-1 bg-blue-100 text-blue-800"><Wifi className="h-3 w-3" />Good</Badge>;
      case 'fair':
        return <Badge variant="default" className="gap-1 bg-yellow-100 text-yellow-800"><Wifi className="h-3 w-3" />Fair</Badge>;
      case 'poor':
        return <Badge variant="destructive" className="gap-1"><Wifi className="h-3 w-3" />Poor</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><Globe className="h-3 w-3" />Unknown</Badge>;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {/* Offline Alert */}
      {!networkStatus.online && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <WifiOff className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            İnternet bağlantısı kesildi. Lütfen bağlantınızı kontrol edin.
          </AlertDescription>
        </Alert>
      )}

      {/* Development Network Monitor */}
      {import.meta.env.DEV && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-800">
                Network Monitor
              </CardTitle>
              {getConnectionBadge()}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">Status:</span>
                <span className="ml-1">{networkStatus.online ? 'Online' : 'Offline'}</span>
              </div>
              
              {networkStatus.effectiveType && (
                <div>
                  <span className="font-medium">Type:</span>
                  <span className="ml-1 capitalize">{networkStatus.effectiveType}</span>
                </div>
              )}
              
              {networkStatus.rtt && (
                <div>
                  <span className="font-medium">RTT:</span>
                  <span className="ml-1">{networkStatus.rtt}ms</span>
                </div>
              )}
              
              {networkStatus.downlink && (
                <div>
                  <span className="font-medium">Speed:</span>
                  <span className="ml-1">{networkStatus.downlink}Mbps</span>
                </div>
              )}
            </div>
            
            {connectionIssues > 0 && (
              <div className="pt-2 border-t border-blue-200">
                <div className="flex items-center gap-2 text-xs">
                  <AlertTriangle className="h-3 w-3 text-yellow-600" />
                  <span>Connection issues: {connectionIssues}</span>
                </div>
              </div>
            )}
            
            {lastDisconnect && (
              <div className="text-xs text-blue-600">
                Last disconnect: {lastDisconnect.toLocaleTimeString()}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NetworkMonitor;