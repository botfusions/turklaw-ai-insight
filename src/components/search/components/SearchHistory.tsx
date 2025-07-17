import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, X, Trash2, Database, Cloud, Zap, AlertCircle } from 'lucide-react';
import { SearchHistoryItem, DataSource } from '../types';

export interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelectHistory: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
  className?: string;
}

export function SearchHistory({
  history,
  onSelectHistory,
  onClearHistory,
  onRemoveItem,
  className
}: SearchHistoryProps) {
  if (history.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            Son Aramalar
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            Henüz arama geçmişiniz bulunmamaktadır.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getSourceConfig = (source: DataSource) => {
    switch (source) {
      case 'primary':
        return {
          icon: <Cloud className="h-3 w-3" />,
          label: 'Canlı',
          className: 'bg-green-50 text-green-600'
        };
      case 'fallback':
        return {
          icon: <Database className="h-3 w-3" />,
          label: 'Yedek',
          className: 'bg-yellow-50 text-yellow-600'
        };
      case 'cache':
        return {
          icon: <Zap className="h-3 w-3" />,
          label: 'Önbellek',
          className: 'bg-blue-50 text-blue-600'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          label: 'Hata',
          className: 'bg-red-50 text-red-600'
        };
      default:
        return {
          icon: <Database className="h-3 w-3" />,
          label: 'Bilinmeyen',
          className: 'bg-gray-50 text-gray-600'
        };
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            Son Aramalar ({history.length})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="h-8 px-2 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Temizle
          </Button>
        </div>
      </CardHeader>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <CardContent className="space-y-3">
          {history.map((item) => {
            const sourceConfig = getSourceConfig(item.dataSource);
            return (
              <div
                key={item.id}
                className="group relative p-3 border border-gray-100 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelectHistory(item)}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium text-sm line-clamp-1 flex-1 pr-6">
                    {item.query}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.id);
                    }}
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 items-center">
                  <Badge variant="outline" className="text-xs bg-white border-gray-200">
                    {item.resultCount} sonuç
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs flex items-center gap-1 border-0 ${sourceConfig.className}`}
                  >
                    {sourceConfig.icon}
                    {sourceConfig.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}