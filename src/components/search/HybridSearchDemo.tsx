import React, { useState } from 'react';
import { useLegalSearchHybrid } from '@/hooks/useLegalSearchHybrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Database, Github, AlertTriangle, CheckCircle } from 'lucide-react';

export function HybridSearchDemo() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'yargi' | 'mevzuat'>('yargi');
  
  const { 
    results, 
    loading, 
    error, 
    dataSource, 
    responseTime, 
    searchHybrid, 
    clearCache 
  } = useLegalSearchHybrid();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await searchHybrid(query, category);
    }
  };

  const getDataSourceIcon = () => {
    switch (dataSource) {
      case 'cache': return <Database className="h-4 w-4" />;
      case 'api': return <CheckCircle className="h-4 w-4" />;
      case 'github': return <Github className="h-4 w-4" />;
      case 'fallback': return <AlertTriangle className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getDataSourceColor = () => {
    switch (dataSource) {
      case 'cache': return 'bg-blue-100 text-blue-800';
      case 'api': return 'bg-green-100 text-green-800';
      case 'github': return 'bg-purple-100 text-purple-800';
      case 'fallback': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Hibrit Hukuki Arama Sistemi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Arama teriminizi girin..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-12"
                />
              </div>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value as 'yargi' | 'mevzuat')}
                className="px-4 py-2 border rounded-md h-12"
              >
                <option value="yargi">Yargı Kararları</option>
                <option value="mevzuat">Mevzuat</option>
              </select>
              <Button type="submit" disabled={loading} className="h-12 px-6">
                {loading ? 'Arıyor...' : 'Ara'}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={clearCache}>
                Cache Temizle
              </Button>
              {dataSource && (
                <Badge className={`${getDataSourceColor()} flex items-center gap-1`}>
                  {getDataSourceIcon()}
                  {dataSource === 'cache' ? 'Önbellek' : 
                   dataSource === 'api' ? 'Canlı API' : 
                   dataSource === 'github' ? 'GitHub Fallback' : 
                   'Hardcoded Fallback'}
                </Badge>
              )}
              {responseTime > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {responseTime}ms
                </Badge>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sonuçlar ({results.length})</h3>
          {results.map((result, index) => (
            <Card key={result.id || index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">{result.title}</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{result.court}</Badge>
                  <Badge variant="secondary">{result.date}</Badge>
                  {result.type && <Badge>{result.type}</Badge>}
                  {result.status && (
                    <Badge variant="outline" className="text-xs">
                      {result.status}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{result.summary}</p>
                {result.url && result.url !== '#' && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => window.open(result.url, '_blank')}
                    className="p-0 h-auto mt-2"
                  >
                    Kaynak Link →
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Sonuç bulunamadı. Farklı arama terimleri deneyin.
          </CardContent>
        </Card>
      )}
    </div>
  );
}