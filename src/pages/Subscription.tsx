
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Building, Zap } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Ücretsiz',
    price: 0,
    priceText: 'Ücretsiz',
    description: 'Temel kullanım için',
    icon: Zap,
    features: [
      '5 arama/ay',
      'Temel karar özeti',
      'PDF indirme',
      'E-posta desteği'
    ],
    maxSearches: 5,
    popular: false
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 850,
    originalPrice: 1700,
    priceText: '850 ₺/ay',
    description: 'Başlangıç seviyesi kullanım',
    icon: Zap,
    features: [
      '50 arama/ay',
      'Temel karar özeti',
      'PDF indirme',
      'E-posta desteği',
      '7 gün ücretsiz deneme'
    ],
    maxSearches: 50,
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2750,
    originalPrice: 5500,
    priceText: '2750 ₺/ay',
    description: 'Profesyonel hukuk pratiği',
    icon: Crown,
    features: [
      '250 arama/ay',
      'Detaylı AI analizi',
      'Gelişmiş filtreleme',
      'Tam metin erişimi',
      'Benzer karar önerileri',
      'Özel notlar',
      'İstatistikler',
      'Öncelikli destek',
      '7 gün ücretsiz deneme'
    ],
    maxSearches: 250,
    popular: true
  }
];

export default function Subscription() {
  const { profile } = useAuth();

  const getCurrentPlan = () => {
    return plans.find(plan => plan.id === profile?.plan) || plans[0];
  };

  const isCurrentPlan = (planId: string) => {
    return profile?.plan === planId;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Abonelik Planları
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              İhtiyacınıza uygun planı seçin ve TurkLaw AI'ın tüm gücünü keşfedin
            </p>
            
            {/* Current Plan Status */}
            {profile && (
              <Card className="max-w-md mx-auto mb-8">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Mevcut Planınız</p>
                      <p className="font-semibold">{getCurrentPlan().name}</p>
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
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
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
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    
                    {/* Discount Badge for paid plans */}
                    {plan.id !== 'free' && (
                      <div className="mb-2">
                        <Badge variant="destructive" className="text-sm">
                          %50 Özel İndirim!
                        </Badge>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      {plan.originalPrice && (
                        <div className="text-lg text-muted-foreground line-through">
                          {plan.originalPrice} ₺/ay
                        </div>
                      )}
                      <div className="text-3xl font-bold text-primary">
                        {plan.priceText}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
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
                    >
                      {current ? 'Mevcut Planınız' : plan.id === 'free' ? 'Ücretsiz Başlayın' : 'Plana Geç'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Features Comparison */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">Özellik Karşılaştırması</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Özellik</th>
                      <th className="text-center py-3 px-4">Ücretsiz</th>
                      <th className="text-center py-3 px-4">Basic</th>
                      <th className="text-center py-3 px-4">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-3 px-4">Aylık Arama Limiti</td>
                      <td className="text-center py-3 px-4">5</td>
                      <td className="text-center py-3 px-4">50</td>
                      <td className="text-center py-3 px-4">250</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Tam Metin Erişimi</td>
                      <td className="text-center py-3 px-4">❌</td>
                      <td className="text-center py-3 px-4">❌</td>
                      <td className="text-center py-3 px-4">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Gelişmiş Filtreler</td>
                      <td className="text-center py-3 px-4">❌</td>
                      <td className="text-center py-3 px-4">❌</td>
                      <td className="text-center py-3 px-4">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">İstatistikler</td>
                      <td className="text-center py-3 px-4">❌</td>
                      <td className="text-center py-3 px-4">❌</td>
                      <td className="text-center py-3 px-4">✅</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Destek</td>
                      <td className="text-center py-3 px-4">E-posta</td>
                      <td className="text-center py-3 px-4">E-posta</td>
                      <td className="text-center py-3 px-4">Öncelikli</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* VAT Disclaimer */}
          <div className="text-center text-sm text-muted-foreground mb-8">
            <p>Fiyatlarımıza KDV dahil değildir.</p>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Özel İhtiyaçlarınız mı Var?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Kurumsal çözümler, özel entegrasyonlar veya toplu lisanslama için 
              bizimle iletişime geçin. Size özel bir teklif hazırlayalım.
            </p>
            <Button size="lg">
              Satış Ekibi ile İletişime Geç
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
