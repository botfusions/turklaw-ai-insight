import React from 'react';
import { Search, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SearchSuggestionsProps {
  suggestions: string[];
  recentSearches: string[];
  onSelectSuggestion: (suggestion: string) => void;
  visible: boolean;
}

export function SearchSuggestions({ 
  suggestions, 
  recentSearches, 
  onSelectSuggestion, 
  visible 
}: SearchSuggestionsProps) {
  if (!visible) return null;

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 z-50 bg-card border border-border shadow-lg">
      <CardContent className="p-0">
        {/* Popular Suggestions */}
        {suggestions.length > 0 && (
          <div className="p-3 border-b border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Search className="w-3 h-3" />
              Popüler Aramalar
            </h4>
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2 hover:bg-muted"
                  onClick={() => onSelectSuggestion(suggestion)}
                >
                  <span className="truncate">{suggestion}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="p-3">
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Son Aramalar
            </h4>
            <div className="space-y-1">
              {recentSearches.slice(0, 3).map((search, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2 hover:bg-muted"
                  onClick={() => onSelectSuggestion(search)}
                >
                  <span className="truncate">{search}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {suggestions.length === 0 && recentSearches.length === 0 && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            Önerilecek arama yok
          </div>
        )}
      </CardContent>
    </Card>
  );
}