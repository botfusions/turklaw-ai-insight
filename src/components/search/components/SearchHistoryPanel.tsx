import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  History,
  Search,
  Bookmark,
  TrendingUp,
  Calendar,
  Filter,
  MoreVertical,
  Star,
  StarOff,
  Trash2,
  Download,
  BarChart3,
  Clock,
  Database,
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useSearchHistoryDB, EnhancedSearchHistoryItem } from '../hooks/useSearchHistoryDB';
import { cn } from '@/lib/utils';
import { DataSourceIndicator } from './DataSourceIndicator';

interface SearchHistoryPanelProps {
  onSelectQuery: (query: string) => void;
  className?: string;
}

export const SearchHistoryPanel: React.FC<SearchHistoryPanelProps> = ({
  onSelectQuery,
  className
}) => {
  const {
    searchHistory,
    loading,
    error,
    isAuthenticated,
    removeFromHistory,
    clearHistory,
    toggleBookmark,
    getRecentQueries,
    getBookmarkedSearches,
    getSearchAnalytics
  } = useSearchHistoryDB();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('recent');

  const analytics = getSearchAnalytics();
  const bookmarkedSearches = getBookmarkedSearches();

  // Filter search history based on search term
  const filteredHistory = searchHistory.filter(item =>
    item.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes}dk önce`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}sa önce`;
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
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

  const renderSearchItem = (item: EnhancedSearchHistoryItem) => (
    <div
      key={item.id}
      className="group flex items-center justify-between p-3 hover:bg-accent/50 rounded-lg transition-colors"
    >
      <div 
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onSelectQuery(item.query)}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium truncate">
            {item.query}
          </span>
          {item.is_bookmarked && (
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {getDataSourceIcon(item.data_source)}
          <Badge variant="secondary" className="text-xs px-1 py-0">
            {item.results_count}
          </Badge>
          <span>•</span>
          <Clock className="w-3 h-3" />
          <span>{formatDate(item.search_date)}</span>
          {item.response_time && (
            <>
              <span>•</span>
              <span>{item.response_time}ms</span>
            </>
          )}
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
          >
            <MoreVertical className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => toggleBookmark(item.id)}>
            {item.is_bookmarked ? (
              <>
                <StarOff className="w-3 h-3 mr-2" />
                Favoriden Çıkar
              </>
            ) : (
              <>
                <Star className="w-3 h-3 mr-2" />
                Favorile
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => removeFromHistory(item.id)}
            className="text-red-600"
          >
            <Trash2 className="w-3 h-3 mr-2" />
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="w-5 h-5" />
              Arama Geçmişi
            </CardTitle>
            <CardDescription>
              {isAuthenticated 
                ? "Aramalarınız otomatik olarak kaydediliyor" 
                : "Yerel geçmiş (giriş yaparak senkronize edin)"
              }
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearHistory}
              className="text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Temizle
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Analytics */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Geçmişte ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Toplam Arama</span>
              </div>
              <span className="text-2xl font-bold">{analytics.total}</span>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Favoriler</span>
              </div>
              <span className="text-2xl font-bold">{analytics.bookmarkedCount}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent">
              <Clock className="w-4 h-4 mr-1" />
              Son Aramalar
            </TabsTrigger>
            <TabsTrigger value="bookmarks">
              <Bookmark className="w-4 h-4 mr-1" />
              Favoriler
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="w-4 h-4 mr-1" />
              İstatistikler
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "Arama sonucu bulunamadı" : "Henüz arama yapmadınız"}
                  </div>
                ) : (
                  filteredHistory.map(renderSearchItem)
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="bookmarks" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {bookmarkedSearches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Star className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                    Henüz favori arama yok
                  </div>
                ) : (
                  bookmarkedSearches.map(renderSearchItem)
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {analytics.averageResultCount.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ortalama Sonuç
                  </div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {analytics.averageResponseTime.toFixed(0)}ms
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ortalama Süre
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Veri Kaynağı Dağılımı</h4>
                {Object.entries(analytics.byDataSource).map(([source, count]) => (
                  <div key={source} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDataSourceIcon(source)}
                      <span className="text-sm capitalize">{source}</span>
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};