import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Gavel, BookOpen, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-muted/40 py-20 lg:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 animate-fade-in">
            <Star className="w-3 h-3 mr-1" />
            Türkiye'nin en kapsamlı hukuki arama motoru
          </Badge>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in [animation-delay:0.1s]">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Hukuki Araştırmanızı
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Hızlandırın
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in [animation-delay:0.2s]">
            Yapay zeka destekli arama teknolojisiyle mahkeme kararları, mevzuat ve emsal karar 
            veritabanında saniyeler içinde istediğiniz sonuçlara ulaşın.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in [animation-delay:0.3s]">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-3 text-lg hover-scale"
              onClick={() => navigate('/register')}
            >
              <Search className="w-5 h-5 mr-2" />
              Ücretsiz Başlayın
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 hover:bg-muted/50 px-8 py-3 text-lg hover-scale"
              onClick={() => navigate('/login')}
            >
              <Gavel className="w-5 h-5 mr-2" />
              Giriş Yapın
            </Button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-in [animation-delay:0.4s]">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">1M+</div>
              <div className="text-sm text-muted-foreground">Mahkeme Kararı</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">50K+</div>
              <div className="text-sm text-muted-foreground">Mevzuat</div>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">10K+</div>
              <div className="text-sm text-muted-foreground">Aktif Kullanıcı</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};