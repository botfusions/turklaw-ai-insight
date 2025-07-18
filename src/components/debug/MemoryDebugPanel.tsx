
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Timer,
  Headphones,
  Network
} from 'lucide-react';
import { useMemoryManagement } from '@/contexts/MemoryManagementContext';
import { useMemoryMonitor } from '@/hooks/useMemoryMonitor';

const MemoryDebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const { 
    forceCleanup, 
    getMemoryReport, 
    getActiveResourceCounts,
    isMemoryHigh,
    isMemorycritical
  } = useMemoryManagement();
  
  const { memoryStats, getFormattedMemorySize } = useMemoryMonitor('MemoryDebugPanel');
  
  const [memoryReport, setMemoryReport] = useState<any>(null);
  const [resourceCounts, setResourceCounts] = useState({ timers: 0, listeners: 0, requests: 0 });

  // Update data periodically
  useEffect(() => {
    if (!autoRefresh) return;

    const updateData = () => {
      setMemoryReport(getMemoryReport());
      setResourceCounts(getActiveResourceCounts());
    };

    updateData();
    const interval = setInterval(updateData, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh, getMemoryReport, getActiveResourceCounts]);

  // Show in development or when memory is high
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    setIsVisible(isDev || isMemoryHigh);
  }, [isMemoryHigh]);

  if (!isVisible) return null;

  const getMemoryStatus = () => {
    if (isMemorycritical) return { color: 'destructive', icon: AlertTriangle, label: 'Kritik' };
    if (isMemoryHigh) return { color: 'warning', icon: AlertTriangle, label: 'Yüksek' };
    return { color: 'success', icon: CheckCircle, label: 'Normal' };
  };

  const status = getMemoryStatus();

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-background/95 backdrop-blur-sm border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Memory Monitor
            <Badge variant={status.color as any} className="ml-auto">
              <status.icon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Memory Stats */}
          {memoryStats && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Bellek Kullanımı</span>
                <span>{memoryStats.usagePercentage.toFixed(1)}%</span>
              </div>
              <Progress 
                value={memoryStats.usagePercentage} 
                className={`h-2 ${isMemorycritical ? 'bg-destructive' : isMemoryHigh ? 'bg-warning' : ''}`}
              />
              <div className="text-xs text-muted-foreground">
                {getFormattedMemorySize(memoryStats.usedJSHeapSize)} / {getFormattedMemorySize(memoryStats.jsHeapSizeLimit)}
              </div>
            </div>
          )}

          {/* Resource Counts */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <Timer className="h-4 w-4 mx-auto mb-1 text-blue-500" />
              <div className="font-medium">{resourceCounts.timers}</div>
              <div className="text-muted-foreground">Timer</div>
            </div>
            <div className="text-center">
              <Headphones className="h-4 w-4 mx-auto mb-1 text-green-500" />
              <div className="font-medium">{resourceCounts.listeners}</div>
              <div className="text-muted-foreground">Listener</div>
            </div>
            <div className="text-center">
              <Network className="h-4 w-4 mx-auto mb-1 text-purple-500" />
              <div className="font-medium">{resourceCounts.requests}</div>
              <div className="text-muted-foreground">Request</div>
            </div>
          </div>

          {/* Critical Memory Alert */}
          {isMemorycritical && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Bellek kullanımı kritik seviyede! Otomatik temizlik başlatıldı.
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={forceCleanup}
              className="flex-1 text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Temizle
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex-1 text-xs"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Durdur' : 'Başlat'}
            </Button>
          </div>

          {/* Component Memory Info */}
          {memoryReport?.component && (
            <div className="text-xs text-muted-foreground border-t pt-2">
              <div>Bileşen: {memoryReport.component.name}</div>
              <div>Render: {memoryReport.component.renders}</div>
              <div>Bellek: {memoryReport.component.memoryAtRender}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryDebugPanel;
