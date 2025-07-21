import React, { useState, useMemo } from "react";
import { ResultCard } from "./ResultCard";
import { Pagination } from "./Pagination";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutGrid, 
  List, 
  Download, 
  Filter, 
  SortAsc, 
  SortDesc,
  Clock,
  TrendingUp,
  Award,
  Bookmark,
  ChevronDown,
  X
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export interface SearchResult {
  id: string;
  title: string;
  court: string;
  department: string;
  date: string;
  summary: string;
  relevanceScore?: number;
  isNew?: boolean;
  isPopular?: boolean;
  citationCount?: number;
  keywords?: string[];
}

export interface SearchResultsProps {
  results: SearchResult[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  totalResults?: number;
  searchTime?: number;
  query?: string;
}

type ViewMode = 'list' | 'grid' | 'compact';
type SortOption = 'relevance' | 'date' | 'court' | 'popularity';
type SortDirection = 'asc' | 'desc';

export function SearchResults({
  results,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  totalResults = 0,
  searchTime = 0,
  query = ""
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Handlers
  const handleDownloadPDF = async (id: string) => {
    const result = results.find(r => r.id === id);
    if (!result) return;

    try {
      // PDF indirme işlemi başlatılıyor
      toast.info('PDF hazırlanıyor...');
      
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      
      // PDF içeriği
      pdf.setFontSize(16);
      pdf.text(result.title, 20, 30);
      
      pdf.setFontSize(12);
      pdf.text(`Mahkeme: ${result.court}`, 20, 50);
      pdf.text(`Daire: ${result.department}`, 20, 60);
      pdf.text(`Tarih: ${result.date}`, 20, 70);
      
      // Özet metni için satır kaydırma
      const splitText = pdf.splitTextToSize(result.summary, 170);
      pdf.text(splitText, 20, 90);
      
      // Dosyayı indir
      pdf.save(`${result.title.slice(0, 50)}.pdf`);
      toast.success('PDF başarıyla indirildi!');
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      toast.error('PDF oluşturulurken hata oluştu');
    }
  };

  const handleViewDetails = (id: string) => {
    const result = results.find(r => r.id === id);
    if (!result) return;
    
    // Detay sayfasına yönlendir
    window.open(`/case/${id}`, '_blank');
  };

  const handleSaveResult = async (id: string) => {
    try {
      toast.info('Kayıt işlemi başlatılıyor...');
      
      // Supabase'e kaydet
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase
        .from('saved_cases')
        .insert({
          case_id: id,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      
      toast.success('Karar başarıyla kaydedildi!');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      toast.error('Kaydetme sırasında hata oluştu');
    }
  };

  const handleBulkExport = async () => {
    if (selectedResults.length === 0) return;
    
    try {
      toast.info('Toplu PDF hazırlanıyor...');
      
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      
      selectedResults.forEach((resultId, index) => {
        const result = results.find(r => r.id === resultId);
        if (!result) return;
        
        if (index > 0) {
          pdf.addPage(); // Yeni sayfa ekle
        }
        
        // PDF içeriği
        pdf.setFontSize(16);
        pdf.text(result.title, 20, 30);
        
        pdf.setFontSize(12);
        pdf.text(`Mahkeme: ${result.court}`, 20, 50);
        pdf.text(`Daire: ${result.department}`, 20, 60);
        pdf.text(`Tarih: ${result.date}`, 20, 70);
        
        const splitText = pdf.splitTextToSize(result.summary, 170);
        pdf.text(splitText, 20, 90);
      });
      
      pdf.save(`toplu-kararlar-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success(`${selectedResults.length} karar PDF olarak indirildi!`);
      
      // Seçimi temizle
      setSelectedResults([]);
    } catch (error) {
      console.error('Toplu PDF oluşturma hatası:', error);
      toast.error('Toplu PDF oluşturulurken hata oluştu');
    }
  };

  const handleSelectResult = (id: string) => {
    setSelectedResults(prev => 
      prev.includes(id) 
        ? prev.filter(resultId => resultId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedResults.length === results.length) {
      setSelectedResults([]);
    } else {
      setSelectedResults(results.map(r => r.id));
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  // Sorted and filtered results
  const sortedResults = useMemo(() => {
    let sorted = [...results];
    
    switch (sortBy) {
      case 'date':
        sorted.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sortDirection === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
        });
        break;
      case 'court':
        sorted.sort((a, b) => {
          const comparison = a.court.localeCompare(b.court, 'tr');
          return sortDirection === 'desc' ? -comparison : comparison;
        });
        break;
      case 'popularity':
        sorted.sort((a, b) => {
          const scoreA = a.citationCount || 0;
          const scoreB = b.citationCount || 0;
          return sortDirection === 'desc' ? scoreB - scoreA : scoreA - scoreB;
        });
        break;
      default:
        sorted.sort((a, b) => {
          const scoreA = a.relevanceScore || 0;
          const scoreB = b.relevanceScore || 0;
          return sortDirection === 'desc' ? scoreB - scoreA : scoreA - scoreB;
        });
    }
    
    return sorted;
  }, [results, sortBy, sortDirection]);

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'relevance': return 'İlgi Düzeyi';
      case 'date': return 'Tarih';
      case 'court': return 'Mahkeme';
      case 'popularity': return 'Popülerlik';
      default: return 'İlgi Düzeyi';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="space-y-4">
        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">
              Arama Sonuçları
            </h2>
            {totalResults > 0 && (
              <p className="text-sm text-muted-foreground">
                {totalResults.toLocaleString('tr-TR')} sonuç bulundu 
                {searchTime > 0 && ` (${searchTime.toFixed(2)} saniyede)`}
                {query && ` "${query}" için`}
              </p>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border bg-background p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg border">
          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sırala:</span>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-40 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">İlgi Düzeyi</SelectItem>
                <SelectItem value="date">Tarih</SelectItem>
                <SelectItem value="court">Mahkeme</SelectItem>
                <SelectItem value="popularity">Popülerlik</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-2"
            >
              {sortDirection === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Results per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sayfa başına:</span>
            <Select defaultValue="10">
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Bulk Actions */}
          {selectedResults.length > 0 && (
            <>
              <span className="text-sm font-medium">
                {selectedResults.length} seçili
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Toplu İşlem
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleBulkExport}>
                    <Download className="h-4 w-4 mr-2" />
                    PDF İndir
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Favorilere Ekle
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedResults.length === results.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Aktif Filtreler:</span>
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="gap-1">
                {filter}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => removeFilter(filter)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {sortedResults.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
          {sortedResults.map((result) => (
            <ResultCard
              key={result.id}
              result={result}
              viewMode={viewMode}
              isSelected={selectedResults.includes(result.id)}
              onSelect={() => handleSelectResult(result.id)}
              onDownloadPDF={() => handleDownloadPDF(result.id)}
              onViewDetails={() => handleViewDetails(result.id)}
              onSave={() => handleSaveResult(result.id)}
              query={query}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Sonuç bulunamadı</h3>
              <p className="text-muted-foreground">
                Arama kriterlerinizi genişletmeyi deneyin veya farklı anahtar kelimeler kullanın.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}