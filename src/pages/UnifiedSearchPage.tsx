import React, { useState, useCallback } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from '@/hooks/use-toast';
import { SimplifiedErrorBoundary } from "@/components/ui/SimplifiedErrorBoundary";
import { UnifiedSearchForm, CourtSystem } from "@/components/search/UnifiedSearchForm";
import { SearchResults } from "@/components/search/SearchResults";
import { DocumentViewer } from "@/components/document/DocumentViewer";
import { legalApi, searchHelpers, SearchResult, SearchResponse, DocumentContent } from "@/services/legalApiService";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scale } from 'lucide-react';
import { clsx } from 'clsx';

interface SearchFormData {
  query: string;
  courtSystem: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
  filters?: Record<string, any>;
}

const UnifiedSearchPage = () => {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Search state
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentCourtSystem, setCurrentCourtSystem] = useState<CourtSystem>('bedesten');
  
  // Document viewer state
  const [selectedDocument, setSelectedDocument] = useState<{
    result: SearchResult;
    content: DocumentContent;
  } | null>(null);
  const [documentLoading, setDocumentLoading] = useState(false);
  
  // Favorites
  const [favorites, setFavorites] = useState<string[]>([]);

  // Loading state
  if (authLoading) {
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

  // Handle search
  const handleSearch = useCallback(async (data: SearchFormData) => {
    setLoading(true);
    setError(null);
    setCurrentQuery(data.query);
    setCurrentCourtSystem(data.courtSystem as CourtSystem);
    
    try {
      let results: SearchResponse;
      
      switch (data.courtSystem) {
        case 'bedesten':
          results = await searchHelpers.searchAllCourts(data.query, {
            courts: data.filters?.courtTypes || ['YARGITAYKARARI', 'DANISTAYKARAR'],
            dateStart: data.dateRange?.start,
            dateEnd: data.dateRange?.end,
            page: 1
          });
          break;
          
        case 'anayasa':
          const anayasaResults = await legalApi.searchAnayasa({
            decision_type: data.filters?.decisionType || 'bireysel_basvuru',
            keywords: [data.query],
            decision_start_date: data.dateRange?.start,
            decision_end_date: data.dateRange?.end,
            page_to_fetch: 1
          });
          results = formatAnayasaResults(anayasaResults, data.query);
          break;
          
        case 'mevzuat':
          const mevzuatResults = await legalApi.searchMevzuat({
            mevzuat_adi: data.query,
            mevzuat_turleri: data.filters?.legislationTypes,
            page_number: 1,
            page_size: 10
          });
          results = formatMevzuatResults(mevzuatResults, data.query);
          break;
          
        case 'emsal':
          const emsalResults = await legalApi.searchEmsal({
            keyword: data.query,
            start_date: data.dateRange?.start,
            end_date: data.dateRange?.end,
            page_number: 1
          });
          results = formatEmsalResults(emsalResults, data.query);
          break;
          
        default:
          results = await searchHelpers.searchAllCourts(data.query);
          break;
      }
      
      setSearchResults(results);
      setHasSearched(true);
      
      toast({
        title: "Arama Tamamlandı",
        description: `${results.results.length} sonuç bulundu`,
      });
      
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Arama sırasında bir hata oluştu');
      toast({
        title: "Hata",
        description: "Arama yapılırken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Handle result click - load document
  const handleResultClick = useCallback(async (result: SearchResult) => {
    setDocumentLoading(true);
    
    try {
      let content: DocumentContent;
      
      switch (currentCourtSystem) {
        case 'bedesten':
          content = await legalApi.getBedestenDocument(result.id);
          break;
        case 'emsal':
          content = await legalApi.getEmsalDocument(result.id);
          break;
        case 'mevzuat':
          // For mevzuat, we need both structure and article content
          const structure = await legalApi.getMevzuatStructure(result.id);
          if (structure.articles && structure.articles.length > 0) {
            content = await legalApi.getMevzuatArticle(result.id, structure.articles[0].id);
          } else {
            content = { markdown_content: result.summary || result.title, source_url: result.url };
          }
          break;
        default:
          content = { markdown_content: result.summary || result.title, source_url: result.url };
          break;
      }
      
      setSelectedDocument({
        result,
        content: {
          markdown: content.markdown_content || content.source_url || result.summary || '',
          plainText: content.markdown_content?.replace(/[#*_`~]/g, '') || result.summary || '',
          sections: []
        }
      });
      
    } catch (err) {
      console.error('Document load error:', err);
      toast({
        title: "Hata",
        description: "Belge yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setDocumentLoading(false);
    }
  }, [currentCourtSystem, toast]);

  // Handle favorites
  const handleFavorite = useCallback((resultId: string) => {
    setFavorites(prev => 
      prev.includes(resultId) 
        ? prev.filter(id => id !== resultId)
        : [...prev, resultId]
    );
  }, []);

  // Format different API responses to SearchResponse
  const formatAnayasaResults = (data: any, query: string): SearchResponse => ({
    results: (data.results || []).map((item: any) => ({
      id: item.id || '',
      title: item.title || 'Anayasa Mahkemesi Kararı',
      court: 'Anayasa Mahkemesi',
      chamber: item.chamber,
      date: item.date || '',
      summary: item.summary || item.content || '',
      caseNumber: item.case_number,
      decisionNumber: item.decision_number,
      documentType: 'Anayasa Mahkemesi Kararı',
      url: item.url,
    })),
    total_records: data.total || 0,
    requested_page: 1,
    page_size: 10,
    query
  });

  const formatMevzuatResults = (data: any, query: string): SearchResponse => ({
    results: (data.results || []).map((item: any) => ({
      id: item.id || '',
      title: item.title || 'Mevzuat',
      court: 'Türk Mevzuatı',
      date: item.publication_date || item.date || '',
      summary: item.summary || item.description || '',
      documentType: item.type || 'Mevzuat',
      url: item.url,
    })),
    total_records: data.total || 0,
    requested_page: 1,
    page_size: 10,
    query
  });

  const formatEmsalResults = (data: any, query: string): SearchResponse => ({
    results: (data.results || []).map((item: any) => ({
      id: item.id || '',
      title: item.title || 'Emsal Karar',
      court: item.court || 'Emsal Mahkeme',
      chamber: item.chamber,
      date: item.date || '',
      summary: item.summary || '',
      caseNumber: item.case_number,
      decisionNumber: item.decision_number,
      documentType: 'Emsal Karar',
      url: item.url,
    })),
    total_records: data.total || 0,
    requested_page: 1,
    page_size: 10,
    query
  });

  // Show document viewer
  if (selectedDocument) {
    return (
      <SimplifiedErrorBoundary>
        <div className="min-h-screen bg-background">
          <DocumentViewer
            metadata={{
              ...selectedDocument.result,
              courtSystem: currentCourtSystem,
              keywords: [],
              relatedDocuments: []
            }}
            content={selectedDocument.content}
            loading={documentLoading}
            onBack={() => setSelectedDocument(null)}
            onFavorite={handleFavorite}
            isFavorite={favorites.includes(selectedDocument.result.id)}
            className="container mx-auto py-6"
          />
        </div>
      </SimplifiedErrorBoundary>
    );
  }

  return (
    <SimplifiedErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-white border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Scale size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Turkish Legal AI</h1>
                <p className="text-sm text-muted-foreground">Türk Hukuk Yapay Zeka Platformu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-8">
            {/* Search Form */}
            <UnifiedSearchForm
              onSearch={handleSearch}
              loading={loading}
            />

            {/* Search Results */}
            {(hasSearched || loading) && (
              <SearchResults
                results={searchResults || { results: [], total_records: 0, requested_page: 1, page_size: 10, query: currentQuery }}
                loading={loading}
                error={error}
                hasSearched={hasSearched}
                query={currentQuery}
                courtSystem={currentCourtSystem}
                onResultClick={handleResultClick}
                onFavorite={handleFavorite}
                favorites={favorites}
              />
            )}

            {/* Welcome Message */}
            {!hasSearched && !loading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Scale size={48} className="text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    Türk Hukuk Sisteminde Arama Yapın
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Yargıtay, Danıştay, Anayasa Mahkemesi ve diğer mahkeme kararları ile
                    Türk mevzuatında kapsamlı arama yapabilirsiniz. Yukarıdaki formu kullanarak
                    arama sistemini seçin ve sorgunuzu girin.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </SimplifiedErrorBoundary>
  );
};

export default UnifiedSearchPage;