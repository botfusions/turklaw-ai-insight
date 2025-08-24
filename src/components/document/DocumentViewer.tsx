'use client';

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  FileText, 
  Download, 
  Print, 
  Share2, 
  Copy, 
  ZoomIn, 
  ZoomOut, 
  Search,
  BookOpen,
  Calendar,
  Building2,
  ExternalLink,
  Heart,
  ArrowLeft,
  MoreVertical,
  Bookmark,
  Eye,
  EyeOff
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { clsx, cn } from '@/lib/utils';
import { CourtSystem } from '../search/UnifiedSearchForm';
import toast from 'react-hot-toast';

// Document metadata interface
interface DocumentMetadata {
  id: string;
  title: string;
  court: string;
  chamber?: string;
  date: string;
  caseNumber?: string;
  decisionNumber?: string;
  documentType: string;
  url?: string;
  courtSystem: CourtSystem;
  keywords?: string[];
  relatedDocuments?: Array<{
    id: string;
    title: string;
    type: string;
  }>;
}

// Document content interface
interface DocumentContent {
  markdown: string;
  plainText: string;
  sections?: Array<{
    id: string;
    title: string;
    level: number;
    content: string;
  }>;
}

interface DocumentViewerProps {
  metadata: DocumentMetadata;
  content: DocumentContent;
  loading?: boolean;
  onBack?: () => void;
  onRelatedDocumentClick?: (docId: string) => void;
  onFavorite?: (docId: string) => void;
  isFavorite?: boolean;
  className?: string;
}

