import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Search as SearchIcon, 
  Filter, 
  Calendar, 
  Building2, 
  FileText,
  Bookmark,
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';

// Mock search results for demonstration
const mockResults = [
  {
    id: '1',
    title: 'Yargıtay 2. Hukuk Dairesi Kararı - İş Sözleşmesi Feshi',
    case_number: '2023/5678',
    court: 'Yargıtay 2. Hukuk Dairesi',
    department: 'Hukuk',
    decision_date: '2023-06-15',
    summary: 'İş sözleşmesinin feshinde geçerli neden bulunmaması durumunda işçinin kıdem ve ihbar tazminatı hakları...',
    keywords: ['iş sözleşmesi', 'fesih', 'kıdem tazminatı', 'ihbar tazminatı']
  },
  {
    id: '2',
    title: 'Danıştay 5. Dairesi Kararı - İdari Para Cezası',
    case_number: '2023/1234',
    court: 'Danıştay 5. Dairesi',
    department: 'İdare',
    decision_date: '2023-05-20',
    summary: 'İdari para cezasının ölçülülük ilkesi çerçevesinde değerlendirilmesi ve iptal koşulları...',
    keywords: ['idari para cezası', 'ölçülülük ilkesi', 'iptal']
  }
];

export default function Search() {
  const { profile, canSearch, incrementSearchCount } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedCases, setSavedCases] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Uyarı",
        description: "Lütfen bir arama terimi girin.",
        variant: "destructive",
      });
      return;
    }

    if (!canSearch()) {
      toast({
        title: "Arama Limiti Aşıldı",
        description: "Bu ay için arama limitinize ulaştınız. Premium plana geçerek daha fazla arama yapabilirsiniz.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Increment search count
      await incrementSearchCount();
      
      // Simulate API call
      setTimeout(() => {
        setResults(mockResults);
        setLoading(false);
        
        toast({
          title: "Arama Tamamlandı",
          description: `${mockResults.length} sonuç bulundu.`,
        });
      }, 1000);
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Hata",
        description: "Arama yapılırken bir hata oluştu.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const toggleSaveCase = (caseId: string) => {
    const newSavedCases = new Set(savedCases);
    if (newSavedCases.has(caseId)) {
      newSavedCases.delete(caseId);
      toast({
        title: "Kaldırıldı",
        description: "Karar kayıtlı listesinden kaldırıldı.",
      });
    } else {
      newSavedCases.add(caseId);
      toast({
        title: "Kaydedildi",
        description: "Karar kayıtlı listesine eklendi.",
      });
    }
    setSavedCases(newSavedCases);
  };

  const remainingSearches = profile ? profile.max_searches - profile.monthly_search_count : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
              <SearchIcon className="h-8 w-8 text-primary" />
              Karar Arama
            </h1>
            <p className="text-muted-foreground mt-2">
              Türkiye'nin en kapsamlı hukuki karar veri tabanında arama yapın
            </p>
          </div>

          {/* Search Limit Info */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">
                    Bu ay kalan arama hakkınız: {remainingSearches}
                  </span>
                </div>
                {remainingSearches <= 3 && (
                  <Button size="sm" variant="outline">
                    Plan Yükselt
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle>Arama Kriterleri</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Arama teriminizi girin... (örn: iş sözleşmesi feshi)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Arıyor...
                      </>
                    ) : (
                      <>
                        <SearchIcon className="h-4 w-4 mr-2" />
                        Ara
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Gelişmiş Filtreler
                  </Button>
                  <Button type="button" variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Tarih Aralığı
                  </Button>
                  <Button type="button" variant="outline" size="sm">
                    <Building2 className="h-4 w-4 mr-2" />
                    Mahkeme
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Arama Sonuçları ({results.length})
                </h2>
                <Button variant="outline" size="sm">
                  Sonuçları Dışa Aktar
                </Button>
              </div>

              {results.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight mb-2">
                          {result.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {result.case_number}
                          </Badge>
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {result.court}
                          </Badge>
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(result.decision_date).toLocaleDateString('tr-TR')}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleSaveCase(result.id)}
                      >
                        {savedCases.has(result.id) ? (
                          <BookmarkCheck className="h-4 w-4" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Özet
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {result.summary}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Anahtar Kelimeler</h4>
                      <div className="flex flex-wrap gap-1">
                        {result.keywords.map((keyword: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm">Tam Metni Görüntüle</Button>
                      <Button size="sm" variant="outline">PDF İndir</Button>
                      <Button size="sm" variant="outline">Benzer Kararlar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {results.length === 0 && !loading && (
            <Card className="text-center py-12">
              <CardContent>
                <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Arama yapmak için yukarıdaki formu kullanın</h3>
                <p className="text-muted-foreground">
                  Yargıtay, Danıştay, Anayasa Mahkemesi ve diğer yüksek mahkeme kararlarında arama yapın
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}