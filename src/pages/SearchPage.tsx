import React, { useState } from 'react';
import { SearchHeader } from '@/components/search/SearchHeader';
import { CategorySidebar } from '@/components/search/CategorySidebar';
import { SearchContent } from '@/components/search/SearchContent';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export default function SearchPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataSource, setDataSource] = useState<'cache' | 'api' | 'static' | 'error'>('cache');
  

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
          onDataSourceChange={setDataSource}
          className="flex-1"
        />
      </div>
    </div>
  );
}