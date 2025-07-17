import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Clock } from "lucide-react";

interface QuickSearchSectionProps {
  onSearch?: (query: string) => void;
}

export function QuickSearchSection({ onSearch }: QuickSearchSectionProps) {
  const [quickQuery, setQuickQuery] = useState("");
  
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Search className="h-4 w-4" />
          Hızlı Arama
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Hızlı arama..."
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-8 text-sm"
          />
          <Button size="sm" onClick={handleQuickSearch} disabled={!quickQuery.trim()}>
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
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-primary/10 hover:text-primary"
                  onClick={() => onSearch?.(query)}
                >
                  {query}
                </Badge>
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
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-muted"
                  onClick={() => onSearch?.(query)}
                >
                  {query}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}