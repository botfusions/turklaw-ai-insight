import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSearchHistoryDB } from '@/components/search/hooks/useSearchHistoryDB';
import { SearchHistoryPanel } from '@/components/search/components/SearchHistoryPanel';
import { SearchHistoryDropdown } from '@/components/search/components/SearchHistoryDropdown';
import { searchService, SearchResult } from '@/components/search/HybridSearchService';
import { 
  Search as SearchIcon, 
  Filter,
  Calendar,
  Building2,
  FileText,
  Bookmark,
  BookmarkCheck,
  Download,
  ExternalLink,
  Star,
  History
} from 'lucide-react';


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
  onDataSourceChange?: (source: 'cache' | 'api' | 'static' | 'error') => void;
  className?: string;
}

export function SearchContent({ selectedCategory, selectedSubcategory, onDataSourceChange, className }: SearchContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedCases, setSavedCases] = useState<Set<string>>(new Set());
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToHistory } = useSearchHistoryDB();

  const handleHistorySelect = (query: string) => {
    setSearchQuery(query);
  };

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

    if (!selectedCategory || !selectedSubcategory) {
      toast({
        title: "Uyarı",
        description: "Lütfen bir kategori ve alt kategori seçin.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await searchService.search(selectedCategory, selectedSubcategory, searchQuery);
      
      setResults(response.data.results);
      onDataSourceChange?.(response.source);
      
      // Save to database-integrated history
      await addToHistory(
        searchQuery, 
        response.data.results.length, 
        response.source as any,
        response.responseTime,
        {
          category: selectedCategory,
          subcategory: selectedSubcategory
        }
      );
      
      toast({
        title: "Arama Tamamlandı",
        description: `${response.data.results.length} sonuç bulundu (${response.responseTime}ms).`,
      });
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Hata",
        description: "Arama yapılırken bir hata oluştu.",
        variant: "destructive",
      });
      onDataSourceChange?.('error');
    } finally {
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

  const downloadPDF = (result: SearchResult) => {
    toast({
      title: "🔐 Premium Özellik",
      description: "PDF indirme için premium hesaba yükseltme gerekiyor!",
      variant: "destructive",
    });
  };

  return (
    <div className={cn("flex-1 h-full overflow-hidden", className)}>
      <div className="h-full flex flex-col">
        {/* Search Header */}
        <div className="p-6 bg-white border-b border-gray-200 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Arama teriminizi girin... (örn: iş sözleşmesi feshi)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-white border-gray-200 shadow-sm rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                />
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              
              <SearchHistoryDropdown 
                onSelectQuery={handleHistorySelect}
                className="hidden md:block"
              />
              
              <Button 
                type="submit" 
                disabled={loading}
                className="h-12 px-8 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
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
              <Button type="button" variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Gelişmiş Filtreler
              </Button>
              <Button type="button" variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                <Calendar className="h-4 w-4 mr-2" />
                Tarih Aralığı
              </Button>
              <Button type="button" variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                <Building2 className="h-4 w-4 mr-2" />
                Mahkeme
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="bg-white border-gray-200 hover:bg-gray-50 md:hidden"
                onClick={() => setShowHistoryPanel(!showHistoryPanel)}
              >
                <History className="h-4 w-4 mr-2" />
                Geçmiş
              </Button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex gap-6 p-6">
            {/* Search History Sidebar - Desktop */}
            <div className="hidden xl:block w-80 space-y-4">
              <SearchHistoryPanel onSelectQuery={handleHistorySelect} />
            </div>
            
            {/* Mobile Search History Panel */}
            {showHistoryPanel && (
              <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowHistoryPanel(false)}>
                <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl p-4" onClick={(e) => e.stopPropagation()}>
                  <SearchHistoryPanel onSelectQuery={handleHistorySelect} />
                </div>
              </div>
            )}

            {/* Main Results Area */}
            <div className="flex-1 space-y-4 xl:max-w-[calc(100%-320px)]">
              {results.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Arama Sonuçları ({results.length})
                    </h2>
                    <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                      <Download className="h-4 w-4 mr-2" />
                      Sonuçları Dışa Aktar
                    </Button>
                  </div>

                  {results.map((result) => (
                    <Card key={result.id} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50 rounded-lg">
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
                        className="bg-white border-gray-200 hover:bg-gray-50"
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
                          <Badge key={index} variant="outline" className="text-xs bg-white border-gray-200">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Tam Metni Görüntüle
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 border-none"
                        onClick={() => downloadPDF(result)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        PDF İndir
                        <Star className="h-3 w-3 ml-1" />
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                        Benzer Kararlar
                      </Button>
                    </div>
                  </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <Card className="text-center py-12 bg-white border-gray-200 shadow-sm rounded-lg max-w-md">
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
      </div>
    </div>
  );
}