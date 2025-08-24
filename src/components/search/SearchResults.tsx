import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  Calendar,
  Building2,
  Search,
  ChevronRight,
  Star,
  Heart,
  Filter,
  ArrowUpDown,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { clsx, cn } from '@/lib/utils';
import { SearchResult, SearchResponse } from '@/services/legalApiService';
import { CourtSystem } from './UnifiedSearchForm';

// Sort options
const sortOptions = [
  { value: 'relevance', label: 'Alaka D\u00fczeyi' },
  { value: 'date-desc', label: 'Tarih (Yeni \u2192 Eski)' },
  { value: 'date-asc', label: 'Tarih (Eski \u2192 Yeni)' },
  { value: 'court', label: 'Mahkeme' },
  { value: 'title', label: 'Ba\u015fl\u0131k' },
];

// Filter options
const courtTypeFilters = [
  { value: 'all', label: 'T\u00fcm Mahkemeler' },
  { value: 'YARGITAYKARARI', label: 'Yarg\u0131tay' },
  { value: 'DANISTAYKARAR', label: 'Dan\u0131\u015ftay' },
  { value: 'YERELHUKUK', label: 'Yerel Mahkemeler' },
  { value: 'ISTINAFHUKUK', label: '\u0130stinaf Mahkemeleri' },
];

interface SearchResultsProps {
  results: SearchResponse;
  loading?: boolean;
  error?: string | null;
  hasSearched?: boolean;
  query?: string;
  courtSystem: CourtSystem;
  onResultClick: (result: SearchResult) => void;
  onLoadMore?: () => void;
  onSortChange?: (sort: string) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  onFavorite?: (resultId: string) => void;
  favorites?: string[];
  hasMore?: boolean;
  compact?: boolean;
  className?: string;
}

