
import React, { useState, useEffect } from 'react';
import { SearchHeader } from '@/components/search/SearchHeader';
import { CategorySidebarLazy, SearchContentLazy, preloadSearchComponents } from '@/components/search/LazySearchComponents';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export default function SearchPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataSource, setDataSource] = useState<'cache' | 'api' | 'static' | 'error'>('cache');
  
  // Preload components on mount for better UX
  useEffect(() => {
    preloadSearchComponents();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(undefined);
    setSidebarOpen(false); // Close mobile sidebar after selection
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    setSidebarOpen(false); // Close mobile sidebar after selection
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader dataSource={dataSource} />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden fixed top-20 left-4 z-50 bg-white shadow-lg hover:bg-gray-50 rounded-full"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 bg-white">
            <CategorySidebarLazy
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onCategorySelect={handleCategorySelect}
              onSubcategorySelect={handleSubcategorySelect}
            />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-80 flex-shrink-0">
          <CategorySidebarLazy
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onCategorySelect={handleCategorySelect}
            onSubcategorySelect={handleSubcategorySelect}
          />
        </div>

        {/* Main Content */}
        <SearchContentLazy 
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onDataSourceChange={setDataSource}
          className="flex-1"
        />
      </div>
    </div>
  );
}
