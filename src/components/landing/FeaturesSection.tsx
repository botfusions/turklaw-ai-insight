import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  Shield,
  Zap,
  BookOpen,
  Users
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Yapay Zeka Destekli Arama",
    description: "Gelişmiş NLP algoritmaları ile doğal dil sorgularınızı anlayıp en ilgili sonuçları getirir.",
    badge: "AI Powered",
    color: "text-blue-600"
  },
  {
    icon: Search,
    title: "Kapsamlı Veritabanı",
    description: "Tüm mahkeme kararları, mevzuat ve emsal kararları tek platformda. Sürekli güncellenen içerik.",
    badge: "1M+ Karar",
    color: "text-green-600"
  },
  {
    icon: Filter,
    title: "Gelişmiş Filtreleme",
    description: "Mahkeme, tarih aralığı, daire ve konu bazında detaylı filtreleme seçenekleri.",
    badge: "Smart Filter",
    color: "text-purple-600"
  },
  {
    icon: Download,
    title: "Export ve Paylaşım",
    description: "Sonuçlarınızı PDF, Word formatlarında indirin ve ekibinizle kolayca paylaşın.",
    badge: "Multi Format",
    color: "text-orange-600"
  },
  {
    icon: Clock,
    title: "Hızlı Sonuçlar",
    description: "Saniyeler içinde binlerce döküman arasından en ilgili sonuçları bulun.",
    badge: "Ultra Fast",
    color: "text-red-600"
  },
  {
    icon: Shield,
    title: "Güvenli Platform",
    description: "Verileriniz 256-bit SSL şifreleme ile korunur. KVKK uyumlu güvenli altyapı.",
    badge: "KVKK Uyumlu",
    color: "text-indigo-600"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Özellikler
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Hukuki Araştırmanızı
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Dönüştüren Özellikler
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Modern teknoloji ile hukuki araştırma sürecinizi hızlandıran ve kolaylaştıran özellikler.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-muted hover:border-primary/20 animate-fade-in hover-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-muted/50 ${feature.color}`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Hukuki araştırmalarınızı profesyonel seviyeye taşıyın
              </h3>
              <p className="text-muted-foreground mb-4">
                Binlerce hukukçunun tercih ettiği platform ile çalışmalarınızı hızlandırın.
              </p>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <BookOpen className="w-3 h-3 mr-1" />
                7 gün ücretsiz deneme
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};