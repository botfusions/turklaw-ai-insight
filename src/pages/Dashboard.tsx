import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  TrendingUp, 
  BookOpen, 
  Clock,
  Crown,
  ArrowRight,
  FileText,
  Calendar,
  Database,
  AlertCircle,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { canSearch, incrementSearchCount } = useAuth();
  const { stats, loading, error, user, profile } = useDashboard();
  
  const usagePercentage = profile ? (profile.monthly_search_count / profile.max_searches) * 100 : 0;

  const handleQuickSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (!canSearch()) {
        alert('Arama limitinize ulaştınız. Planınızı yükseltmeyi düşünün.');
        return;
      }
      await incrementSearchCount();
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Lütfen giriş yapın</h1>
            <Button onClick={() => navigate('/login')}>Giriş Yap</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Hoş geldiniz, {profile.full_name || user.email?.split('@')[0]}
          </h1>
          <p className="text-muted-foreground">
            Hukuki araştırmalarınıza buradan devam edebilirsiniz
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bu Ay Yapılan Arama</p>
                  <p className="text-2xl font-bold text-foreground">{stats.monthlySearches}</p>
                </div>
                <Search className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Kayıtlı Kararlar</p>
                  <p className="text-2xl font-bold text-foreground">{stats.savedCasesCount}</p>
                </div>
                <BookOpen className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Toplam Karar</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalCases.toLocaleString()}</p>
                </div>
                <Database className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aktif Plan</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-foreground capitalize">{profile.plan}</p>
                    {profile.plan === 'pro' && <Crown className="h-4 w-4 text-secondary" />}
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analytics Chart */}
            {stats.searchTrends.length > 0 && (
              <AnalyticsChart data={stats.searchTrends} />
            )}

            {/* Quick Search */}
            <Card className="bg-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-primary" />
                  Hızlı Arama
                </CardTitle>
                <CardDescription>
                  Yargıtay, Danıştay ve emsal kararlarında arama yapın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleQuickSearch} className="flex gap-2">
                  <Input
                    placeholder="Örn: tazminat, boşanma, sözleşme ihlali..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!canSearch()}>
                    Ara
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>
                {!canSearch() && (
                  <p className="text-sm text-warning mt-2">
                    Arama limitinize ulaştınız. Planınızı yükseltmeyi düşünün.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Searches */}
            <Card className="bg-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Son Aramalar
                </CardTitle>
                <CardDescription>
                  Son yaptığınız aramaları görüntüleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentSearches.length > 0 ? (
                    stats.recentSearches.map((search, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/search?q=${encodeURIComponent(search.query)}`)}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{search.query}</p>
                          <p className="text-sm text-muted-foreground">
                            {search.results_count || 0} sonuç • {new Date(search.search_date).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Henüz arama yapmadınız</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Stats */}
            <Card className="bg-card shadow-card">
              <CardHeader>
                <CardTitle>Kullanım İstatistikleri</CardTitle>
                <CardDescription>
                  Bu ayki arama limitiniz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Yapılan Arama</span>
                    <span>{profile.monthly_search_count}/{profile.max_searches}</span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                </div>
                
                {usagePercentage > 80 && (
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-sm text-warning-foreground">
                      Arama limitinizin %{Math.round(usagePercentage)}'ine ulaştınız
                    </p>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/pricing')}
                >
                  Planı Yükselt
                </Button>
              </CardContent>
            </Card>

            {/* Saved Cases */}
            <Card className="bg-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Kayıtlı Kararlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.savedCases.length > 0 ? (
                    stats.savedCases.map((savedCase, index) => (
                      <div 
                        key={index}
                        className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => navigate('/saved-cases')}
                      >
                        <p className="font-medium text-sm text-foreground line-clamp-2">
                          {savedCase.legal_cases?.title || 'Başlık bulunamadı'}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            {savedCase.legal_cases?.court || 'Bilinmeyen Mahkeme'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(savedCase.saved_at).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Henüz kayıtlı karar yok</p>
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => navigate('/saved-cases')}
                >
                  Tümünü Görüntüle
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card shadow-card">
              <CardHeader>
                <CardTitle>Hızlı İşlemler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/search')}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Gelişmiş Arama
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/profile')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Profil Ayarları
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}