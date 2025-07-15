import { useState } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';

export function DashboardPreview() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  
  const usagePercentage = profile ? (profile.monthly_search_count / profile.max_searches) * 100 : 0;
  const isPremiumUser = profile && !['free', 'basic'].includes(profile.plan);
  
  const mockRecentSearches = [
    { query: 'iş kazası tazminat', date: '2024-01-15', results: 24 },
    { query: 'boşanma nafaka', date: '2024-01-14', results: 18 },
    { query: 'sözleşme ihlali', date: '2024-01-13', results: 31 }
  ];

  const mockStats = {
    monthlySearches: profile?.monthly_search_count || 0,
    savedCases: 12,
    totalCases: 100000,
    activeSearches: 3
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickSearchQuery)}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Hoş geldiniz, {profile?.full_name || user?.email?.split('@')[0]}!
        </h2>
        <p className="text-muted-foreground">
          Hukuki araştırmalarınıza buradan hızlıca devam edebilirsiniz
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bu Ay</p>
                <p className="text-xl font-bold text-foreground">{mockStats.monthlySearches}</p>
              </div>
              <Search className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kayıtlı</p>
                <p className="text-xl font-bold text-foreground">{mockStats.savedCases}</p>
              </div>
              <BookOpen className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Toplam</p>
                <p className="text-xl font-bold text-foreground">{mockStats.totalCases.toLocaleString()}</p>
              </div>
              <Database className="h-6 w-6 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <div className="flex items-center gap-1">
                  <p className="text-lg font-semibold text-foreground capitalize">{profile?.plan}</p>
                  {isPremiumUser && <Crown className="h-4 w-4 text-secondary" />}
                </div>
              </div>
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card className="bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Aylık Kullanım</span>
            <Badge variant={usagePercentage > 80 ? "destructive" : "outline"}>
              {profile?.monthly_search_count || 0}/{profile?.max_searches || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={usagePercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {Math.round(usagePercentage)}% kullanıldı
          </p>
        </CardContent>
      </Card>

      {/* Quick Search */}
      <Card className="bg-card shadow-card">
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

      {/* Recent Searches */}
      <Card className="bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Son Aramalar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRecentSearches.map((search, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/search?q=${encodeURIComponent(search.query)}`)}
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{search.query}</p>
                  <p className="text-sm text-muted-foreground">
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
          onClick={() => navigate('/dashboard')}
          className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
        >
          <TrendingUp className="mr-2 h-5 w-5" />
          Tam Dashboard'a Git
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => navigate('/search')}
          className="text-lg px-8 py-6"
        >
          <Search className="mr-2 h-5 w-5" />
          Gelişmiş Arama
        </Button>
      </div>
    </div>
  );
}