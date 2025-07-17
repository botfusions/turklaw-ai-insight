import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchHistoryItem } from '../types';
import { 
  History, 
  Clock, 
  X, 
  Trash2,
  Database,
  Layers,
  ServerCrash,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchHistoryPanelProps {
  history: SearchHistoryItem[];
  loading?: boolean;
  onSelectHistory: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
  className?: string;
}

export function SearchHistoryPanel({ 
  history, 
  loading = false,
  onSelectHistory, 
  onClearHistory, 
  onRemoveItem,
  className
}: SearchHistoryPanelProps) {
  if (history.length === 0 && !loading) {
    return (
      <Card className={cn("w-full bg-white border-gray-200 shadow-sm", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            Arama Geçmişi
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

  return (
    <Card className={cn("w-full bg-white border-gray-200 shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            Arama Geçmişi
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearHistory}
            className="h-8 px-2 text-muted-foreground hover:text-destructive"
            disabled={history.length === 0 || loading}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Temizle
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          history.slice(0, 10).map(item => (
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
              <div className="flex flex-wrap gap-2 mt-2 items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(item.timestamp).toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <Badge variant="outline" className="bg-white border-gray-200 text-xs">
                  {item.resultCount} sonuç
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "flex items-center gap-1 text-xs border-0",
                    item.dataSource === 'primary' && "bg-blue-50 text-blue-600",
                    item.dataSource === 'cache' && "bg-green-50 text-green-600",
                    item.dataSource === 'fallback' && "bg-amber-50 text-amber-600",
                    item.dataSource === 'error' && "bg-red-50 text-red-600"
                  )}
                >
                  {item.dataSource === 'primary' && <Database className="h-3 w-3" />}
                  {item.dataSource === 'cache' && <Layers className="h-3 w-3" />}
                  {item.dataSource === 'fallback' && <Layers className="h-3 w-3" />}
                  {item.dataSource === 'error' && <ServerCrash className="h-3 w-3" />}
                  {item.dataSource === 'primary' ? 'API' : 
                   item.dataSource === 'cache' ? 'Önbellek' :
                   item.dataSource === 'fallback' ? 'Yedek' : 'Hata'}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}