
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { SimplifiedErrorBoundary } from "@/components/ui/SimplifiedErrorBoundary";

// Import lazy components
import { 
  CategorySidebarLazy, 
  SearchContentLazy, 
  preloadSearchComponents 
} from "@/components/search/LazySearchComponents";

const SearchPage = () => {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Preload components on mount
  useEffect(() => {
    preloadSearchComponents();
  }, []);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  // Auth check
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <SimplifiedErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="flex h-screen">
          {/* Category Sidebar */}
          <CategorySidebarLazy 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isMobile={isMobile}
          />
          
          {/* Main Content */}
          <SearchContentLazy 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            showMenuButton={isMobile}
          />
          
          {/* Mobile overlay */}
          {isMobile && sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </div>
    </SimplifiedErrorBoundary>
  );
};

export default SearchPage;
