import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Search as SearchIcon, 
  Filter,
  Calendar,
  Building2,
  FileText,
  Bookmark,
  BookmarkCheck,
  Download,
  ExternalLink
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  case_number: string;
  court: string;
  department: string;
  decision_date: string;
  summary: string;
  keywords: string[];
  category: string;
  subcategory: string;
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Yargıtay 2. Hukuk Dairesi Kararı - İş Sözleşmesi Feshi',
    case_number: '2023/5678',
    court: 'Yargıtay 2. Hukuk Dairesi',
    department: 'Hukuk',
    decision_date: '2023-06-15',
    summary: 'İş sözleşmesinin feshinde geçerli neden bulunmaması durumunda işçinin kıdem ve ihbar tazminatı hakları...',
    keywords: ['iş sözleşmesi', 'fesih', 'kıdem tazminatı', 'ihbar tazminatı'],
    category: 'yargi',
    subcategory: 'yargitay'
  },
  {
    id: '2',
    title: 'Danıştay 5. Dairesi Kararı - İdari Para Cezası',
    case_number: '2023/1234',
    court: 'Danıştay 5. Dairesi',
    department: 'İdare',
    decision_date: '2023-05-20',
    summary: 'İdari para cezasının ölçülülük ilkesi çerçevesinde değerlendirilmesi ve iptal koşulları...',
    keywords: ['idari para cezası', 'ölçülülük ilkesi', 'iptal'],
    category: 'yargi',
    subcategory: 'danistay'
  }
];

interface SearchContentProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  className?: string;
}

export function SearchContent({ selectedCategory, selectedSubcategory, className }: SearchContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedCases, setSavedCases] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { profile, canSearch, incrementSearchCount } = useAuth();

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

    if (!selectedCategory) {
      toast({
        title: "Uyarı",
        description: "Lütfen bir kategori seçin.",
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
      
      // Filter results based on selected category and subcategory
      let filteredResults = mockResults.filter(result => {
        if (selectedCategory && result.category !== selectedCategory) return false;
        if (selectedSubcategory && result.subcategory !== selectedSubcategory) return false;
        return true;
      });
      
      // Simulate API call
      setTimeout(() => {
        setResults(filteredResults);
        setLoading(false);
        
        toast({
          title: "Arama Tamamlandı",
          description: `${filteredResults.length} sonuç bulundu.`,
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

  return (
    <div className={cn("flex-1 h-full overflow-hidden", className)}>
      <div className="h-full flex flex-col">
        {/* Search Header */}
        <div className="p-6 bg-white/70 backdrop-blur-sm border-b border-white/20 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Arama teriminizi girin... (örn: iş sözleşmesi feshi)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-white/90 border-white/20 shadow-sm rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                />
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="h-12 px-8 bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Arıyor...
                  </>
                ) : (
                  <>
                    <SearchIcon className="h-5 w-5 mr-2" />
                    Ara
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" className="bg-white/70 border-white/20 hover:bg-white/90">
                <Filter className="h-4 w-4 mr-2" />
                Gelişmiş Filtreler
              </Button>
              <Button type="button" variant="outline" size="sm" className="bg-white/70 border-white/20 hover:bg-white/90">
                <Calendar className="h-4 w-4 mr-2" />
                Tarih Aralığı
              </Button>
              <Button type="button" variant="outline" size="sm" className="bg-white/70 border-white/20 hover:bg-white/90">
                <Building2 className="h-4 w-4 mr-2" />
                Mahkeme
              </Button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {results.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Arama Sonuçları ({results.length})
                </h2>
                <Button variant="outline" size="sm" className="bg-white/70 border-white/20 hover:bg-white/90">
                  <Download className="h-4 w-4 mr-2" />
                  Sonuçları Dışa Aktar
                </Button>
              </div>

              {results.map((result) => (
                <Card key={result.id} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white/90 rounded-xl">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight mb-3 text-foreground">
                          {result.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="text-xs bg-white/70 border-white/20">
                            {result.case_number}
                          </Badge>
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {result.court}
                          </Badge>
                          <Badge variant="outline" className="text-xs flex items-center gap-1 bg-white/70 border-white/20">
                            <Calendar className="h-3 w-3" />
                            {new Date(result.decision_date).toLocaleDateString('tr-TR')}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleSaveCase(result.id)}
                        className="bg-white/70 border-white/20 hover:bg-white/90"
                      >
                        {savedCases.has(result.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-1 text-foreground">
                        <FileText className="h-4 w-4" />
                        Özet
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {result.summary}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2 text-foreground">Anahtar Kelimeler</h4>
                      <div className="flex flex-wrap gap-1">
                        {result.keywords.map((keyword: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs bg-white/70 border-white/20">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-white">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Tam Metni Görüntüle
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white/70 border-white/20 hover:bg-white/90">
                        <Download className="h-4 w-4 mr-2" />
                        PDF İndir
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white/70 border-white/20 hover:bg-white/90">
                        Benzer Kararlar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-white/20 shadow-lg rounded-xl max-w-md">
                <CardContent>
                  <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {selectedCategory ? 'Arama yapmak için yukarıdaki formu kullanın' : 'Kategori seçin ve arama yapın'}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedCategory 
                      ? 'Seçtiğiniz kategori içinde arama yapmak için arama teriminizi girin'
                      : 'Sol menüden bir kategori seçin ve arama teriminizi girin'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}