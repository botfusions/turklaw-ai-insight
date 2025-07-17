import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DataSource, PerformanceInfo } from '../types';
import { Zap, Database, Cloud, AlertCircle } from 'lucide-react';

interface DataSourceIndicatorProps {
  dataSource: DataSource;
  performanceInfo?: PerformanceInfo;
  className?: string;
}

export const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({
  dataSource,
  performanceInfo,
  className
}) => {
  const getSourceConfig = (source: DataSource) => {
    switch (source) {
      case 'primary':
        return {
          icon: <Cloud className="w-3 h-3" />,
          label: 'Canlı Veri',
          variant: 'default' as const,
          color: 'text-green-600'
        };
      case 'fallback':
        return {
          icon: <Database className="w-3 h-3" />,
          label: 'Yedek Veri',
          variant: 'secondary' as const,
          color: 'text-yellow-600'
        };
      case 'cache':
        return {
          icon: <Zap className="w-3 h-3" />,
          label: 'Önbellek',
          variant: 'outline' as const,
          color: 'text-blue-600'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          label: 'Hata',
          variant: 'destructive' as const,
          color: 'text-red-600'
        };
      default:
        return {
          icon: <Database className="w-3 h-3" />,
          label: 'Bilinmeyen',
          variant: 'outline' as const,
          color: 'text-gray-600'
        };
    }
  };
  
  const config = getSourceConfig(dataSource);
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        <span className="text-xs">{config.label}</span>
      </Badge>
      
      {performanceInfo && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{performanceInfo.responseTime}ms</span>
          {performanceInfo.cacheHit && (
            <span className="text-blue-600">•</span>
          )}
          {performanceInfo.apiAttempts > 0 && (
            <span>{performanceInfo.apiAttempts} deneme</span>
          )}
        </div>
      )}
    </div>
  );
};