export const SearchResults = ({
  results,
  loading = false,
  error = null,
  hasSearched = true,
  query = '',
  courtSystem,
  onResultClick,
  onLoadMore,
  onSortChange,
  onFilterChange,
  onFavorite,
  favorites = [],
  hasMore = false,
  compact = false,
  className
}: SearchResultsProps) => {
  const [currentSort, setCurrentSort] = useState('relevance');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: tr });
    } catch {
      return dateString;
    }
  };

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    onSortChange?.(sort);
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    onFilterChange?.({ courtType: filter });
  };

  const getCourtSystemName = (system: CourtSystem) => {
    const names = {
      bedesten: '\u00c7oklu Mahkeme',
      anayasa: 'Anayasa Mahkemesi',
      mevzuat: 'T\u00fcrk Mevzuat\u0131',
      emsal: 'Emsal Kararlar',
      uyusmazlik: 'Uyu\u015fmazl\u0131k Mahkemesi',
      kik: 'Kamu \u0130hale Kurumu',
      rekabet: 'Rekabet Kurumu',
      sayistay: 'Say\u0131\u015ftay',
      kvkk: 'KVKK',
      bddk: 'BDDK',
    };
    return names[system] || system;
  };

  if (loading && (!results || results.results.length === 0)) {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-muted rounded-lg shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-4/5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Arama s\u0131ras\u0131nda bir hata olu\u015ftu: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!hasSearched) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText size={32} className="text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Arama Yapın
        </h3>
        <p className="text-muted-foreground">
          T\u00fcrk hukuk sisteminde arama yapmak i\u00e7in yukar\u0131daki formu kullan\u0131n.
        </p>
      </div>
    );
  }

  if (!results || results.results.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Search size={32} className="text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Sonu\u00e7 Bulunamad\u0131
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          {query ? `"${query}" i\u00e7in ${getCourtSystemName(courtSystem)} sisteminde sonu\u00e7 bulunamad\u0131.` : 'Arama yapabilmek i\u00e7in bir terim girin.'}
        </p>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground/75">
            Farkl\u0131 anahtar kelimeler deneyin veya arama kriterlerinizi geni\u015fletin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {!compact && (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Arama Sonu\u00e7lar\u0131
                </h2>
                <p className="text-sm text-muted-foreground">
                  {results.total_records.toLocaleString('tr-TR')} sonu\u00e7tan{' '}
                  {Math.min(results.page_size, results.results.length)} tanesi g\u00f6steriliyor
                  {query && (
                    <span className="ml-1">
                      - <span className="font-medium">"{query}"</span>
                    </span>
                  )}
                </p>
              </div>
              <Badge variant="outline" className="shrink-0">
                {getCourtSystemName(courtSystem)}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                Filtreler
              </Button>

              <Select value={currentSort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <ArrowUpDown size={16} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Mahkeme T\u00fcr\u00fc
                    </label>
                    <Select value={currentFilter} onValueChange={handleFilterChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {courtTypeFilters.map((filter) => (
                          <SelectItem key={filter.value} value={filter.value}>
                            {filter.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Tarih Aral\u0131\u011f\u0131
                    </label>
                    <div className="flex gap-2">
                      <Input type="date" placeholder="Ba\u015flang\u0131\u00e7" className="text-sm" />
                      <Input type="date" placeholder="Biti\u015f" className="text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Sonu\u00e7 Say\u0131s\u0131
                    </label>
                    <Select defaultValue="10">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 sonu\u00e7</SelectItem>
                        <SelectItem value="25">25 sonu\u00e7</SelectItem>
                        <SelectItem value="50">50 sonu\u00e7</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Results List */}
      <div className="space-y-4">
        {results.results.map((result) => {
          const isFavorite = favorites.includes(result.id);
          
          return (
            <Card 
              key={result.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onResultClick(result)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Document Icon */}
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg shrink-0">
                    <FileText size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title and Relevance */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className={cn(
                        "font-semibold text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors",
                        compact ? "text-base" : "text-lg"
                      )}>
                        {result.title}
                      </h3>
                      {result.relevanceScore && (
                        <div className="flex items-center gap-1 shrink-0">
                          <Star size={14} className="text-amber-500" fill="currentColor" />
                          <span className="text-sm font-medium text-amber-600">
                            {(result.relevanceScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 size={14} />
                        <span className="font-medium">{result.court}</span>
                      </div>
                      
                      {result.chamber && (
                        <>
                          <span>\u2022</span>
                          <span>{result.chamber}</span>
                        </>
                      )}
                      
                      <span>\u2022</span>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(result.date)}
                      </div>
                      
                      {result.caseNumber && (
                        <>
                          <span>\u2022</span>
                          <span className="font-mono text-xs">{result.caseNumber}</span>
                        </>
                      )}
                    </div>

                    {/* Summary */}
                    <p className={cn(
                      "text-muted-foreground mb-4 leading-relaxed line-clamp-3",
                      compact ? "text-sm" : "text-base"
                    )}>
                      {result.summary}
                    </p>

                    {/* Highlights */}
                    {result.highlights && result.highlights.length > 0 && !compact && (
                      <div className="mb-4">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                          \u0130lgili B\u00f6l\u00fcmler
                        </div>
                        <div className="space-y-1">
                          {result.highlights.slice(0, 2).map((highlight, idx) => (
                            <div key={idx} className="text-sm text-muted-foreground bg-secondary/50 px-2 py-1 rounded line-clamp-2">
                              <span dangerouslySetInnerHTML={{ __html: highlight }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" size="sm">
                          {result.documentType}
                        </Badge>
                        {result.decisionNumber && (
                          <Badge variant="outline" size="sm">
                            {result.decisionNumber}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {onFavorite && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onFavorite(result.id);
                            }}
                          >
                            <Heart 
                              size={14} 
                              fill={isFavorite ? 'currentColor' : 'none'}
                              className={isFavorite ? 'text-red-500' : 'text-muted-foreground'}
                            />
                          </Button>
                        )}
                        
                        {result.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </Button>
                        )}

                        <Button variant="ghost" size="sm">
                          <Eye size={14} />
                        </Button>

                        <ChevronRight size={16} className="text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-muted-foreground border-t-primary rounded-full animate-spin mr-2" />
                Y\u00fckleniyor...
              </>
            ) : (
              <>
                Daha Fazla Sonu\u00e7
                <ChevronRight size={16} />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      {!compact && (
        <div className="text-center text-sm text-muted-foreground">
          Sayfa {results.requested_page} - Toplam {results.total_records.toLocaleString('tr-TR')} sonu\u00e7
        </div>
      )}
    </div>
  );
};