import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    id: 1,
    question: "TurkLaw AI nasıl çalışır?",
    answer: "TurkLaw AI, gelişmiş yapay zeka algoritmaları kullanarak Türk hukuk sistemindeki tüm mahkeme kararlarını, mevzuatı ve emsal kararları analiz eder. Doğal dil işleme teknolojisi sayesinde sorgunuzu anlayıp en ilgili sonuçları saniyeler içinde getirir."
  },
  {
    id: 2,
    question: "Hangi mahkeme kararlarına erişebilirim?",
    answer: "Platformumuzda Yargıtay, Danıştay, Anayasa Mahkemesi, Bölge Adliye Mahkemeleri ve İdare Mahkemelerinin 1 milyondan fazla kararına erişebilirsiniz. Veriler günlük olarak güncellenmektedir."
  },
  {
    id: 3,
    question: "Ücretsiz deneme sürümü var mı?",
    answer: "Evet! 7 gün boyunca tamamen ücretsiz olarak tüm özelliklerimizi deneyebilirsiniz. Kredi kartı bilgisi gerektirmez, istediğiniz zaman iptal edebilirsiniz."
  },
  {
    id: 4,
    question: "Arama sonuçlarının doğruluğu nasıl sağlanıyor?",
    answer: "Tüm veriler resmi kaynaklardan alınır ve uzman hukukçular tarafından kontrol edilir. AI sistemimiz sürekli öğrenir ve %98+ doğruluk oranıyla sonuçlar sunar. Her karar için kaynak bilgileri detaylı şekilde belirtilir."
  },
  {
    id: 5,
    question: "Mobil uygulamanız var mı?",
    answer: "Şu anda web platformumuz tamamen mobil uyumludur ve tüm cihazlarda mükemmel çalışır. Yakında iOS ve Android için özel uygulamalarımızı da yayınlayacağız."
  },
  {
    id: 6,
    question: "Fiyatlandırma nasıl işliyor?",
    answer: "Bireysel kullanıcılar için aylık 99₺'den başlayan planlarımız var. Hukuk büroları için özel kurumsal paketler sunuyoruz. Tüm planlar 7 gün ücretsiz deneme ile gelir."
  },
  {
    id: 7,
    question: "Verilerim güvende mi?",
    answer: "Verileriniz 256-bit SSL şifreleme ile korunur ve hiçbir zaman üçüncü taraflarla paylaşılmaz. KVKK ve GDPR standartlarına tam uyumluyuz. Arama geçmişiniz sadece size aittir."
  },
  {
    id: 8,
    question: "Teknik destek alabilir miyim?",
    answer: "Elbette! Email, canlı chat ve telefon üzerinden 7/24 Türkçe destek sunuyoruz. Ayrıca kapsamlı video eğitimleri ve kullanım kılavuzları da mevcuttur."
  }
];

export const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([1]); // İlk soru açık

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const isOpen = (id: number) => openItems.includes(id);

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <HelpCircle className="w-3 h-3 mr-1" />
            Sık Sorulan Sorular
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Merak Ettiklerinizi
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Yanıtladık
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            TurkLaw AI hakkında en çok merak edilen soruları ve yanıtlarını burada bulabilirsiniz.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {faqs.map((faq, index) => (
              <Card 
                key={faq.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-md border-muted hover:border-primary/20 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Button
                  variant="ghost"
                  className="w-full p-0 h-auto hover:bg-transparent"
                  onClick={() => toggleItem(faq.id)}
                >
                  <CardContent className="p-6 w-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-left font-semibold text-foreground group-hover:text-primary transition-colors">
                        {faq.question}
                      </h3>
                      <div className="ml-4 flex-shrink-0">
                        {isOpen(faq.id) ? (
                          <ChevronUp className="h-5 w-5 text-primary" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    <div className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen(faq.id) 
                        ? "max-h-96 opacity-100 mt-4" 
                        : "max-h-0 opacity-0"
                    )}>
                      <p className="text-left text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </CardContent>
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 max-w-lg mx-auto">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">
                Başka sorularınız mı var?
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Uzman ekibimiz size yardımcı olmaktan mutluluk duyar.
              </p>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                İletişime Geçin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};