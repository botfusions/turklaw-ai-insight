import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Av. Mehmet Yılmaz",
    title: "Hukuk Bürosu Sahibi",
    company: "Yılmaz Hukuk",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "TurkLaw AI sayesinde araştırma sürem %80 azaldı. Özellikle emsal kararları bulma konusunda müthiş bir platform.",
    rating: 5,
    highlight: "Araştırma sürem %80 azaldı"
  },
  {
    id: 2,
    name: "Av. Ayşe Demir",
    title: "İş Hukuku Uzmanı",
    company: "Demir & Ortakları",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=100&h=100&fit=crop&crop=face",
    content: "AI destekli arama özelliği gerçekten çok etkileyici. Karmaşık hukuki konularda bile saniyeler içinde sonuç alabiliyorum.",
    rating: 5,
    highlight: "Saniyeler içinde sonuç"
  },
  {
    id: 3,
    name: "Prof. Dr. Ali Kaya",
    title: "Hukuk Fakültesi Öğretim Üyesi",
    company: "İstanbul Üniversitesi",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "Öğrencilerime de tavsiye ediyorum. Güncel kararlara hızlı erişim akademik çalışmalar için çok değerli.",
    rating: 5,
    highlight: "Akademik çalışmalar için ideal"
  },
  {
    id: 4,
    name: "Av. Fatma Öz",
    title: "Ceza Hukuku Uzmanı",
    company: "Öz Hukuk Bürosu",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "Platform hem kullanıcı dostu hem de çok kapsamlı. Özellikle filtreleme seçenekleri mükemmel.",
    rating: 5,
    highlight: "Kullanıcı dostu arayüz"
  },
  {
    id: 5,
    name: "Av. Mustafa Arslan",
    title: "Ticaret Hukuku Uzmanı",
    company: "Arslan Legal",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    content: "Müvekkillerime daha hızlı ve kaliteli hizmet verebiliyorum. ROI'si çok yüksek bir yatırım.",
    rating: 5,
    highlight: "Müvekkil memnuniyeti arttı"
  },
  {
    id: 6,
    name: "Av. Zeynep Şahin",
    title: "Aile Hukuku Uzmanı",
    company: "Şahin Hukuk",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    content: "Karmaşık aile hukuku davalarında precedent'leri bulmak artık çok kolay. Harika bir araç!",
    rating: 5,
    highlight: "Precedent bulma kolaylığı"
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Müşteri Yorumları
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Hukukçular
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Ne Diyor?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Binlerce hukukçunun güvendiği platform ile çalışmalarını nasıl dönüştürdüklerini keşfedin.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="relative bg-background hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-muted hover:border-primary/20 animate-fade-in hover-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Highlight */}
                <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                  ✨ {testimonial.highlight}
                </Badge>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary p-0.5">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full rounded-full object-cover bg-background"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium hidden">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                    <p className="text-xs text-primary">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">4.9/5</div>
              <div className="text-sm text-muted-foreground">Ortalama Puan</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">2000+</div>
              <div className="text-sm text-muted-foreground">Mutlu Müşteri</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">50K+</div>
              <div className="text-sm text-muted-foreground">Başarılı Arama</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">%95</div>
              <div className="text-sm text-muted-foreground">Tavsiye Oranı</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};