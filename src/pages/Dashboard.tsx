import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SearchCard } from "@/components/dashboard/SearchCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Zap } from "lucide-react";
import { FloatingActionButton } from "@/components/mobile/FloatingActionButton";
import { SimplifiedErrorBoundary } from "@/components/ui/SimplifiedErrorBoundary";

// Import lazy components
import { 
  DashboardSidebarLazy, 
  SearchResultsLazy, 
  preloadDashboardComponents 
} from "@/components/dashboard/LazyDashboardComponents";

// Fixed: Complete Dashboard component with proper default export for lazy loading
const Dashboard: React.FC = () => {
  const { user, initialized } = useAuth();
  const navigate = useNavigate(); // subscription button için gerekli
  const isMobile = useIsMobile();

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTime, setSearchTime] = useState(0);

  // Enhanced search with progressive loading
  const [searchLoadingSteps, setSearchLoadingSteps] = useState<{
    id: string;
    label: string;
    status: 'pending' | 'loading' | 'completed' | 'error';
  }[]>([
    { id: 'query', label: 'Sorgu analiz ediliyor...', status: 'pending' },
    { id: 'database', label: 'Veritabanında aranıyor...', status: 'pending' },
    { id: 'filter', label: 'Sonuçlar filtreleniyor...', status: 'pending' },
    { id: 'rank', label: 'İlgi düzeyine göre sıralanıyor...', status: 'pending' }
  ]);

  // Preload components on mount
  useEffect(() => {
    preloadDashboardComponents();
  }, []);

  // Mock search results generator
  const generateMockResults = (query: string, count: number = 8) => {
    const courts = ['Yargıtay', 'Danıştay', 'Anayasa Mahkemesi', 'Bölge Adliye Mahkemesi'];
    const mockResults = [];
    
    for (let i = 1; i <= count; i++) {
      const randomCourt = courts[Math.floor(Math.random() * courts.length)];
      mockResults.push({
        id: `result-${i}`,
        title: `${query} ile İlgili ${randomCourt} Kararı ${i}`,
        court: randomCourt,
        department: `${Math.floor(Math.random() * 15) + 1}. Daire`,
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        summary: `${query} konusunda verilen bu karar, hukuki durumu detaylı şekilde ele almaktadır.`,
        relevanceScore: Math.round(Math.random() * 10 * 10) / 10,
        citationCount: Math.floor(Math.random() * 50),
        isNew: Math.random() > 0.8,
        isPopular: Math.random() > 0.7,
        keywords: ['hukuk', 'karar', 'emsal']
      });
    }
    return mockResults;
  };

  const handleSearch = async (query: string, filters: any = {}) => {
    if (!query.trim()) {
      toast.error('Lütfen bir arama terimi girin');
      return;
    }
    
    setIsSearching(true);
    setSearchQuery(query);
    const startTime = performance.now();
    
    // Reset loading steps
    setSearchLoadingSteps(steps => 
      steps.map(step => ({ ...step, status: 'pending' as const }))
    );
    
    try {
      // Simulate progressive loading steps
      for (let i = 0; i < searchLoadingSteps.length; i++) {
        setSearchLoadingSteps(prev => 
          prev.map((step, index) => 
            index === i ? { ...step, status: 'loading' as const } : step
          )
        );
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setSearchLoadingSteps(prev => 
          prev.map((step, index) => 
            index === i ? { ...step, status: 'completed' as const } : step
          )
        );
      }
      
      const results = generateMockResults(query, Math.floor(Math.random() * 20) + 8);
      setSearchResults(results);
      setTotalPages(Math.ceil(results.length / 6));
      setCurrentPage(1);
      
      const endTime = performance.now();
      setSearchTime((endTime - startTime) / 1000);
      
      toast.success(`${results.length} sonuç bulundu!`);
    } catch (error) {
      toast.error('Arama sırasında bir hata oluştu');
      setSearchLoadingSteps(prev => 
        prev.map(step => ({ ...step, status: 'error' as const }))
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ CENTRALIZED AUTH: ProtectedRoute zaten auth kontrolü yaptığı için burada sadece loading kontrolü yeterli
  if (!initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Dashboard hazırlanıyor...</div>
        </div>
      </div>
    );
  }

  const resultsPerPage = 6;
  const startIndex = (currentPage - 1) * resultsPerPage;
  const currentResults = searchResults.slice(startIndex, startIndex + resultsPerPage);

  // Subscription upgrade prompt - tüm kullanıcılar için basit gösterim
  const isFreePlan = true; // Şimdilik tüm kullanıcılar free plan

  return (
    <SimplifiedErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40">
        <DashboardHeader />

        <div className="flex h-[calc(100vh-4rem)]">
          {/* Fixed: Complete Dashboard UI with sidebar and search components */}
          {(sidebarOpen || !isMobile) && (
            <DashboardSidebarLazy
              onClose={() => setSidebarOpen(false)}
              searchResults={searchResults}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
          )}

          <main className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {!searchResults.length && !isSearching && (
                <div className="space-y-6">
                  <SearchCard onSearch={handleSearch} />
                  
                  {isFreePlan && (
                    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Crown className="h-5 w-5 text-primary" />
                          Premium'a Yükseltin
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Sınırsız arama, gelişmiş filtreler ve öncelikli destek için Premium'a geçin.
                        </p>
                        <Button 
                          onClick={() => navigate('/subscription')} 
                          className="bg-gradient-to-r from-primary to-primary/90"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Şimdi Yükseltin
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {(searchResults.length > 0 || isSearching) && (
                <SearchResultsLazy
                  results={currentResults}
                  totalResults={searchResults.length}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isLoading={isSearching}
                  searchTime={searchTime}
                  searchQuery={searchQuery}
                />
              )}
            </div>
          </main>
        </div>

        {isMobile && (
          <FloatingActionButton
            onSearchClick={() => setSidebarOpen(true)}
          />
        )}
      </div>
    </SimplifiedErrorBoundary>
  );
};

// Fixed: Proper default export for lazy loading compatibility
export default Dashboard;