import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchHistoryDB } from "@/components/search/hooks/useSearchHistoryDB";

// Import all sidebar sections
import { UserProfileSection } from "./sidebar/UserProfileSection";
import { QuickSearchSection } from "./sidebar/QuickSearchSection";
import { NavigationSection } from "./sidebar/NavigationSection";
import { SmartCategoriesSection } from "./sidebar/SmartCategoriesSection";
import { DynamicFiltersSection } from "./sidebar/DynamicFiltersSection";
import { SmartSuggestionsSection } from "./sidebar/SmartSuggestionsSection";
import { SearchHistory } from "@/components/search/components/SearchHistory";
import { QuickActionsSection } from "./sidebar/QuickActionsSection";

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  onSearch?: (query: string) => void;
}

export function DashboardSidebar({ 
  isOpen = true, 
  onClose, 
  isMobile = false,
  onSearch 
}: DashboardSidebarProps) {
  const { history, removeSearch, clearHistory } = useSearchHistoryDB();

  const handleHistorySelect = (item: any) => {
    if (onSearch) {
      onSearch(item.query);
    }
  };

  const handleCategorySelect = (category: string, subcategory?: string) => {
    // Handle category selection logic
    console.log('Category selected:', category, subcategory);
  };

  const handleSuggestionClick = (suggestion: string, type: string) => {
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  const handleFiltersChange = (filters: any) => {
    // Handle filter changes
    console.log('Filters changed:', filters);
  };

  return (
    <aside className={cn(
      "dashboard-sidebar",
      isMobile && "dashboard-sidebar-mobile",
      isMobile && isOpen && "dashboard-sidebar-open"
    )}>
      {/* Mobile close button */}
      {isMobile && (
        <div className="flex justify-between items-center p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h2 className="font-semibold text-lg">Akıllı Asistan</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* User Profile Section */}
          <UserProfileSection />
          
          {/* Quick Search Section */}
          <QuickSearchSection onSearch={onSearch} />
          
          {/* Main Navigation */}
          <NavigationSection />
          
          {/* Smart Categories */}
          <SmartCategoriesSection onCategorySelect={handleCategorySelect} />
          
          {/* Dynamic Filters */}
          <DynamicFiltersSection onFiltersChange={handleFiltersChange} />
          
          {/* Smart Suggestions */}
          <SmartSuggestionsSection onSuggestionClick={handleSuggestionClick} />
          
          {/* Search History */}
          {history.length > 0 && (
            <SearchHistory
              history={history.slice(0, 5)}
              onSelectHistory={handleHistorySelect}
              onClearHistory={clearHistory}
              onRemoveItem={removeSearch}
            />
          )}
          
          {/* Quick Actions */}
          <QuickActionsSection />
        </div>
      </ScrollArea>
    </aside>
  );
}