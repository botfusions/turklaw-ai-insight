import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Star, 
  Users, 
  Clock, 
  Shield,
  CheckCircle,
  Sparkles
} from "lucide-react";

const benefits = [
  "7 gün ücretsiz deneme",
  "1M+ mahkeme kararına erişim", 
  "AI destekli akıllı arama",
  "7/24 Türkçe destek",
  "KVKK uyumlu güvenlik",
  "İptal garantisi"
];

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-primary/5 via-accent/5 to-muted/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <Badge variant="secondary" className="mb-6 animate-fade-in">
            <Sparkles className="w-3 h-3 mr-1" />
            Şimdi Başlayın
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fade-in [animation-delay:0.1s]">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Hukuki Araştırmalarınızı
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Bugün Dönüştürün
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in [animation-delay:0.2s]">
            Binlerce hukukçunun tercih ettiği AI destekli platform ile çalışmalarınızı 
            hızlandırın ve rekabet avantajı elde edin.
          </p>

          {/* Main CTA Card */}
          <Card className="bg-background/80 backdrop-blur-md border-primary/20 shadow-xl mb-8 animate-fade-in [animation-delay:0.3s]">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left: Benefits */}
                <div className="text-left space-y-4">
                  <h3 className="text-xl font-semibold mb-4">
                    Neler dahil:
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {benefits.map((benefit, index) => (
                      <div 
                        key={index}
                        className="flex items-center space-x-3 animate-fade-in"
                        style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: CTA */}
                <div className="text-center lg:text-right space-y-6">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">₺99/ay</div>
                    <div className="text-sm text-muted-foreground">İlk 7 gün ücretsiz</div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      size="lg" 
                      className="w-full lg:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-4 text-lg hover-scale"
                      onClick={() => navigate('/register')}
                    >
                      <Star className="w-5 h-5 mr-2" />
                      Ücretsiz Denemeyi Başlat
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full lg:w-auto border-2 hover:bg-muted/50 px-8 py-4 text-lg hover-scale"
                      onClick={() => navigate('/login')}
                    >
                      Zaten hesabım var
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    💳 Kredi kartı gerektirmez • ⚡ Anında aktivasyon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in [animation-delay:0.5s]">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-sm font-medium">2000+ Aktif Kullanıcı</div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-sm font-medium">4.9/5 Kullanıcı Puanı</div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <Clock className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-sm font-medium">%80 Zaman Tasarrufu</div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-sm font-medium">KVKK Uyumlu</div>
            </div>
          </div>

          {/* Final Message */}
          <div className="mt-8 animate-fade-in [animation-delay:0.6s]">
            <p className="text-sm text-muted-foreground">
              ⭐ Türkiye'nin en büyük hukuki araştırma platformuna katılın
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};