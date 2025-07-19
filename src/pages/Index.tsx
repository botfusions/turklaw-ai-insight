
import React, { useState, useEffect, useRef } from 'react';
import { Search, Download, AlertCircle, Menu } from 'lucide-react';
import { useLegalSearchHybrid } from '@/hooks/useLegalSearchHybrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { SearchSuggestions } from '@/components/search/SearchSuggestions';
import { SearchResultsSkeleton } from '@/components/search/SearchSkeletons';
import jsPDF from 'jspdf';

const Index = () => {
  const {
    results,
    loading,
    error,
    dataSource,
    responseTime,
    searchHybrid
  } = useLegalSearchHybrid();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'yargi' | 'mevzuat'>('yargi');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Popular suggestions based on category
  const getPopularSuggestions = (cat: 'yargi' | 'mevzuat') => {
    const suggestions = {
      yargi: [
        'iş hukuku',
        'boşanma davası',
        'tazminat',
        'kira sözleşmesi',
        'miras hukuku'
      ],
      mevzuat: [
        'borçlar kanunu',
        'medeni kanun',
        'iş kanunu',
        'ceza kanunu',
        'vergi kanunu'
      ]
    };
    return suggestions[cat] || [];
  };

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Save search to recent searches
  const saveRecentSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchHybrid(query.trim(), category);
      saveRecentSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    searchHybrid(suggestion, category);
    saveRecentSearch(suggestion);
    setShowSuggestions(false);
  };

  const downloadPDF = (result: any) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(result.title, 20, 30);
    doc.setFontSize(12);
    doc.text(`Mahkeme: ${result.court}`, 20, 50);
    doc.text(`Tarih: ${result.date}`, 20, 65);
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(result.summary, 170);
    doc.text(splitText, 20, 80);
    doc.save(`${result.id}-karar.pdf`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-first Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-2xl font-bold truncate">
              🏛️ TurkLaw AI
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
        {/* Hero Section - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">
            Hukuki Arama
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Yargıtay kararları ve mevzuat araması
          </p>
        </div>

        {/* Search Form - Responsive */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Arama</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category Buttons - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant={category === 'yargi' ? 'default' : 'outline'}
                onClick={() => {
                  setCategory('yargi');
                  setShowSuggestions(false);
                }}
                className="flex-1 sm:flex-none"
              >
                🏛️ Yargı
              </Button>
              <Button
                type="button"
                variant={category === 'mevzuat' ? 'default' : 'outline'}
                onClick={() => {
                  setCategory('mevzuat');
                  setShowSuggestions(false);
                }}
                className="flex-1 sm:flex-none"
              >
                📚 Mevzuat
              </Button>
            </div>

            {/* Search Input with Suggestions */}
            <form onSubmit={handleSearch} className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder={`${category === 'yargi' ? 'Yargı' : 'Mevzuat'} araması yapın...`}
                    className="w-full"
                  />
                  
                  {/* Search Suggestions */}
                  <SearchSuggestions
                    suggestions={getPopularSuggestions(category)}
                    recentSearches={recentSearches}
                    onSelectSuggestion={handleSuggestionSelect}
                    visible={showSuggestions && (query.length === 0 || query.length > 0)}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="shrink-0"
                >
                  <Search className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {loading ? 'Arıyor...' : 'Ara'}
                  </span>
                </Button>
              </div>
            </form>

            {/* Status Bar - Responsive */}
            {results.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
                <span>{results.length} sonuç • {responseTime}ms</span>
                <Badge variant="outline" className="w-fit">
                  {dataSource}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2 text-destructive">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading Skeleton */}
        {loading && <SearchResultsSkeleton />}

        {/* Results - Mobile Optimized */}
        {!loading && results.length > 0 && (
          <div className="space-y-4">
            {results.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg leading-tight">
                    {result.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {result.court}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {result.date}
                    </Badge>
                    {result.type && (
                      <Badge className="text-xs">{result.type}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.summary}
                  </p>
                  
                  {/* Action Buttons - Stack on small screens */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {result.url && result.url !== '#' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                        asChild
                      >
                        <a href={result.url} target="_blank" rel="noopener noreferrer">
                          🔗 Kaynağı Görüntüle
                        </a>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadPDF(result)}
                      className="flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      PDF İndir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && query && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Sonuç Bulunamadı</h3>
                <p className="text-muted-foreground text-sm">
                  "{query}" için {category} araması sonuç vermedi.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
