import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  Search, 
  TrendingUp, 
  BookOpen, 
  Clock,
  Crown,
  ArrowRight,
  FileText,
  Calendar
} from 'lucide-react';
import { mockUser } from '@/lib/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const user = mockUser;
  const usagePercentage = (user.searchCount / user.maxSearches) * 100;
  
  const recentSearches = [
    { query: 'tazminat davası', date: '2024-03-20', results: 45 },
    { query: 'boşanma işlemleri', date: '2024-03-19', results: 67 },
    { query: 'iş sözleşmesi feshi', date: '2024-03-18', results: 34 },
    { query: 'kira kontratı', date: '2024-03-17', results: 23 },
    { query: 'miras hukuku', date: '2024-03-16', results: 56 }
  ];

  const savedCases = [
    { title: 'Yargıtay 21. HD - İş Kazası Tazminatı', court: 'Yargıtay', date: '2024-03-15' },
    { title: 'Danıştay 6. D - İmar İzni İptali', court: 'Danıştay', date: '2024-03-10' },
    { title: 'Yargıtay 2. HD - Boşanma Davası', court: 'Yargıtay', date: '2024-03-08' }
  ];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Hoş geldiniz, {user.name}
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
                  <p className="text-2xl font-bold text-foreground">{user.searchCount}</p>
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
                  <p className="text-2xl font-bold text-foreground">{savedCases.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aktif Plan</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-foreground capitalize">{user.plan}</p>
                    {user.plan === 'pro' && <Crown className="h-4 w-4 text-secondary" />}
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Üyelik Süresi</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-xs text-muted-foreground">ay</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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
                  <Button type="submit">
                    Ara
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Searches */}
            <Card className="bg-card shadow-card">
              <CardHeader>
                <CardTitle>Son Aramalar</CardTitle>
                <CardDescription>
                  Son yaptığınız aramaları görüntüleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSearches.map((search, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/search?q=${encodeURIComponent(search.query)}`)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{search.query}</p>
                        <p className="text-sm text-muted-foreground">
                          {search.results} sonuç • {search.date}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
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
                    <span>{user.searchCount}/{user.maxSearches}</span>
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
                  {savedCases.map((case_, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <p className="font-medium text-sm text-foreground line-clamp-2">
                        {case_.title}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          {case_.court}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {case_.date}
                        </span>
                      </div>
                    </div>
                  ))}
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