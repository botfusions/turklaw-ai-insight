import React from 'react';
import { FileText, Clock, HardDrive, Zap, Database, AlertCircle } from 'lucide-react';
import { DataSource } from '../types';

interface StatsCardsProps {
  totalCount: number;
  dataSource: DataSource;
  loading: boolean;
  error: string | null;
  onClearCache: () => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalCount,
  dataSource,
  loading,
  error,
  onClearCache
}) => {
  const getDataSourceIcon = () => {
    switch (dataSource) {
      case 'cache':
        return <HardDrive className="h-6 w-6 text-blue-600" />;
      case 'primary':
        return <Zap className="h-6 w-6 text-green-600" />;
      case 'fallback':
        return <Database className="h-6 w-6 text-orange-600" />;
      default:
        return <FileText className="h-6 w-6 text-gray-600" />;
    }
  };

  const getDataSourceLabel = () => {
    switch (dataSource) {
      case 'cache':
        return 'Cache';
      case 'primary':
        return 'Live API';
      case 'fallback':
        return 'Static Data';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    if (loading) return 'text-blue-600';
    if (error) return 'text-red-600';
    return 'text-green-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-card rounded-lg shadow p-4">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-primary mr-2" />
          <div>
            <p className="text-sm text-muted-foreground">Sonuç</p>
            <p className="text-xl font-semibold">{totalCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-4">
        <div className="flex items-center">
          {getDataSourceIcon()}
          <div className="ml-2">
            <p className="text-sm text-muted-foreground">Kaynak</p>
            <p className="text-sm font-semibold">{getDataSourceLabel()}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-4">
        <div className="flex items-center">
          <Clock className="h-6 w-6 text-primary mr-2" />
          <div>
            <p className="text-sm text-muted-foreground">Durum</p>
            <p className={`text-sm font-semibold ${getStatusColor()}`}>
              {loading ? 'Aranıyor...' : error ? 'Hata' : 'Hazır'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-4">
        <button
          onClick={onClearCache}
          className="w-full text-sm bg-destructive/10 hover:bg-destructive/20 text-destructive px-3 py-1 rounded transition-colors"
        >
          Cache Temizle
        </button>
      </div>
    </div>
  );
};