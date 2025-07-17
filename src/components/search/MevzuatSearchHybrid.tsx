import React, { useState, useEffect } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { useHybridMevzuatSearch } from './hooks/useHybridMevzuatSearch';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { StatsCards } from './components/StatsCards';
import { SearchHistoryPills } from './components/SearchHistoryPills';
import { PageSizeSelector } from './components/PageSizeSelector';
import { DataSourceIndicator } from './components/DataSourceIndicator';
import { PerformanceInfo } from './components/PerformanceInfo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MevzuatSearchHybridProps {
  autoSearch?: boolean;
  autoSearchQuery?: string;
  showStats?: boolean;
  showHistory?: boolean;
  showPerformanceInfo?: boolean;
  className?: string;
}

export const MevzuatSearchHybrid: React.FC<MevzuatSearchHybridProps> = ({
  autoSearch = true,
  autoSearchQuery = 'güncel mevzuat',
  showStats = true,
  showHistory = true,
  showPerformanceInfo = false,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const { 
    results, 
    loading, 
    error, 
    dataSource, 
    hasSearched,
    performanceInfo,
    searchMevzuat,
    clearError,
    clearSearchCache
  } = useHybridMevzuatSearch({
    cacheEnabled: true,
    fallbackEnabled: true,
    primaryTimeout: 10000
  });

  // Auto-search on mount
  useEffect(() => {
    if (autoSearch && autoSearchQuery) {
      handleSearch(autoSearchQuery);
    }
  }, [autoSearch, autoSearchQuery]);

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return;
    
    try {
      await searchMevzuat(query, pageSize);
      
      // Add to history
      setSearchHistory(prev => [
        query,
        ...prev.filter(item => item !== query).slice(0, 4)
      ]);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSelectHistoryQuery = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`min-h-screen bg-background py-8 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Hibrit Mevzuat Arama Sistemi
          </h1>
          <p className="text-muted-foreground">
            Multi-source mevzuat verilerine güvenli erişim
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Kanun, yönetmelik veya tebliğ arayın..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="flex items-center gap-2">
                <PageSizeSelector 
                  pageSize={pageSize} 
                  onPageSizeChange={setPageSize}
                />
                <Button
                  onClick={() => handleSearch()}
                  disabled={loading}
                  className="px-6"
                >
                  {loading ? 'Aranıyor...' : 'Ara'}
                </Button>
              </div>
            </div>

            {/* Search History */}
            {showHistory && (
              <SearchHistoryPills
                searchHistory={searchHistory}
                onSelectQuery={handleSelectHistoryQuery}
              />
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {showStats && (
          <StatsCards
            totalCount={results.length}
            dataSource={dataSource}
            loading={loading}
            error={error}
            onClearCache={clearSearchCache}
          />
        )}

        {/* Data Source Indicator */}
        <div className="mb-6">
          <DataSourceIndicator dataSource={dataSource} />
        </div>

        {/* Performance Info */}
        {showPerformanceInfo && performanceInfo && (
          <div className="mb-6">
            <PerformanceInfo performanceInfo={performanceInfo} />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-destructive/50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                <p className="text-destructive">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearError}
                  className="ml-auto"
                >
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Arama Sonuçları</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchResults
              results={results}
              loading={loading}
              error={error}
              hasSearched={hasSearched}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Veri Kaynağı: {dataSource === 'primary' ? 'Live API' : dataSource === 'fallback' ? 'Static Data' : dataSource === 'cache' ? 'Cache' : 'Unknown'} | 
            Sonuç: {results.length} | 
            Durum: {loading ? 'Aranıyor...' : error ? 'Hata' : 'Hazır'}
          </p>
        </div>
      </div>
    </div>
  );
};