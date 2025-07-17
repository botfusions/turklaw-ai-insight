import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SearchCard } from "@/components/dashboard/SearchCard";
import { SearchResults } from "@/components/dashboard/SearchResults";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // State management
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock search results generator
  const generateMockResults = (query: string, count: number = 8) => {
    const mockResults = [];
    for (let i = 1; i <= count; i++) {
      mockResults.push({
        id: `result-${i}`,
        title: `${query} ile İlgili Karar ${i}`,
        court: i % 2 === 0 ? 'Yargıtay' : 'Danıştay',
        department: `${Math.floor(Math.random() * 15) + 1}. Daire`,
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
        summary: `${query} konusunda verilen bu karar, hukuki durumu detaylı şekilde ele almakta ve ilgili mevzuat çerçevesinde değerlendirmeler sunmaktadır. Bu kararda önemli içtihat değeri olan hususlar bulunmaktadır.`
      });
    }
    return mockResults;
  };

  // Search handler
  const handleSearch = async (query: string, filters: { court?: string; department?: string; dateRange?: string }) => {
    if (!query.trim()) {
      toast.error('Lütfen bir arama terimi girin');
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = generateMockResults(query, 12);
      setSearchResults(results);
      setTotalPages(Math.ceil(results.length / 6)); // 6 sonuç per sayfa
      setCurrentPage(1);
      
      toast.success(`${results.length} sonuç bulundu!`);
    } catch (error) {
      toast.error('Arama sırasında bir hata oluştu');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (loading) {
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

  // Get current page results
  const resultsPerPage = 6;
  const startIndex = (currentPage - 1) * resultsPerPage;
  const currentResults = searchResults.slice(startIndex, startIndex + resultsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40">
      <DashboardHeader 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        showMenuButton={isMobile} 
      />
      
      <div className="dashboard-layout">
        <DashboardSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
          onSearch={(query) => handleSearch(query, {})}
        />
        
        <main className="dashboard-main">
          <div className="dashboard-content">
            {/* Search Card */}
            <SearchCard onSearch={handleSearch} />
            
            {/* Search Results */}
            <SearchResults
              results={currentResults}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>
      
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;