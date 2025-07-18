
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, ArrowRight, Star } from 'lucide-react';
import { subscriptionPlans } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

const features = [
  {
    name: 'Aylık Arama Limiti',
    basic: '50 arama',
    premium: '250 arama'
  },
  {
    name: 'Karar Özeti',
    basic: 'Temel özet',
    premium: 'Detaylı analiz'
  },
  {
    name: 'PDF İndirme',
    basic: '✓',
    premium: '✓'
  },
  {
    name: 'Gelişmiş Filtreleme',
    basic: '❌',
    premium: '✓'
  },
  {
    name: 'Tam Metin Erişimi',
    basic: '❌',
    premium: '✓'
  },
  {
    name: 'Benzer Karar Önerileri',
    basic: '❌',
    premium: '✓'
  },
  {
    name: 'Özel Notlar',
    basic: '❌',
    premium: '✓'
  },
  {
    name: 'İstatistikler',
    basic: '❌',
    premium: '✓'
  },
  {
    name: 'Destek',
    basic: 'E-posta',
    premium: 'Öncelikli'
  }
];

const testimonials = [
  {
    name: 'Av. Mehmet Yılmaz',
    role: 'Hukuk Bürosu Sahibi',
    content: 'Premium plan ile araştırma sürem %80 azaldı. Kesinlikle tavsiye ediyorum.',
    rating: 5
  },
  {
    name: 'Av. Ayşe Demir',
    role: 'İş Hukuku Uzmanı',
    content: 'Gelişmiş filtreleme özelliği sayesinde tam istediğim kararları buluyorum.',
    rating: 5
  }
];

export default function Pricing() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const getCurrentPlan = () => {
    return subscriptionPlans.find(plan => plan.id === profile?.plan) || subscriptionPlans[0];
  };

  const isCurrentPlan = (planId: string) => {
    return profile?.plan === planId;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 pt-8">
            <Badge variant="secondary" className="mb-4">
              <Crown className="h-4 w-4 mr-2" />
              Fiyatlandırma
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Size Uygun Planı Seçin
            </h1>
            <div className="space-y-4">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                🔥 %50 Özel İndirim - Kısa Süreliğine!
              </Badge>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Hukuki araştırma ihtiyaçlarınıza göre tasarlanmış esnek fiyatlandırma seçenekleri. 
                7 gün ücretsiz deneme ile hemen başlayın.
              </p>
            </div>
          </div>

          {/* Current Plan Status */}
          {profile && (
            <Card className="max-w-md mx-auto mb-12">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Mevcut Planınız</p>
                    <p className="font-semibold text-lg">{getCurrentPlan().name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Bu Ay Kullanılan</p>
                    <p className="font-semibold">
                      Sınırsız arama
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {subscriptionPlans.map((plan) => {
              const current = isCurrentPlan(plan.id);
              
              return (
                <Card 
                  key={plan.id}
                  className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''} ${current ? 'ring-2 ring-primary' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        En Popüler
                      </Badge>
                    </div>
                  )}
                  
                  {current && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="secondary">
                        Mevcut Plan
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                      {plan.id === 'basic' ? (
                        <Zap className="h-8 w-8 text-primary" />
                      ) : (
                        <Crown className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    
                    {/* Discount Badge */}
                    <div className="mb-2">
                      <Badge variant="destructive" className="text-sm">
                        %50 Özel İndirim - Kısa Süreliğine!
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      {plan.originalPrice && (
                        <div className="text-lg text-muted-foreground line-through">
                          {plan.originalPrice}₺/ay
                        </div>
                      )}
                      <div className="text-4xl font-bold text-primary">
                        {plan.price}₺
                        <span className="text-lg font-normal text-muted-foreground">/ay</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      {plan.id === 'basic' ? 'Başlangıç seviyesi kullanım' : 'Profesyonel hukuk pratiği'}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className="w-full" 
                      variant={current ? "outline" : plan.popular ? "default" : "outline"}
                      disabled={current}
                      onClick={() => navigate('/register')}
                    >
                      {current ? 'Mevcut Planınız' : 'Hemen Başlayın'}
                      {!current && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Features Comparison */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Detaylı Karşılaştırma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4 font-semibold">Özellik</th>
                      <th className="text-center py-4 px-4 font-semibold">Basic</th>
                      <th className="text-center py-4 px-4 font-semibold">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-4 px-4 font-medium">{feature.name}</td>
                        <td className="text-center py-4 px-4">{feature.basic}</td>
                        <td className="text-center py-4 px-4">{feature.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Müşteri Yorumları</h2>
              <p className="text-xl text-muted-foreground">
                Hukuk profesyonellerinin TurkLaw AI deneyimleri
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-secondary fill-current" />
                      ))}
                    </div>
                    <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Sık Sorulan Sorular</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Planımı istediğim zaman değiştirebilir miyim?</h3>
                  <p className="text-muted-foreground">
                    Evet, planınızı istediğiniz zaman yükseltebilir veya düşürebilirsiniz. 
                    Değişiklik hemen geçerli olur.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Ücretsiz deneme süresi nedir?</h3>
                  <p className="text-muted-foreground">
                    Her plan için 7 gün ücretsiz deneme süresi sunuyoruz. 
                    Bu süre içinde iptal edebilirsiniz.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Arama limiti nasıl çalışır?</h3>
                  <p className="text-muted-foreground">
                    Arama limitleri aylık olarak sıfırlanır. 
                    Limit dolduğunda plan yükseltme yapabilirsiniz.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Kurumsal indirimler var mı?</h3>
                  <p className="text-muted-foreground">
                    5+ kullanıcı için özel kurumsal fiyatlandırma mevcuttur. 
                    İletişim sayfasından bizimle iletişime geçin.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-hero text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Hukuki Araştırmalarınızı Dönüştürün
              </h2>
              <p className="text-xl mb-8 opacity-90">
                7 gün ücretsiz deneme ile TurkLaw AI'ın gücünü keşfedin
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate('/register')}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Hemen Başlayın
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/contact')}
                  className="border-white text-white hover:bg-white/10"
                >
                  Satış Ekibi ile Konuşun
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
