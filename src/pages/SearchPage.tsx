import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { CategorySidebar } from '@/components/search/CategorySidebar';
import { SearchContent } from '@/components/search/SearchContent';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

export default function SearchPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile } = useAuth();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(undefined);
    setSidebarOpen(false); // Close mobile sidebar after selection
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    setSidebarOpen(false); // Close mobile sidebar after selection
  };

  const remainingSearches = profile ? profile.max_searches - profile.monthly_search_count : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <Header />
      
      {/* Search Limit Banner */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Bu ay kalan arama hakkınız: {remainingSearches}
              </span>
            </div>
            {remainingSearches <= 3 && (
              <Button size="sm" variant="outline" className="bg-white/70 border-white/20 hover:bg-white/90">
                Plan Yükselt
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden fixed top-20 left-4 z-50 bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:bg-white/90 rounded-full"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 bg-white/70 backdrop-blur-sm border-white/20">
            <CategorySidebar
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onCategorySelect={handleCategorySelect}
              onSubcategorySelect={handleSubcategorySelect}
            />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-80 flex-shrink-0">
          <CategorySidebar
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onCategorySelect={handleCategorySelect}
            onSubcategorySelect={handleSubcategorySelect}
          />
        </div>

        {/* Main Content */}
        <SearchContent 
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          className="flex-1"
        />
      </div>
    </div>
  );
}