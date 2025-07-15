import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAPIStatus } from '@/hooks/useAPIStatus';
import { Activity, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface DebugLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: any;
}

export const DebugConsole: React.FC = () => {
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { apiStatuses, checkAllAPIs } = useAPIStatus();

  useEffect(() => {
    // Capture console logs
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.log = (...args) => {
      originalConsoleLog(...args);
      addLog('info', args.join(' '));
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      addLog('error', args.join(' '));
    };

    console.warn = (...args) => {
      originalConsoleWarn(...args);
      addLog('warning', args.join(' '));
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  const addLog = (level: 'info' | 'warning' | 'error', message: string, details?: any) => {
    const log: DebugLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      message,
      details
    };
    
    setLogs(prev => [log, ...prev.slice(0, 99)]); // Keep last 100 logs
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge variant="destructive">ERROR</Badge>;
      case 'warning':
        return <Badge variant="secondary">WARN</Badge>;
      default:
        return <Badge variant="outline">INFO</Badge>;
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
      >
        <Activity className="h-4 w-4 mr-2" />
        Debug Console
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-96 z-50 bg-card shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Debug Console
          </span>
          <div className="flex gap-2">
            <Button
              onClick={checkAllAPIs}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="outline"
              size="sm"
            >
              ×
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* API Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">API Status</h4>
          <div className="space-y-1">
            {apiStatuses.map((api) => (
              <div key={api.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  {getStatusIcon(api.status)}
                  {api.name}
                </span>
                <span className="text-muted-foreground">
                  {api.responseTime ? `${api.responseTime}ms` : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Console Logs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Console Logs</h4>
            <Button
              onClick={clearLogs}
              variant="outline"
              size="sm"
            >
              Clear
            </Button>
          </div>
          
          <ScrollArea className="h-48 w-full">
            <div className="space-y-1">
              {logs.length === 0 ? (
                <p className="text-xs text-muted-foreground">No logs yet...</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="text-xs border-b pb-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getLevelBadge(log.level)}
                      <span className="text-muted-foreground">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-foreground">{log.message}</p>
                    {log.details && (
                      <pre className="text-muted-foreground mt-1">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};