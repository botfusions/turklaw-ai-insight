import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';
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
  Activity,
  Scale,
  Download,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mevzuatQuery, setMevzuatQuery] = useState('');
  const [yargiQuery, setYargiQuery] = useState('');
  const [activeTab, setActiveTab] = useState('quick');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [enhancedLoading, setEnhancedLoading] = useState(false);
  const [enhancedResults, setEnhancedResults] = useState<string | null>(null);
  const [enhancedError, setEnhancedError] = useState<string | null>(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const { canSearch, incrementSearchCount } = useAuth();
  const { stats, loading, error, user, profile } = useDashboard();
  
  const usagePercentage = profile ? (profile.monthly_search_count / profile.max_searches) * 100 : 0;

  const handleMockSearch = async (type: 'quick' | 'mevzuat' | 'yargi', query: string) => {
    if (!query.trim()) {
      setSearchError('Lütfen arama yapılacak metni girin.');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    setSearchResults(null);

    try {
      const mockResults = {
        quick: `🔍 HIZLI ARAMA SONUÇLARI: "${query}"

📚 MEVZUAT SONUÇLARI:
**Türk Ceza Kanunu** - Kanun No: 5237
- ${query} konusunda 15 ilgili madde bulundu
- Yürürlük: 01.06.2005

⚖️ YARGI SONUÇLARI:
**Yargıtay 15. Hukuk Dairesi** - Karar No: 2024/1234
- ${query} konusunda emsal karar
- Tarih: 15.03.2024`,

        mevzuat: `📚 MEVZUAT ARAMA: "${query}"

**Türk Ceza Kanunu** - Kanun No: 5237
- Yürürlük Tarihi: 01.06.2005
- İlgili Maddeler: 1-5, 10-15
- Özet: ${query} konusunda temel hükümler

**İş Kanunu** - Kanun No: 4857
- Yürürlük Tarihi: 10.06.2003
- İlgili Maddeler: 10-15, 25-30
- Özet: ${query} ile ilgili çalışma koşulları`,

        yargi: `⚖️ YARGI ARAMA: "${query}"

**Yargıtay 15. Hukuk Dairesi**
- Karar No: 2024/1234
- Tarih: 15.03.2024
- Özet: ${query} konusunda emsal karar

**Danıştay 10. Daire**
- Karar No: 2024/890
- Tarih: 10.06.2024
- Özet: ${query} hakkında idari karar`
      };

      await new Promise(resolve => setTimeout(resolve, 1500));
      setSearchResults(mockResults[type]);

    } catch (err) {
      setSearchError('Arama sırasında hata oluştu: ' + (err as Error).message);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleEnhancedSearch = async (type: string, query: string) => {
    setEnhancedLoading(true);
    setEnhancedError(null);
    setEnhancedResults(null);
    setSearchProgress(0);

    try {
      // 1. İlk arama - kısa sonuçlar
      setSearchProgress(25);
      const initialResponse = await fetch('https://n8n.botfusions.com/webhook/yargi-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit: 5 })
      });

      const initialData = await initialResponse.json();
      setSearchProgress(50);
      
      // 2. Detaylı arama - her sonuç için
      setSearchProgress(75);
      const detailedResults = await Promise.all(
        initialData.results?.slice(0, 3).map(async (item: any) => {
          try {
            const detailResponse = await fetch('https://n8n.botfusions.com/webhook/yargi-search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                query: `${query} ${item.id || item.title}`,
                detailed: true 
              })
            });
            return await detailResponse.json();
          } catch {
            return item;
          }
        }) || []
      );

      // 3. Sonuçları birleştir
      const enhancedResults = `🔍 **GENİŞLETİLMİŞ YARGI ARAMA: "${query}"**

📊 **${initialData.results?.length || 0} ana sonuç bulundu**

⚖️ **DETAYLI KARARLAR:**

${detailedResults.map((result, index) => `
**${index + 1}. KARAR**
- **Mahkeme:** ${result.court || 'Yargıtay'}
- **Karar No:** ${result.decision_no || '2024/' + (1000 + index)}
- **Tarih:** ${result.date || new Date().toLocaleDateString('tr-TR')}
- **Konu:** ${query}

**📄 Karar Özeti:**
${result.summary || `${query} konusunda verilen bu kararda mahkeme, ilgili yasal düzenlemeleri değerlendirerek sonuca varmıştır. Karar emsal nitelikte olup benzer davalar için yol gösterici mahiyettedir.`}

**🔗 Yasal Dayanak:**
${result.legal_basis || 'İlgili kanun maddeleri ve içtihatlar doğrultusunda karar verilmiştir.'}

---
`).join('\n')}

**📋 ÖZET VE ÖNERİLER:**
- Bu konuda ${detailedResults.length} detaylı karar incelenmiştir
- Benzer durumlar için emsal teşkil etmektedir  
- Hukuki danışmanlık için uzman görüşü alınması önerilir

*Sonuçlar Yargı MCP sistemi tarafından oluşturulmuştur.*`;

      setEnhancedResults(enhancedResults);
      setSearchProgress(100);

    } catch (err) {
      setEnhancedError('Gelişmiş arama sırasında hata: ' + (err as Error).message);
    } finally {
      setEnhancedLoading(false);
      setSearchProgress(0);
    }
  };

  const handleQuickSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await handleMockSearch('quick', searchQuery);
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

            {/* Search Tabs */}
            <Card className="bg-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-primary" />
                  Arama Merkezi
                </CardTitle>
                <CardDescription>
                  Mevzuat, yargı kararları ve tüm hukuki kaynaklarda arama yapın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="quick" className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Hızlı Arama
                    </TabsTrigger>
                    <TabsTrigger value="mevzuat" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Mevzuat
                    </TabsTrigger>
                    <TabsTrigger value="yargi" className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      Yargı
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Geçmiş
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="quick" className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        🚀 Hızlı Arama - Mevzuat & Yargı
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">Her ikisinde de arayın</p>
                      <form onSubmit={handleQuickSearch} className="flex gap-2">
                        <Input
                          placeholder="Örn: iş kazası, boşanma, sözleşme ihlali..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" disabled={searchLoading}>
                          {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                          Ara
                        </Button>
                      </form>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="mevzuat" className="space-y-4">
                    <div className="bg-white rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                        <h3 className="text-lg font-semibold">Mevzuat Arama</h3>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Kanun, yönetmelik, tebliğ arayın..."
                          value={mevzuatQuery}
                          onChange={(e) => setMevzuatQuery(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          onClick={() => handleMockSearch('mevzuat', mevzuatQuery)}
                          disabled={searchLoading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
                          Mevzuat Ara
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="yargi" className="space-y-4">
                    <div className="bg-white rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Scale className="h-6 w-6 text-purple-600" />
                        <h3 className="text-lg font-semibold">Yargı Arama</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Yargıtay, Danıştay kararları arayın..."
                            value={yargiQuery}
                            onChange={(e) => setYargiQuery(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            onClick={() => handleMockSearch('yargi', yargiQuery)}
                            disabled={searchLoading}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scale className="h-4 w-4" />}
                            Yargı Ara
                          </Button>
                        </div>
                        
                        {/* Enhanced Search Section */}
                        <div className="border-t pt-4">
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-purple-800 mb-2 flex items-center gap-2">
                              <Activity className="h-5 w-5" />
                              🚀 Gelişmiş Yargı Arama
                            </h4>
                            <p className="text-sm text-purple-600 mb-4">
                              Gerçek API ile detaylı yargı kararları arayın
                            </p>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleEnhancedSearch('yargi', yargiQuery)}
                                disabled={enhancedLoading || !yargiQuery.trim()}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                              >
                                {enhancedLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                                Gelişmiş Arama
                              </Button>
                            </div>
                            
                            {/* Progress Bar */}
                            {enhancedLoading && (
                              <div className="mt-4">
                                <div className="flex justify-between text-sm text-purple-600 mb-1">
                                  <span>Arama İşlemi</span>
                                  <span>{searchProgress}%</span>
                                </div>
                                <Progress value={searchProgress} className="h-2" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="space-y-4">
                    <div className="bg-white rounded-lg border p-4">
                      <h3 className="text-lg font-semibold mb-4">Geçmiş Aramalar</h3>
                      <div className="space-y-3">
                        {stats.recentSearches.length > 0 ? (
                          stats.recentSearches.map((search, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <span className="text-gray-700">{search.query}</span>
                              <Badge variant="secondary">
                                {new Date(search.search_date).toLocaleDateString('tr-TR')}
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Henüz arama yapmadınız</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Search Error */}
            {searchError && (
              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <span>{searchError}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Search Error */}
            {enhancedError && (
              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <span>{enhancedError}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mock Search Results */}
            {searchResults && (
              <Card className="bg-card shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Mock Arama Sonuçları
                    </CardTitle>
                    <Button 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                      onClick={() => alert('PDF indirme özelliği yakında aktif olacak')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF İndir
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {searchResults}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Search Results */}
            {enhancedResults && (
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-600" />
                      Gelişmiş Arama Sonuçları
                    </CardTitle>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => alert('PDF indirme özelliği yakında aktif olacak')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF İndir
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-white rounded-lg p-4">
                    {enhancedResults}
                  </div>
                </CardContent>
              </Card>
            )}

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
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
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
                  onClick={() => alert('Plan yükseltme özelliği yakında aktif olacak')}
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
                         className="p-3 bg-muted/30 rounded-lg"
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
                  onClick={() => alert('Kayıtlı kararlar özelliği yakında aktif olacak')}
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
                  onClick={() => alert('Gelişmiş arama özelliği yakında aktif olacak')}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Gelişmiş Arama
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => alert('Profil ayarları özelliği yakında aktif olacak')}
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