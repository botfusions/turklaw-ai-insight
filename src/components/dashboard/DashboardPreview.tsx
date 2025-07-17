import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  BookOpen, 
  Scale, 
  Clock, 
  TrendingUp, 
  Database,
  Crown,
  ArrowRight,
  Activity,
  FileText
} from 'lucide-react';
import { useAuthData } from '@/contexts/AuthDataContext';

export function DashboardPreview() {
  const navigate = useNavigate();
  const { user, profile } = useAuthData();
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  
  // Memoized calculations for performance
  const isPremiumUser = useMemo(() => 
    profile && profile.plan === 'premium', 
    [profile?.plan]
  );
  
  const displayName = useMemo(() => 
    profile?.full_name || user?.email?.split('@')[0], 
    [profile?.full_name, user?.email]
  );

  const mockRecentSearches = useMemo(() => [
    { query: 'iş kazası tazminat', date: '2024-01-15', results: 24 },
    { query: 'boşanma nafaka', date: '2024-01-14', results: 18 },
    { query: 'sözleşme ihlali', date: '2024-01-13', results: 31 }
  ], []);

  const mockStats = useMemo(() => ({
    monthlySearches: 42,
    savedCases: 12,
    totalCases: 100000,
    activeSearches: 3
  }), []);

  const handleQuickSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickSearchQuery)}`);
    }
  }, [quickSearchQuery, navigate]);

  const handleSearchClick = useCallback((query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }, [navigate]);

  const handleDashboardClick = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const handleAdvancedSearchClick = useCallback(() => {
    navigate('/search');
  }, [navigate]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Hoş geldiniz, {displayName}!
        </h2>
        <p className="text-muted-foreground">
          Hukuki araştırmalarınıza buradan hızlıca devam edebilirsiniz
        </p>
      </div>

      {/* Quick Search - Moved to top */}
      <Card className="bg-card shadow-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-primary" />
            Hızlı Arama
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleQuickSearch} className="flex gap-2">
            <Input
              placeholder="Örn: iş kazası, boşanma, sözleşme ihlali..."
              value={quickSearchQuery}
              onChange={(e) => setQuickSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Ara
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Stats - Smaller */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="bg-card shadow-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Bu Ay</p>
                <p className="text-lg font-bold text-foreground">{mockStats.monthlySearches}</p>
              </div>
              <Search className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Kayıtlı</p>
                <p className="text-lg font-bold text-foreground">{mockStats.savedCases}</p>
              </div>
              <BookOpen className="h-5 w-5 text-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Toplam</p>
                <p className="text-lg font-bold text-foreground">{mockStats.totalCases.toLocaleString()}</p>
              </div>
              <Database className="h-5 w-5 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-card">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Plan</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-semibold text-foreground capitalize">{profile?.plan}</p>
                  {isPremiumUser && <Crown className="h-3 w-3 text-secondary" />}
                </div>
              </div>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Info */}
      <Card className="bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span>Mevcut Planınız</span>
            <Badge variant="outline" className="capitalize">
              {profile?.plan || 'Basic'} Plan
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-primary" />
              <span className="font-semibold">
                {profile?.plan === 'premium' ? 'Premium Özellikler Aktif' : 'Temel Plan Özelliklerini Kullanabilirsiniz'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sınırsız arama ile araştırmalarınızı yapın
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Searches - Compact */}
      <Card className="bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Activity className="h-5 w-5 mr-2" />
            Son Aramalar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockRecentSearches.map((search, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleSearchClick(search.query)}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{search.query}</p>
                  <p className="text-xs text-muted-foreground">
                    {search.results} sonuç • {new Date(search.date).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          size="lg" 
          onClick={handleDashboardClick}
          className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
        >
          <TrendingUp className="mr-2 h-5 w-5" />
          Tam Dashboard'a Git
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          onClick={handleAdvancedSearchClick}
          className="text-lg px-8 py-6"
        >
          <Search className="mr-2 h-5 w-5" />
          Gelişmiş Arama
        </Button>
      </div>
    </div>
  );
}