export function DocumentViewer({
  metadata,
  content,
  loading = false,
  onBack,
  onRelatedDocumentClick,
  onFavorite,
  isFavorite = false,
  className,
}: DocumentViewerProps) {
  const [fontSize, setFontSize] = useState(16);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [showMetadata, setShowMetadata] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Font size controls
  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 2);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 2);
    }
  };

  // Search functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    // Simple text search - in real implementation, you'd use more sophisticated search
    const text = content.plainText.toLowerCase();
    const searchLower = term.toLowerCase();
    const results: number[] = [];
    let index = 0;
    
    while (index < text.length) {
      const foundIndex = text.indexOf(searchLower, index);
      if (foundIndex === -1) break;
      results.push(foundIndex);
      index = foundIndex + 1;
    }
    
    setSearchResults(results);
    setCurrentSearchIndex(0);
  };

  // Copy document content
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content.plainText);
      toast.success('Belge içeriği panoya kopyalandı');
    } catch (error) {
      toast.error('Kopyalama işlemi başarısız');
    }
  };

  // Share document
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: metadata.title,
          text: `${metadata.court} - ${metadata.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Belge bağlantısı panoya kopyalandı');
      }
    } catch (error) {
      toast.error('Paylaşım işlemi başarısız');
    }
  };

  // Print document
  const handlePrint = () => {
    window.print();
  };

  // Download as text file
  const handleDownload = () => {
    const blob = new Blob([content.plainText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: tr });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className={cn("animate-pulse space-y-4", className)}>
        <div className="h-8 bg-muted rounded w-3/4 mb-4" />
        <div className="h-4 bg-muted rounded w-1/2 mb-8" />
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/5" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-full", className)}>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-background border-b border-border mb-6">
        <div className="flex items-center justify-between p-4">
          {/* Left controls */}
          <div className="flex items-center gap-2">
            {onBack && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
              >
                <ArrowLeft size={16} />
                Geri
              </Button>
            )}

            <Button
              variant={showSearch ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search size={16} />
              Ara
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMetadata(!showMetadata)}
            >
              {showMetadata ? <EyeOff size={16} /> : <Eye size={16} />}
              {showMetadata ? 'Gizle' : 'Bilgileri Göster'}
            </Button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Font size controls */}
            <div className="flex items-center gap-1 border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={decreaseFontSize}
                disabled={fontSize <= 12}
              >
                <ZoomOut size={16} />
              </Button>
              <span className="px-2 text-sm font-medium">{fontSize}px</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={increaseFontSize}
                disabled={fontSize >= 24}
              >
                <ZoomIn size={16} />
              </Button>
            </div>

            {/* Action buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFavorite?.(metadata.id)}
            >
              <Heart 
                size={16} 
                fill={isFavorite ? 'currentColor' : 'none'}
                className={isFavorite ? 'text-red-500' : 'text-muted-foreground'}
              />
              {isFavorite ? 'Favorilerde' : 'Favorile'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 size={16} />
              Paylaş
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
            >
              <Copy size={16} />
              Kopyala
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="no-print"
            >
              <Print size={16} />
              Yazdır
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download size={16} />
              İndir
            </Button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Belgede ara..."
                  className="w-full"
                />
              </div>
              {searchResults.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    {currentSearchIndex + 1} / {searchResults.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentSearchIndex(Math.max(0, currentSearchIndex - 1))}
                    disabled={currentSearchIndex === 0}
                  >
                    Önceki
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentSearchIndex(Math.min(searchResults.length - 1, currentSearchIndex + 1))}
                    disabled={currentSearchIndex === searchResults.length - 1}
                  >
                    Sonraki
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Document Metadata */}
        {showMetadata && (
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-4">
              {/* Document Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <FileText size={20} className="text-primary mt-1" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">
                        Belge Bilgileri
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {metadata.documentType}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Mahkeme
                      </label>
                      <div className="mt-1">
                        <Badge variant="secondary" size="sm">
                          {metadata.court}
                        </Badge>
                      </div>
                    </div>

                    {metadata.chamber && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Daire
                        </label>
                        <p className="mt-1 text-sm text-foreground">
                          {metadata.chamber}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Tarih
                      </label>
                      <div className="mt-1 flex items-center gap-1 text-sm text-foreground">
                        <Calendar size={14} />
                        {formatDate(metadata.date)}
                      </div>
                    </div>

                    {metadata.caseNumber && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Esas Numarası
                        </label>
                        <p className="mt-1 text-sm text-foreground font-mono">
                          {metadata.caseNumber}
                        </p>
                      </div>
                    )}

                    {metadata.decisionNumber && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Karar Numarası
                        </label>
                        <p className="mt-1 text-sm text-foreground font-mono">
                          {metadata.decisionNumber}
                        </p>
                      </div>
                    )}
                  </div>

                  {metadata.url && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <a
                          href={metadata.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink size={16} />
                          Orijinal Kaynak
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Keywords */}
              {metadata.keywords && metadata.keywords.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-foreground mb-3">
                      Anahtar Kelimeler
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {metadata.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" size="sm">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Documents */}
              {metadata.relatedDocuments && metadata.relatedDocuments.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-foreground mb-3">
                      İlgili Belgeler
                    </h4>
                    <div className="space-y-2">
                      {metadata.relatedDocuments.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => onRelatedDocumentClick?.(doc.id)}
                          className="w-full text-left p-2 rounded hover:bg-muted transition-colors"
                        >
                          <div className="text-sm font-medium text-primary hover:text-primary/80 line-clamp-2">
                            {doc.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {doc.type}
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={showMetadata ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <Card>
            <CardContent className="p-6">
              {/* Document Title */}
              <div className="mb-6 print-break-inside-avoid">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {metadata.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building2 size={14} />
                    {metadata.court}
                  </div>
                  {metadata.chamber && (
                    <>
                      <span>•</span>
                      <span>{metadata.chamber}</span>
                    </>
                  )}
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(metadata.date)}
                  </div>
                </div>
              </div>

              {/* Document Content */}
              <div
                ref={contentRef}
                className="legal-document"
                style={{ fontSize: `${fontSize}px` }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose max-w-none dark:prose-invert"
                >
                  {content.markdown}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .sticky {
            position: static !important;
          }
          
          .print-break-inside-avoid {
            page-break-inside: avoid;
          }
          
          .legal-document {
            font-size: 12pt !important;
            line-height: 1.5 !important;
          }
        }
      `}</style>
    </div>
  );
}