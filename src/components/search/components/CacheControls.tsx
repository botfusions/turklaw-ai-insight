import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Database, RefreshCw } from 'lucide-react';

interface CacheControlsProps {
  cacheSize: number;
  historySize: number;
  lastCacheCleared: number | null;
  onClearCache: () => void;
  onClearHistory: () => void;
  className?: string;
}

export const CacheControls: React.FC<CacheControlsProps> = ({
  cacheSize,
  historySize,
  lastCacheCleared,
  onClearCache,
  onClearHistory,
  className
}) => {
  const formatLastCleared = (timestamp: number | null) => {
    if (!timestamp) return 'Hiçbir zaman';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat önce`;
    return date.toLocaleDateString('tr-TR');
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Database className="w-4 h-4" />
          Cache Kontrolleri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">Önbellek Boyutu:</span>
            <Badge variant="outline">{cacheSize} arama</Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearCache}
            disabled={cacheSize === 0}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Temizle
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">Geçmiş Boyutu:</span>
            <Badge variant="outline">{historySize} arama</Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearHistory}
            disabled={historySize === 0}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Temizle
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            <span>Son temizleme: {formatLastCleared(lastCacheCleared)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};