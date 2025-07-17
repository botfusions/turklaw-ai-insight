import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { useHybridMevzuatSearch } from './hooks/useHybridMevzuatSearch';
import { DataSourceIndicator } from './components/DataSourceIndicator';
import { SearchHistory } from './components/SearchHistory';
import { CacheControls } from './components/CacheControls';
import { PerformanceInfo } from './components/PerformanceInfo';
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
  showLimitWarning = true,
  showDataSource = true,
  showHistory = true,
  cacheEnabled = true,
  primaryTimeout = 5000,
  fallbackEnabled = true,
  cacheFirst = false,
  showPerformanceInfo = false,
  showCacheControls = false,
  debugMode = false
}: MevzuatSearchProps) => {
  const { user, profile } = useAuth();
  const {
    query,
    results,
    loading,
    error,
    hasSearched,
    dataSource,
    searchHistory,
    performanceInfo,
    cacheSize,
    historySize,
    lastCacheCleared,
    searchMevzuat,
    setQuery,
    clearError,
    clearSearchCache,
    clearSearchHistory
  } = useHybridMevzuatSearch({
    cacheEnabled,
    primaryTimeout,
    fallbackEnabled,
    cacheFirst
  });

  // Auth kontrolü
  const shouldRequireAuth = requireAuth && !user;
  const canPerformSearch = !requireAuth || true;

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
            <div className="flex items-center gap-2">
              {showDataSource && hasSearched && (
                <DataSourceIndicator 
                  dataSource={dataSource} 
                  performanceInfo={performanceInfo}
                />
              )}
              {showHistory && (
                <SearchHistory
                  searchHistory={searchHistory}
                  onSelectQuery={setQuery}
                  onRemoveItem={(id) => {
                    // Remove item logic handled by useSearchHistory
                  }}
                  onClearHistory={clearSearchHistory}
                />
              )}
              {showLimitWarning && user && (
                <Badge variant="outline" className="text-xs">
                  Sınırsız arama
                </Badge>
              )}
            </div>
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
      
      {/* Debug/Admin Controls */}
      {debugMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {showCacheControls && (
            <CacheControls
              cacheSize={cacheSize}
              historySize={historySize}
              lastCacheCleared={lastCacheCleared}
              onClearCache={clearSearchCache}
              onClearHistory={clearSearchHistory}
            />
          )}
          
          {showPerformanceInfo && hasSearched && (
            <PerformanceInfo performanceInfo={performanceInfo} />
          )}
        </div>
      )}
    </div>
  );
};

export default MevzuatSearch;