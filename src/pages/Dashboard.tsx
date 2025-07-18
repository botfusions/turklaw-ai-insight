
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/UnifiedAuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SearchCard } from "@/components/dashboard/SearchCard";
import { SearchResults } from "@/components/dashboard/SearchResults";
import { LiveSearchResults } from "@/components/dashboard/LiveSearchResults";
import { QuickStatsWidget } from "@/components/dashboard/QuickStatsWidget";
import { SystemStatus } from "@/components/system/SystemStatus";
import { FloatingActionButton } from "@/components/mobile/FloatingActionButton";
import { BottomSheet } from "@/components/mobile/BottomSheet";
import { SmartSearchSuggestions } from "@/components/search/SmartSearchSuggestions";

const Dashboard = () => {
  console.log('Dashboard page rendering...'); // Debug log
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  console.log('Dashboard auth state:', { user: !!user, loading }); // Debug log

  // State management
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Enhanced state management
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTime, setSearchTime] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Mock search results generator with enhanced data
  const generateMockResults = (query: string, count: number = 8) => {
    const courts = ['Yargıtay', 'Danıştay', 'Anayasa Mahkemesi', 'Bölge Adliye Mahkemesi', 'Asliye Hukuk Mahkemesi'];
    const keywords = ['hukuk', 'karar', 'emsal', 'dava', 'mahkeme', 'mevzuat', 'yargı', 'adalet'];
    
    const mockResults = [];
    for (let i = 1; i <= count; i++) {
      const randomCourt = courts[Math.floor(Math.random() * courts.length)];
      const relevanceScore = Math.random() * 10;
      const citationCount = Math.floor(Math.random() * 50);
      const isNew = Math.random() > 0.8;
      const isPopular = Math.random() > 0.7;
      
      mockResults.push({
        id: `result-${i}`,
        title: `${query} ile İlgili ${randomCourt} Kararı ${i}`,
        court: randomCourt,
        department: `${Math.floor(Math.random() * 15) + 1}. Daire`,
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        summary: `${query} konusunda verilen bu karar, hukuki durumu detaylı şekilde ele almakta ve ilgili mevzuat çerçevesinde değerlendirmeler sunmaktadır. Bu kararda önemli içtihat değeri olan hususlar bulunmaktadır ve benzeri davalar için emsal teşkil etmektedir.`,
        relevanceScore: Math.round(relevanceScore * 10) / 10,
        citationCount: citationCount,
        isNew: isNew,
        isPopular: isPopular,
        keywords: keywords.slice(0, Math.floor(Math.random() * 4) + 2)
      });
    }
    return mockResults;
  };

  // Enhanced search handler
  const handleSearch = async (query: string, filters: { 
    court?: string; 
    department?: string; 
    dateRange?: string;
    legalField?: string;
    documentType?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) => {
    console.log('Dashboard handleSearch called with:', { query, filters }); // Debug log
    
    if (!query.trim()) {
      toast.error('Lütfen bir arama terimi girin');
      return;
    }
    
    setIsSearching(true);
    setSearchQuery(query);
    const startTime = performance.now();
    
    try {
      // Simulate API call with variable delay for realism
      const delay = Math.random() * 800 + 200; // 200-1000ms
      await new Promise(resolve => setTimeout(resolve, delay));
      
      const results = generateMockResults(query, Math.floor(Math.random() * 20) + 8); // 8-28 results
      setSearchResults(results);
      setTotalPages(Math.ceil(results.length / 6)); // 6 sonuç per sayfa
      setCurrentPage(1);
      
      const endTime = performance.now();
      const searchTime = (endTime - startTime) / 1000;
      setSearchTime(searchTime);
      
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
    console.log('Dashboard showing loading state...'); // Debug log
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
    console.log('Dashboard: No user, redirecting to login...'); // Debug log
    navigate('/login');
    return null;
  }

  console.log('Dashboard about to render main content...'); // Debug log

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
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Left Column - Search and Results */}
              <div className="lg:col-span-2 space-y-6">
                <SearchCard onSearch={handleSearch} />
                <SearchResults
                  results={currentResults}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  loading={isSearching}
                  totalResults={searchResults.length}
                  searchTime={searchTime}
                  query={searchQuery}
                />
              </div>
              
              {/* Right Column - Widgets (Desktop) */}
              <div className="hidden lg:block space-y-6">
                <QuickStatsWidget />
                <LiveSearchResults />
                <SystemStatus />
                <SmartSearchSuggestions 
                  onSelect={(suggestion) => handleSearch(suggestion, {})} 
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile FAB */}
      {isMobile && (
        <FloatingActionButton
          onSearchClick={() => setShowMobileSearch(true)}
          onFilterClick={() => setShowMobileFilters(true)}
          onVoiceSearchClick={() => {
            // Voice search implementation would go here
            toast.info('Sesli arama özelliği yakında geliyor!');
          }}
        />
      )}

      {/* Mobile Bottom Sheets */}
      <BottomSheet
        isOpen={showMobileSearch}
        onClose={() => setShowMobileSearch(false)}
        title="Hızlı Arama"
        snapPoints={[40, 70, 90]}
      >
        <div className="space-y-6">
          <SmartSearchSuggestions 
            onSelect={(suggestion) => {
              handleSearch(suggestion, {});
              setShowMobileSearch(false);
            }} 
          />
          <QuickStatsWidget />
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        title="Sistem Durumu & Canlı Aktivite"
        snapPoints={[50, 80]}
      >
        <div className="space-y-6">
          <SystemStatus />
          <LiveSearchResults />
        </div>
      </BottomSheet>

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
