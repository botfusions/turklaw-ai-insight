import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  History,
  Clock,
  Star,
  TrendingUp,
  Trash2,
  ChevronDown,
  Bookmark,
  Database,
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useSearchHistoryDB } from '../hooks/useSearchHistoryDB';
import { cn } from '@/lib/utils';

interface SearchHistoryDropdownProps {
  onSelectQuery: (query: string) => void;
  className?: string;
}

export const SearchHistoryDropdown: React.FC<SearchHistoryDropdownProps> = ({
  onSelectQuery,
  className
}) => {
  const {
    searchHistory,
    loading,
    isAuthenticated,
    getRecentQueries,
    getBookmarkedSearches,
    getSearchAnalytics
  } = useSearchHistoryDB();

  const [isOpen, setIsOpen] = useState(false);

  const recentQueries = getRecentQueries(5);
  const bookmarkedSearches = getBookmarkedSearches().slice(0, 3);
  const analytics = getSearchAnalytics();

  const handleSelectQuery = (query: string) => {
    onSelectQuery(query);
    setIsOpen(false);
  };

  const getDataSourceIcon = (dataSource: string) => {
    switch (dataSource) {
      case 'primary': return <Database className="w-3 h-3 text-green-500" />;
      case 'fallback': return <Wifi className="w-3 h-3 text-yellow-500" />;
      case 'cache': return <Zap className="w-3 h-3 text-blue-500" />;
      case 'error': return <WifiOff className="w-3 h-3 text-red-500" />;
      default: return <Database className="w-3 h-3 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes}dk`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}sa`;
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  if (loading || searchHistory.length === 0) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn("gap-2", className)}
        >
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">Geçmiş</span>
          <Badge variant="secondary" className="ml-1">
            {searchHistory.length}
          </Badge>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          <History className="w-4 h-4" />
          Arama Geçmişi
          {!isAuthenticated && (
            <Badge variant="outline" className="text-xs">
              Yerel
            </Badge>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        {/* Quick Stats */}
        <div className="px-2 py-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Toplam: {analytics.total}</span>
            <span>Favoriler: {analytics.bookmarkedCount}</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Recent Searches */}
        <DropdownMenuLabel className="flex items-center gap-2 text-xs">
          <Clock className="w-3 h-3" />
          Son Aramalar
        </DropdownMenuLabel>
        
        <ScrollArea className="max-h-32">
          {recentQueries.length === 0 ? (
            <div className="px-2 py-4 text-center text-xs text-muted-foreground">
              Henüz arama yapmadınız
            </div>
          ) : (
            recentQueries.map((query, index) => {
              const item = searchHistory.find(h => h.query === query);
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={() => handleSelectQuery(query)}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">{query}</div>
                    {item && (
                      <div className="flex items-center gap-1 mt-1">
                        {getDataSourceIcon(item.data_source)}
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {item.results_count}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(item.search_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </ScrollArea>

        {/* Bookmarked Searches */}
        {bookmarkedSearches.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center gap-2 text-xs">
              <Star className="w-3 h-3 text-yellow-500" />
              Favoriler
            </DropdownMenuLabel>
            
            <ScrollArea className="max-h-24">
              {bookmarkedSearches.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => handleSelectQuery(item.query)}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="truncate text-sm">{item.query}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {getDataSourceIcon(item.data_source)}
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        {item.results_count}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </>
        )}

        {/* Trending/Popular */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2 text-xs">
          <TrendingUp className="w-3 h-3" />
          Son Aktivite
        </DropdownMenuLabel>
        
        <div className="px-2 py-1">
          <div className="text-xs text-muted-foreground">
            {analytics.averageResultCount > 0 && (
              <div>Ortalama {analytics.averageResultCount.toFixed(1)} sonuç</div>
            )}
            {analytics.averageResponseTime > 0 && (
              <div>Ortalama {analytics.averageResponseTime.toFixed(0)}ms</div>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};