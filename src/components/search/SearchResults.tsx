import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ExternalLink, FileText, Calendar } from 'lucide-react';
import { MevzuatResult } from './types';
import { cn } from '@/lib/utils';

interface SearchResultsProps {
  results: MevzuatResult[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  compact?: boolean;
  className?: string;
}

export const SearchResults = ({
  results,
  loading,
  error,
  hasSearched,
  compact = false,
  className
}: SearchResultsProps) => {
  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-5/6" />
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
          Arama sırasında bir hata oluştu: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!hasSearched) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Mevzuat aramak için yukarıdaki arama kutusunu kullanın.</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Arama kriterlerinize uygun sonuç bulunamadı.</p>
        <p className="text-sm mt-2">Farklı kelimelerle tekrar deneyin.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {results.length} sonuç bulundu
        </p>
      </div>
      
      {results.map((result) => (
        <Card key={result.id} className="hover:shadow-md transition-shadow">
          <CardHeader className={cn(compact ? "pb-2" : "pb-3")}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className={cn(
                  "line-clamp-2",
                  compact ? "text-base" : "text-lg"
                )}>
                  {result.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {result.type}
                  </Badge>
                  {result.date && (
                    <span className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {result.date}
                    </span>
                  )}
                </CardDescription>
              </div>
              
              {result.url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => window.open(result.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          
          {result.content && (
            <CardContent className={cn(compact ? "pt-0" : "pt-0")}>
              <p className={cn(
                "text-muted-foreground line-clamp-3",
                compact ? "text-sm" : "text-base"
              )}>
                {result.content}
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};