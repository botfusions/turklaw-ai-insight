import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SearchHistoryPanel } from './SearchHistoryPanel';
import { SearchHistoryItem } from '../types';
import { History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchHistoryMobileDrawerProps {
  history: SearchHistoryItem[];
  loading?: boolean;
  onSelectHistory: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

export function SearchHistoryMobileDrawer({ 
  history, 
  loading = false,
  onSelectHistory, 
  onClearHistory, 
  onRemoveItem 
}: SearchHistoryMobileDrawerProps) {
  const [open, setOpen] = useState(false);
  
  const handleSelectHistory = (item: SearchHistoryItem) => {
    onSelectHistory(item);
    setOpen(false); // Close the drawer after selection
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-10 md:hidden bg-white border-gray-200 hover:bg-gray-50 relative"
        >
          <History className="h-4 w-4 mr-2" />
          Arama Geçmişi
          {history.length > 0 && (
            <Badge 
              className="absolute top-0 right-0 -mt-2 -mr-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground"
              variant="destructive"
            >
              {history.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader className="mb-4">
          <SheetTitle>Arama Geçmişi</SheetTitle>
        </SheetHeader>
        <SearchHistoryPanel 
          history={history}
          loading={loading}
          onSelectHistory={handleSelectHistory}
          onClearHistory={onClearHistory}
          onRemoveItem={onRemoveItem}
        />
      </SheetContent>
    </Sheet>
  );
}