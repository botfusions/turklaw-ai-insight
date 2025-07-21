import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, 
  Eye, 
  Bookmark, 
  Share2, 
  Star,
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  ExternalLink
} from "lucide-react";
import { SearchResult } from "./SearchResults";

interface ResultCardProps {
  result: SearchResult;
  viewMode?: 'list' | 'grid' | 'compact';
  isSelected?: boolean;
  onSelect?: () => void;
  onDownloadPDF: () => void;
  onViewDetails: () => void;
  onSave?: () => void;
  query?: string;
}

export function ResultCard({
  result,
  viewMode = 'list',
  isSelected = false,
  onSelect,
  onDownloadPDF,
  onViewDetails,
  onSave,
  query
}: ResultCardProps) {
  const handleShare = async (result: SearchResult) => {
    const url = `${window.location.origin}/case/${result.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: result.title,
          text: result.summary,
          url: url,
        });
      } catch (error) {
        console.log('Paylaşım iptal edildi');
      }
    } else {
      // Fallback: URL'yi panoya kopyala
      try {
        await navigator.clipboard.writeText(url);
        const { toast } = await import('sonner');
        toast.success('Link panoya kopyalandı!');
      } catch (error) {
        const { toast } = await import('sonner');
        toast.error('Link kopyalanırken hata oluştu');
      }
    }
  };
  const highlightText = (text: string, query?: string) => {
    if (!query || query.trim() === '') return text;
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800/30 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const isCompact = viewMode === 'compact';
  const isGrid = viewMode === 'grid';

  return (
    <Card 
      className={`w-full group transition-all duration-200 hover:shadow-lg border-l-4 border-l-transparent hover:border-l-primary/50 ${
        isSelected ? 'ring-2 ring-primary/20 border-l-primary' : ''
      } ${isCompact ? 'py-2' : ''}`}
    >
      <CardHeader className={`${isCompact ? 'pb-2 pt-3' : 'pb-3'} relative`}>
        {/* Selection Checkbox */}
        {onSelect && (
          <div className="absolute top-3 right-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
          </div>
        )}

        {/* Status Badges */}
        <div className="flex flex-wrap gap-1 mb-2">
          {result.isNew && (
            <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
              <Clock className="h-3 w-3 mr-1" />
              Yeni
            </Badge>
          )}
          {result.isPopular && (
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Popüler
            </Badge>
          )}
          {result.relevanceScore && result.relevanceScore > 8 && (
            <Badge variant="outline" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Yüksek İlgi
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 
          className={`font-semibold text-primary cursor-pointer hover:underline transition-colors group-hover:text-primary/80 ${
            isCompact ? 'text-base line-clamp-1' : 'text-lg line-clamp-2'
          }`}
          onClick={onViewDetails}
        >
          {highlightText(result.title, query)}
        </h3>

        {/* Meta Information */}
        <div className={`flex flex-wrap items-center gap-2 text-sm text-muted-foreground ${
          isCompact ? 'text-xs' : ''
        }`}>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{result.court}</span>
          </div>
          <span>•</span>
          <span>{result.department}</span>
          <span>•</span>
          <span>{formatDate(result.date)}</span>
          
          {result.citationCount && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Award className="h-3 w-3" />
                <span>{result.citationCount} atıf</span>
              </div>
            </>
          )}
          
          {result.relevanceScore && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                <span>{result.relevanceScore.toFixed(1)}/10</span>
              </div>
            </>
          )}
        </div>
      </CardHeader>

      {!isCompact && (
        <CardContent className="space-y-4">
          {/* Summary */}
          <div className={`text-sm text-foreground ${isGrid ? 'line-clamp-2' : 'line-clamp-3'}`}>
            {highlightText(result.summary, query)}
          </div>

          {/* Keywords */}
          {result.keywords && result.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {result.keywords.slice(0, 5).map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {result.keywords.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{result.keywords.length - 5}
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="default"
              size="sm"
              onClick={onViewDetails}
              className="flex items-center gap-2 group/btn"
            >
              <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              Detay
              <ExternalLink className="h-3 w-3 opacity-60" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadPDF}
              className="flex items-center gap-2 group/btn"
            >
              <Download className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              PDF
            </Button>

            {onSave && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="flex items-center gap-2 group/btn"
              >
                <Bookmark className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                Kaydet
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare(result)}
              className="flex items-center gap-2 group/btn"
            >
              <Share2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              Paylaş
            </Button>
          </div>
        </CardContent>
      )}

      {/* Compact Mode Actions */}
      {isCompact && (
        <CardContent className="pt-0 pb-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground line-clamp-1 flex-1">
              {highlightText(result.summary, query)}
            </div>
            <div className="flex gap-1 ml-2">
              <Button variant="ghost" size="sm" onClick={onViewDetails} className="h-6 w-6 p-0">
                <Eye className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDownloadPDF} className="h-6 w-6 p-0">
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}