import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, X, Trash2 } from 'lucide-react';
import { SearchHistoryItem } from '../types';
import { DataSourceIndicator } from './DataSourceIndicator';

interface SearchHistoryProps {
  searchHistory: SearchHistoryItem[];
  onSelectQuery: (query: string) => void;
  onRemoveItem: (id: string) => void;
  onClearHistory: () => void;
  className?: string;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  searchHistory,
  onSelectQuery,
  onRemoveItem,
  onClearHistory,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat önce`;
    return date.toLocaleDateString('tr-TR');
  };
  
  const handleSelectQuery = (query: string) => {
    onSelectQuery(query);
    setIsOpen(false);
  };
  
  if (searchHistory.length === 0) {
    return null;
  }
  
  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="h-8"
          >
            <History className="w-4 h-4 mr-1" />
            Geçmiş ({searchHistory.length})
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Arama Geçmişi</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearHistory}
                className="h-6 px-2"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="max-h-60">
            <div className="p-2">
              {searchHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer group"
                  onClick={() => handleSelectQuery(item.query)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium truncate">
                        {item.query}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {item.resultCount}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <DataSourceIndicator 
                        dataSource={item.dataSource}
                        performanceInfo={{
                          responseTime: item.responseTime,
                          cacheHit: item.dataSource === 'cache',
                          apiAttempts: item.dataSource === 'primary' ? 1 : 2,
                          dataSource: item.dataSource
                        }}
                      />
                      <span>•</span>
                      <span>{formatTimestamp(item.timestamp)}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};