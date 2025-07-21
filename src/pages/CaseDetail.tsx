import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Download, 
  Bookmark, 
  Share2, 
  Calendar, 
  Building, 
  FileText,
  Star,
  Award,
  BookOpen,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface CaseDetail {
  id: string;
  title: string;
  court: string;
  department: string;
  date: string;
  summary: string;
  fullText: string;
  keywords: string[];
  citationCount?: number;
  relevanceScore?: number;
  isNew?: boolean;
  isPopular?: boolean;
  caseNumber?: string;
}

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadCaseDetail = async () => {
      if (!id) return;

      try {
        // Mock veri (gerçek uygulamada API'den gelecek)
        await new Promise(resolve => setTimeout(resolve, 500)); // Loading simülasyonu
        
        const mockCase: CaseDetail = {
          id,
          title: `Detaylı Hukuki Karar Başlığı - ${id}`,
          court: 'Yargıtay 1. Hukuk Dairesi',
          department: '1. Daire',
          date: '2024-01-15',
          summary: 'Bu karar, önemli bir hukuki konuyu ele almakta ve emsal teşkil edecek niteliktedir. Karar, mevcut hukuki durumu detaylı şekilde incelemekte ve sonuç olarak belirli bir hukuki ilkeyi ortaya koymaktadır.',
          fullText: `Bu karar metni, hukuki sürecin tüm detaylarını içermektedir.

GEREKÇESİ:
Davacı tarafından açılan bu davada, temel hukuki meseleler şu şekildedir:

1. İlk olarak, dava konusu hakkında genel bir değerlendirme yapılmıştır.
2. İkinci olarak, mevcut mevzuat çerçevesinde durum incelenmiştir.
3. Son olarak, emsal kararlar ve hukuki içtihatlar değerlendirilmiştir.

SONUÇ:
Yukarıda belirtilen gerekçeler doğrultusunda, mahkememizce aşağıdaki karar verilmiştir.

Bu karar, hukuki sistemimizde önemli bir yere sahiptir ve gelecekteki benzer davalarda emsal teşkil edecek niteliktedir.`,
          keywords: ['hukuk', 'karar', 'emsal', 'dava', 'mahkeme'],
          citationCount: 25,
          relevanceScore: 9.2,
          isNew: true,
          isPopular: true,
          caseNumber: `2024/${Math.floor(Math.random() * 1000)}`
        };

        setCaseDetail(mockCase);
      } catch (error) {
        toast.error('Karar detayları yüklenirken hata oluştu');
        console.error('Case detail loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCaseDetail();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!caseDetail) return;

    try {
      toast.info('PDF hazırlanıyor...');
      
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      
      // Başlık
      pdf.setFontSize(16);
      pdf.text(caseDetail.title, 20, 30);
      
      // Meta bilgiler
      pdf.setFontSize(12);
      pdf.text(`Mahkeme: ${caseDetail.court}`, 20, 50);
      pdf.text(`Daire: ${caseDetail.department}`, 20, 60);
      pdf.text(`Tarih: ${caseDetail.date}`, 20, 70);
      if (caseDetail.caseNumber) {
        pdf.text(`Esas No: ${caseDetail.caseNumber}`, 20, 80);
      }
      
      // Tam metin
      const splitText = pdf.splitTextToSize(caseDetail.fullText, 170);
      pdf.text(splitText, 20, 100);
      
      pdf.save(`${caseDetail.title.slice(0, 50)}.pdf`);
      toast.success('PDF başarıyla indirildi!');
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      toast.error('PDF oluşturulurken hata oluştu');
    }
  };

  const handleSave = async () => {
    if (!caseDetail || !id) return;

    try {
      toast.info('Kayıt işlemi başlatılıyor...');
      
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        toast.error('Kaydetmek için giriş yapmalısınız');
        return;
      }

      if (isSaved) {
        // Kaydı kaldır
        const { error } = await supabase
          .from('saved_cases')
          .delete()
          .eq('case_id', id)
          .eq('user_id', user.user.id);

        if (error) throw error;
        
        setIsSaved(false);
        toast.success('Karar kaydedilen listeden çıkarıldı');
      } else {
        // Kaydet
        const { error } = await supabase
          .from('saved_cases')
          .insert({
            case_id: id,
            user_id: user.user.id
          });

        if (error) throw error;
        
        setIsSaved(true);
        toast.success('Karar başarıyla kaydedildi!');
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      toast.error('İşlem sırasında hata oluştu');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: caseDetail?.title,
          text: caseDetail?.summary,
          url: url,
        });
      } catch (error) {
        console.log('Paylaşım iptal edildi');
      }
    } else {
      // Fallback: URL'yi panoya kopyala
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link panoya kopyalandı!');
      } catch (error) {
        toast.error('Link kopyalanırken hata oluştu');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!caseDetail) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Karar Bulunamadı</h1>
          <p className="text-muted-foreground mb-6">
            Aradığınız karar mevcut değil veya kaldırılmış olabilir.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard'a Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF İndir
            </Button>
            <Button 
              variant={isSaved ? "default" : "outline"} 
              onClick={handleSave}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              {isSaved ? 'Kaydedildi' : 'Kaydet'}
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Paylaş
            </Button>
          </div>
        </div>

        {/* Case Info Card */}
        <Card>
          <CardHeader>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {caseDetail.isNew && (
                <Badge variant="default" className="bg-green-500">
                  <Clock className="h-3 w-3 mr-1" />
                  Yeni
                </Badge>
              )}
              {caseDetail.isPopular && (
                <Badge variant="secondary">
                  <Star className="h-3 w-3 mr-1" />
                  Popüler
                </Badge>
              )}
              {caseDetail.relevanceScore && caseDetail.relevanceScore > 8 && (
                <Badge variant="outline">
                  <Star className="h-3 w-3 mr-1" />
                  Yüksek İlgi
                </Badge>
              )}
            </div>

            <CardTitle className="text-2xl leading-tight">
              {caseDetail.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Mahkeme:</span>
                <span>{caseDetail.court}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Daire:</span>
                <span>{caseDetail.department}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Tarih:</span>
                <span>{new Date(caseDetail.date).toLocaleDateString('tr-TR')}</span>
              </div>
              
              {caseDetail.caseNumber && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Esas No:</span>
                  <span>{caseDetail.caseNumber}</span>
                </div>
              )}
              
              {caseDetail.citationCount && (
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Atıf Sayısı:</span>
                  <span>{caseDetail.citationCount}</span>
                </div>
              )}
              
              {caseDetail.relevanceScore && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">İlgi Düzeyi:</span>
                  <span>{caseDetail.relevanceScore.toFixed(1)}/10</span>
                </div>
              )}
            </div>

            {/* Keywords */}
            {caseDetail.keywords && caseDetail.keywords.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Anahtar Kelimeler</h3>
                <div className="flex flex-wrap gap-1">
                  {caseDetail.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Summary */}
            <div>
              <h3 className="font-medium mb-2">Özet</h3>
              <p className="text-muted-foreground leading-relaxed">
                {caseDetail.summary}
              </p>
            </div>

            <Separator />

            {/* Full Text */}
            <div>
              <h3 className="font-medium mb-4">Tam Metin</h3>
              <div className="prose max-w-none">
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {caseDetail.fullText}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaseDetail;