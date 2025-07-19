
import React, { useState } from 'react';
import { Search, Download, AlertCircle } from 'lucide-react';
import { useLegalSearchHybrid } from '../hooks/useLegalSearchHybrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchHybrid(query.trim(), category);
    }
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Hukuki Arama</h1>
          <p className="text-muted-foreground">Yargıtay kararları ve mevzuat araması</p>
        </div>

        {/* Search Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Arama</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Category Buttons */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={category === 'yargi' ? 'default' : 'outline'}
                  onClick={() => setCategory('yargi')}
                >
                  Yargı
                </Button>
                <Button
                  type="button"
                  variant={category === 'mevzuat' ? 'default' : 'outline'}
                  onClick={() => setCategory('mevzuat')}
                >
                  Mevzuat
                </Button>
              </div>

              {/* Search Input */}
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Arama terimi girin..."
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? 'Arıyor...' : 'Ara'}
                </Button>
              </div>
            </form>

            {/* Status */}
            {results.length > 0 && (
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>{results.length} sonuç • {responseTime}ms</span>
                <Badge variant="outline">{dataSource}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <span>Arama yapılıyor...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-4">
            {results.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{result.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{result.court}</Badge>
                    <Badge variant="outline">{result.date}</Badge>
                    {result.type && <Badge>{result.type}</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{result.summary}</p>
                  <div className="flex gap-2">
                    {result.url && result.url !== '#' && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={result.url} target="_blank" rel="noopener noreferrer">
                          Kaynağı Görüntüle
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => downloadPDF(result)}>
                      <Download className="w-4 h-4 mr-2" />
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
                <p className="text-muted-foreground">
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
