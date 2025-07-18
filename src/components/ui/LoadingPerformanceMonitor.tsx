
import React, { useEffect, useState } from 'react';
import { useSmartLoading } from '@/contexts/SmartLoadingContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PerformanceMetrics {
  loadingDuration: Record<string, number>;
  averageLoadingTime: number;
  retryCount: number;
  networkPerformance: 'fast' | 'normal' | 'slow';
}

export const LoadingPerformanceMonitor: React.FC = () => {
  const { state } = useSmartLoading();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadingDuration: {},
    averageLoadingTime: 0,
    retryCount: 0,
    networkPerformance: 'normal'
  });
  const [startTimes, setStartTimes] = useState<Record<string, number>>({});

  // Track loading start/end times
  useEffect(() => {
    const loadingKeys = ['auth', 'search', 'data', 'action', 'profile', 'navigation'] as const;
    
    loadingKeys.forEach(key => {
      if (state[key] && !startTimes[key]) {
        // Loading started
        setStartTimes(prev => ({
          ...prev,
          [key]: Date.now()
        }));
      } else if (!state[key] && startTimes[key]) {
        // Loading ended
        const duration = Date.now() - startTimes[key];
        setMetrics(prev => ({
          ...prev,
          loadingDuration: {
            ...prev.loadingDuration,
            [key]: duration
          }
        }));
        
        setStartTimes(prev => {
          const newStartTimes = { ...prev };
          delete newStartTimes[key];
          return newStartTimes;
        });
      }
    });
  }, [state, startTimes]);

  // Calculate average loading time
  useEffect(() => {
    const durations = Object.values(metrics.loadingDuration);
    if (durations.length > 0) {
      const average = durations.reduce((a, b) => a + b, 0) / durations.length;
      setMetrics(prev => ({
        ...prev,
        averageLoadingTime: average
      }));
    }
  }, [metrics.loadingDuration]);

  // Update network performance assessment
  useEffect(() => {
    const averageTime = metrics.averageLoadingTime;
    let performance: 'fast' | 'normal' | 'slow' = 'normal';
    
    if (averageTime < 1000) {
      performance = 'fast';
    } else if (averageTime > 3000) {
      performance = 'slow';
    }
    
    setMetrics(prev => ({
      ...prev,
      networkPerformance: performance
    }));
  }, [metrics.averageLoadingTime]);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const getPerformanceBadgeVariant = () => {
    switch (metrics.networkPerformance) {
      case 'fast': return 'default';
      case 'slow': return 'destructive';
      default: return 'secondary';
    }
  };

  const activeLoadingOperations = Object.entries(state)
    .filter(([key, value]) => 
      ['auth', 'search', 'data', 'action', 'profile', 'navigation'].includes(key) && value
    );

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-background/95 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Loading Performance</CardTitle>
        <CardDescription className="text-xs">
          Development monitoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Network Status */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Network:</span>
          <Badge variant={state.networkStatus === 'online' ? 'default' : 'destructive'}>
            {state.networkStatus}
          </Badge>
        </div>

        {/* Performance */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Performance:</span>
          <Badge variant={getPerformanceBadgeVariant()}>
            {metrics.networkPerformance}
          </Badge>
        </div>

        {/* Average Loading Time */}
        {metrics.averageLoadingTime > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Avg. Time:</span>
            <span className="text-xs font-mono">
              {Math.round(metrics.averageLoadingTime)}ms
            </span>
          </div>
        )}

        {/* Retry Count */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Retries:</span>
          <span className="text-xs font-mono">{state.retryCount}</span>
        </div>

        {/* Current Progress */}
        {state.progress > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Progress:</span>
              <span className="text-xs font-mono">{Math.round(state.progress)}%</span>
            </div>
            <Progress value={state.progress} className="h-1" />
          </div>
        )}

        {/* Active Operations */}
        {activeLoadingOperations.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Active:</span>
            {activeLoadingOperations.map(([key]) => (
              <Badge key={key} variant="outline" className="text-xs mr-1">
                {key}
              </Badge>
            ))}
          </div>
        )}

        {/* Current Operation */}
        {state.currentOperation && (
          <div className="text-xs text-muted-foreground border-t pt-2">
            {state.currentOperation}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
