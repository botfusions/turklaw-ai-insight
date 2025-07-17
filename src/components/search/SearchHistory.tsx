import React from 'react';
import { Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface SearchHistoryItem {
  id: string;
  query: string;
  category: string;
  subcategory: string;
  timestamp: string;
  resultCount: number;
  dataSource: string;
}

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelectHistory: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

export function SearchHistory({ 
  history, 
  onSelectHistory, 
  onClearHistory, 
  onRemoveItem 
}: SearchHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white shadow-sm border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Son Aramalar
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Temizle
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {history.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <button
              onClick={() => onSelectHistory(item)}
              className="flex-1 text-left space-y-1"
            >
              <div className="font-medium text-sm truncate text-gray-900">
                {item.query}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span>{item.resultCount} sonuç</span>
                <span>•</span>
                <span>{new Date(item.timestamp).toLocaleDateString('tr-TR')}</span>
              </div>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(item.id)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}