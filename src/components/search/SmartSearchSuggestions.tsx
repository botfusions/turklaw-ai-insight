import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Search, Star, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SearchSuggestion {
  id: string;
  suggestion: string;
  category: string | null;
  popularity_score: number;
}

interface SmartSearchSuggestionsProps {
  onSelect: (suggestion: string) => void;
  className?: string;
}

export function SmartSearchSuggestions({ onSelect, className }: SmartSearchSuggestionsProps) {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
    fetchRecentSearches();
  }, [user]);

  const fetchSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('search_suggestions')
        .select('*')
        .order('popularity_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchRecentSearches = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_searches')
        .select('query')
        .eq('user_id', user.id)
        .order('search_date', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      const uniqueQueries = [...new Set(data?.map(item => item.query) || [])];
      setRecentSearches(uniqueQueries);
    } catch (error) {
      console.error('Error fetching recent searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case 'mevzuat':
        return <Star className="h-3 w-3" />;
      case 'mahkeme':
        return <TrendingUp className="h-3 w-3" />;
      default:
        return <Search className="h-3 w-3" />;
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'mevzuat':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'mahkeme':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'konu':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/3 mb-3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-sm">Son Aramalar</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((query, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSelect(query)}
                className="h-7 text-xs"
              >
                {query}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Popular Suggestions */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">Popüler Aramalar</h3>
        </div>
        <div className="space-y-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion.id}
              variant="ghost"
              size="sm"
              onClick={() => onSelect(suggestion.suggestion)}
              className="w-full justify-start h-auto p-2 text-left"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(suggestion.category)}
                  <span className="text-sm">{suggestion.suggestion}</span>
                </div>
                <div className="flex items-center gap-2">
                  {suggestion.category && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-2 py-0 ${getCategoryColor(suggestion.category)}`}
                    >
                      {suggestion.category}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {suggestion.popularity_score}
                  </Badge>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}