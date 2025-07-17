import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PerformanceInfo as PerfInfo } from '../types';
import { Zap, Clock, Activity } from 'lucide-react';

interface PerformanceInfoProps {
  performanceInfo: PerfInfo;
  className?: string;
}

export const PerformanceInfo: React.FC<PerformanceInfoProps> = ({
  performanceInfo,
  className
}) => {
  const getPerformanceColor = (responseTime: number) => {
    if (responseTime < 500) return 'text-green-600';
    if (responseTime < 2000) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Performans Bilgisi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Yanıt Süresi:</span>
          </div>
          <Badge 
            variant="outline" 
            className={getPerformanceColor(performanceInfo.responseTime)}
          >
            {performanceInfo.responseTime}ms
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Cache Durumu:</span>
          <Badge variant={performanceInfo.cacheHit ? 'default' : 'secondary'}>
            {performanceInfo.cacheHit ? 'Hit' : 'Miss'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">API Denemeleri:</span>
          <Badge variant="outline">
            {performanceInfo.apiAttempts}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Veri Kaynağı:</span>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span className="text-sm capitalize">{performanceInfo.dataSource}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};