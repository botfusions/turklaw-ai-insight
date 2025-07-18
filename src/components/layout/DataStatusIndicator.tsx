
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw, Database, AlertTriangle } from 'lucide-react';
import { useGitHubDataSource } from '@/hooks/useGitHubDataSource';
import { Button } from '@/components/ui/button';

export const DataStatusIndicator = () => {
  const { dataStatus, loading, lastUpdate, totalRecords, manualRefresh, autoRefresh, toggleAutoRefresh } = useGitHubDataSource();

  const getStatusConfig = () => {
    switch (dataStatus) {
      case 'active':
        return {
          color: 'bg-green-500',
          label: 'Aktif',
          icon: Database,
          description: `${totalRecords} kayıt yüklenmiş`
        };
      case 'loading':
        return {
          color: 'bg-yellow-500 animate-pulse',
          label: 'Yükleniyor',
          icon: RefreshCw,
          description: 'GitHub veriler yükleniyor...'
        };
      case 'error':
        return {
          color: 'bg-red-500',
          label: 'Hata',
          icon: AlertTriangle,
          description: 'Veri yükleme hatası'
        };
      default:
        return {
          color: 'bg-gray-500',
          label: 'Bilinmeyen',
          icon: Database,
          description: 'Durum bilinmiyor'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Henüz güncellenmedi';
    
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Az önce güncellendi';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} saat önce`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className={`w-2 h-2 rounded-full ${config.color}`} />
            <Badge variant="outline" className="text-xs hidden sm:flex items-center gap-1">
              <IconComponent className="w-3 h-3" />
              <span>{config.label}</span>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="w-64 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">GitHub Veri Durumu</span>
              <Badge variant={dataStatus === 'active' ? 'default' : 'secondary'}>
                {config.label}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Son güncelleme: {formatLastUpdate()}</div>
              <div>Otomatik yenileme: {autoRefresh ? 'Açık' : 'Kapalı'}</div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={manualRefresh}
                disabled={loading}
                className="text-xs h-7"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Yenile
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                onClick={toggleAutoRefresh}
                className="text-xs h-7"
              >
                {autoRefresh ? 'Durdur' : 'Başlat'}
              </Button>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
