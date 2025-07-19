import React, { useState, useEffect } from 'react'; // ÖNEMLİ: useEffect'i react'ten import ediyoruz.
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
import { 
  DashboardSidebarLazy, 
  SearchResultsLazy, 
  preloadDashboardComponents 
} from "@/components/dashboard/LazyDashboardComponents";

const Dashboard = () => {
  const { user, profile, initialized } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // ... (Diğer state'leriniz burada aynı kalabilir, onlarda sorun yok)
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTime, setSearchTime] = useState(0);
  const [searchLoadingSteps, setSearchLoadingSteps] = useState<{ id: string; label: string; status: 'pending' | 'loading' | 'completed' | 'error'; }[]>([]);


  // YENİ VE DOĞRU YÖNTEM: Yetkilendirme kontrolü için useEffect
  // Bu hook, bileşen render edildikten SONRA çalışır.
  useEffect(() => {
    // 1. Auth hook'unun ilk kontrolü bitirmesini bekliyoruz (initialized === true).
    // Bu olmadan kontrol yaparsak, erken yönlendirme riski devam eder.
    if (initialized) {
      // 2. Kontrol bittikten sonra, eğer kullanıcı hala yoksa,
      // bu, kullanıcının gerçekten giriş yapmadığı anlamına gelir.
      if (!user) {
        toast.info("Devam etmek için lütfen giriş yapın.");
        // 3. Artık güvenle yönlendirme yapabiliriz.
        navigate('/login');
      }
    }
  }, [initialized, user, navigate]); // Bu effect, bu değerler değiştiğinde yeniden çalışır.


  // Preload components on mount
  useEffect(() => {
    preloadDashboardComponents();
  }, []);

  // ... (handleSearch, generateMockResults, handlePageChange fonksiyonlarınız burada aynı kalabilir)
  const handleSearch = async (query: string, filters: any = {}) => {
    // ... (bu fonksiyonun içeriği doğru)
  };
  const handlePageChange = (page: number) => {
    // ... (bu fonksiyonun içeriği doğru)
  };


  // 1. ADIM: Auth hook'u hazır olana kadar bekleme ekranı gösterilir.
  // Bu kontrol doğru ve kalmalı. Mesajı daha anlamlı hale getirelim.
  if (!initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Yetkilendirme kontrol ediliyor...</div>
        </div>
      </div>
    );
  }
  
  
  const resultsPerPage = 6;
  const startIndex = (currentPage - 1) * resultsPerPage;
  const currentResults = searchResults.slice(startIndex, startIndex + resultsPerPage);
  const currentPlan = profile?.plan || 'free';
  const isFreePlan = currentPlan === 'free';

  return (
    <SimplifiedErrorBoundary>
      {/* ... KODUNUZUN GERİ KALANI BURADA HİÇBİR DEĞİŞİKLİK OLMADAN YER ALACAK ... */}
      {/* Bu JSX kısmında herhangi bir sorun yoktu, o yüzden olduğu gibi kullanabilirsiniz. */}
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
                  
                  {isSearching && (
                    <div className="flex justify-center">
                      {/* ... Arama adımları ... */}
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
                          {currentPlan === 'premium' && <Crown className="h-5 w-5 text-yellow-500" />}
                          <span className="font-medium">
                            {currentPlan === 'free' && 'Ücretsiz Plan'}
                            {currentPlan === 'premium' && 'Premium Plan'}
                          </span>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {currentPlan === 'free' && 'Temel özelliklere erişim'}
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
        
        {isMobile && <FloatingActionButton onSearch={handleSearch} />}
        
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
