
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Clock, Bookmark } from "lucide-react";
import { SavedSearchManager } from "@/components/search/SavedSearchManager";
import { EnhancedTooltip, HelpTooltip } from "@/components/ui/EnhancedTooltip";

interface QuickSearchSectionProps {
  onSearch?: (query: string) => void;
}

export function QuickSearchSection({ onSearch }: QuickSearchSectionProps) {
  const [quickQuery, setQuickQuery] = useState("");
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  
  // Mock favorite queries - in real app this would come from user data
  const favoriteQueries = [
    "İcra takibi",
    "Kira sözleşmesi",
    "İş hukuku",
  ];

  const recentQueries = [
    "Boşanma davası",
    "Miras hukuku",
  ];

  const handleQuickSearch = () => {
    if (quickQuery.trim() && onSearch) {
      onSearch(quickQuery.trim());
      setQuickQuery("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickSearch();
    }
  };

  const handleLoadSavedSearch = (search: any) => {
    if (onSearch) {
      onSearch(search.query);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Hızlı Arama
            <HelpTooltip 
              content="Buradan hızlıca arama yapabilir, favori aramalarınızı kullanabilirsiniz."
              title="Hızlı Arama Yardımı"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <EnhancedTooltip
              content="Arama yapmak için Enter tuşuna basın veya Ara butonuna tıklayın"
              variant="help"
            >
              <Input
                placeholder="Hızlı arama..."
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-8 text-sm"
                aria-label="Hızlı arama giriş alanı"
              />
            </EnhancedTooltip>
            <Button 
              size="sm" 
              onClick={handleQuickSearch} 
              disabled={!quickQuery.trim()}
              aria-label="Arama yap"
            >
              <Search className="h-3 w-3" />
            </Button>
          </div>

          {favoriteQueries.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Star className="h-3 w-3" />
                Favoriler
              </div>
              <div className="flex flex-wrap gap-1">
                {favoriteQueries.map((query, index) => (
                  <EnhancedTooltip
                    key={index}
                    content={`"${query}" araması yap`}
                    variant="default"
                  >
                    <Badge
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => onSearch?.(query)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && onSearch?.(query)}
                    >
                      {query}
                    </Badge>
                  </EnhancedTooltip>
                ))}
              </div>
            </div>
          )}

          {recentQueries.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Clock className="h-3 w-3" />
                Son Kullanılan
              </div>
              <div className="flex flex-wrap gap-1">
                {recentQueries.map((query, index) => (
                  <EnhancedTooltip
                    key={index}
                    content={`"${query}" araması yap`}
                    variant="default"
                  >
                    <Badge
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => onSearch?.(query)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && onSearch?.(query)}
                    >
                      {query}
                    </Badge>
                  </EnhancedTooltip>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSavedSearches(!showSavedSearches)}
              className="w-full justify-start"
            >
              <Bookmark className="h-3 w-3 mr-2" />
              {showSavedSearches ? 'Kayıtlı Aramaları Gizle' : 'Kayıtlı Aramaları Göster'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showSavedSearches && (
        <SavedSearchManager
          currentQuery={quickQuery}
          onLoadSearch={handleLoadSavedSearch}
        />
      )}
    </div>
  );
}
