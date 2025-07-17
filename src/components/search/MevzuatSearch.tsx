import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { useMevzuatSearch } from './hooks/useMevzuatSearch';
import { MevzuatSearchProps } from './types';
import { cn } from '@/lib/utils';

export const MevzuatSearch = ({
  className,
  compact = false,
  showFilters = false,
  maxResults = 10,
  autoSearch = false,
  placeholder = "Mevzuat araması yapın...",
  onSearchStart,
  onSearchComplete,
  onError,
  requireAuth = false,
  showLimitWarning = true
}: MevzuatSearchProps) => {
  const { user, profile, canSearch } = useAuth();
  const {
    query,
    results,
    loading,
    error,
    hasSearched,
    searchMevzuat,
    setQuery,
    clearError
  } = useMevzuatSearch();

  // Auth kontrolü
  const shouldRequireAuth = requireAuth && !user;
  const canPerformSearch = !requireAuth || canSearch();
  const remainingSearches = profile ? profile.max_searches - profile.search_count : 0;

  const handleSearch = async (searchQuery: string) => {
    if (!canPerformSearch) return;

    try {
      onSearchStart?.(searchQuery);
      clearError();
      
      const searchResults = await searchMevzuat(searchQuery, maxResults);
      onSearchComplete?.(searchResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      onError?.(errorMessage);
    }
  };

  // Auto search on mount if enabled
  useEffect(() => {
    if (autoSearch && query.trim() && !hasSearched) {
      handleSearch(query);
    }
  }, [autoSearch, query, hasSearched]);

  // Auth gereksinimi kontrolü
  if (shouldRequireAuth) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="pt-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Mevzuat araması yapmak için giriş yapmanız gerekiyor.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Header - sadece compact olmadığında göster */}
      {!compact && (
        <CardHeader className="px-0 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Mevzuat Arama</CardTitle>
            {showLimitWarning && user && (
              <Badge variant="outline" className="text-xs">
                {remainingSearches} arama hakkı kaldı
              </Badge>
            )}
          </div>
        </CardHeader>
      )}

      {/* Arama limiti uyarısı */}
      {showLimitWarning && requireAuth && !canPerformSearch && (
        <Alert className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Günlük arama limitiniz dolmuştur. Yarın tekrar deneyin veya premium plana geçin.
          </AlertDescription>
        </Alert>
      )}

      {/* Arama inputu */}
      <SearchInput
        value={query}
        onChange={setQuery}
        onSubmit={handleSearch}
        placeholder={placeholder}
        loading={loading}
        compact={compact}
        className="mb-4"
      />

      {/* Filtreler - opsiyonel */}
      {showFilters && !compact && (
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Filtreler yakında eklenecek...
          </p>
        </Card>
      )}

      {/* Sonuçlar */}
      <SearchResults
        results={results}
        loading={loading}
        error={error}
        hasSearched={hasSearched}
        compact={compact}
      />
    </div>
  );
};

export default MevzuatSearch;