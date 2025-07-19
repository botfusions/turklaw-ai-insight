
import React, { useState } from 'react';
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

const Dashboard = () => {
  const { user, profile, initialized } = useAuth();
  const navigate = useNavigate();
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
  React.useEffect(() => {
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

  // Loading state
  if (!initialized) {
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

  const resultsPerPage = 6;
  const startIndex = (currentPage - 1) * resultsPerPage;
  const currentResults = searchResults.slice(startIndex, startIndex + resultsPerPage);

  // Subscription upgrade prompt
  const currentPlan = profile?.plan || 'free';
  const isFreePlan = currentPlan === 'free';

  return (
    <SimplifiedErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40">
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          showMenuButton={isMobile} 
        />
        
        <div className="dashboard-layout">
          <DashboardSidebarLazy 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            isMobile={isMobile}
            onSearch={handleSearch}
          />
          
          <main className="dashboard-main">
            <div className="dashboard-content">
              {/* Subscription Upgrade Banner for Free Users */}
              {isFreePlan && (
                <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Crown className="h-5 w-5 text-primary" />
                      Premium Özellikleri Keşfedin
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Gelişmiş arama filtreleri, sınırsız erişim ve premium destek için planınızı yükseltin.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate('/subscription')}
                        >
                          Planları Görüntüle
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => navigate('/subscription')}
                        >
                          Premium'a Geç
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Search and Results */}
                <div className="lg:col-span-2 space-y-6">
                  <SearchCard onSearch={handleSearch} />
                  
                  {/* Progressive Loading Display */}
                  {isSearching && (
                    <div className="flex justify-center">
                      <div className="w-full max-w-md">
                        <div className="space-y-3">
                          {searchLoadingSteps.map((step) => (
                            <div key={step.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                              <div className={`w-3 h-3 rounded-full ${
                                step.status === 'loading' ? 'bg-primary animate-pulse' :
                                step.status === 'completed' ? 'bg-green-500' :
                                step.status === 'error' ? 'bg-red-500' :
                                'bg-muted-foreground/30'
                              }`} />
                              <span className={`text-sm ${
                                step.status === 'loading' ? 'text-primary font-medium' :
                                step.status === 'completed' ? 'text-green-600' :
                                step.status === 'error' ? 'text-red-600' :
                                'text-muted-foreground'
                              }`}>
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <SearchResultsLazy
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
                
                {/* Right Column - Plan Info */}
                <div className="hidden lg:block space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Mevcut Planınız</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          {currentPlan === 'free' && <Zap className="h-5 w-5 text-blue-500" />}
                          {currentPlan === 'basic' && <Zap className="h-5 w-5 text-green-500" />}
                          {currentPlan === 'premium' && <Crown className="h-5 w-5 text-yellow-500" />}
                          <span className="font-medium">
                            {currentPlan === 'free' && 'Ücretsiz Plan'}
                            {currentPlan === 'basic' && 'Temel Plan'}
                            {currentPlan === 'premium' && 'Premium Plan'}
                          </span>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {currentPlan === 'free' && 'Temel özelliklere erişim'}
                          {currentPlan === 'basic' && 'Gelişmiş özellikler'}
                          {currentPlan === 'premium' && 'Gelişmiş özellikler ve sınırsız arama'}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate('/subscription')}
                        >
                          Plan Yönetimi
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
        
        {/* Mobile FAB */}
        {isMobile && (
          <FloatingActionButton
            onSearch={handleSearch}
            onVoiceSearchClick={() => console.log('Voice search')}
            onFilterClick={() => console.log('Filters')}
          />
        )}
        
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </SimplifiedErrorBoundary>
  );
};

export default Dashboard;
