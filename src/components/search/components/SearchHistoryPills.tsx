import React from 'react';
import { Button } from '@/components/ui/button';

interface SearchHistoryPillsProps {
  searchHistory: string[];
  onSelectQuery: (query: string) => void;
}

export const SearchHistoryPills: React.FC<SearchHistoryPillsProps> = ({
  searchHistory,
  onSelectQuery
}) => {
  if (searchHistory.length === 0) return null;

  return (
    <div className="mt-4 flex gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Son aramalar:</span>
      {searchHistory.slice(0, 5).map((query, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelectQuery(query)}
          className="h-7 text-xs"
        >
          {query}
        </Button>
      ))}
    </div>
  );
};