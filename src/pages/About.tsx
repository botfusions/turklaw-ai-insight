import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Scale, 
  Users, 
  Target, 
  Award,
  Heart,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const teamMembers = [
  {
    name: 'Dr. Ahmet Yılmaz',
    role: 'Kurucu & CEO',
    description: 'Hukuk Doktoru, 15 yıl hukuk pratiği deneyimi',
    image: '/api/placeholder/150/150'
  },
  {
    name: 'Ayşe Demir',
    role: 'CTO',
    description: 'Yazılım Mühendisi, AI ve Machine Learning uzmanı',
    image: '/api/placeholder/150/150'
  },
  {
    name: 'Mehmet Özkan',
    role: 'Hukuk Danışmanı',
    description: 'Yargıtay eski raportörü, 20 yıl deneyim',
    image: '/api/placeholder/150/150'
  }
];

const values = [
  {
    icon: Target,
    title: 'Doğruluk',
    description: 'Her zaman doğru ve güncel hukuki bilgi sağlamayı taahhüt ediyoruz.'
  },
  {
    icon: Users,
    title: 'Kullanıcı Odaklılık',
    description: 'Kullanıcılarımızın ihtiyaçlarını önceleyerek çözümler geliştiriyoruz.'
  },
  {
    icon: Lightbulb,
    title: 'İnovasyon',
    description: 'Teknoloji ile hukuk alanında yenilikçi çözümler sunuyoruz.'
  },
  {
    icon: Heart,
    title: 'Güvenilirlik',
    description: 'Güvenilir ve sürdürülebilir hukuki araştırma platformu sağlıyoruz.'
  }
];

const stats = [
  { number: '100,000+', label: 'Karar Arşivi' },
  { number: '5,000+', label: 'Aktif Kullanıcı' },
  { number: '50+', label: 'Mahkeme' },
  { number: '99.9%', label: 'Uptime' }
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 pt-8">
            <Badge variant="secondary" className="mb-4">
              <Scale className="h-4 w-4 mr-2" />
              Hakkımızda
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Hukuk ve Teknoloji Bir Arada
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              TurkLaw AI, Türk hukuk sisteminde yapay zeka destekli araştırma yapmanızı sağlayan 
              yenilikçi bir platformdur. Hukuk profesyonellerinin ihtiyaçlarını anlayarak, 
              en gelişmiş teknoloji ile hukuki araştırma deneyimini yeniden tanımlıyoruz.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center bg-card shadow-card">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mission Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Misyonumuz</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Hukuk profesyonellerinin araştırma süreçlerini hızlandırmak ve kaliteli hukuki bilgiye 
                erişimini kolaylaştırmak için yapay zeka teknolojilerini kullanarak yenilikçi çözümler 
                geliştiriyoruz.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-success mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Hızlı Araştırma</h3>
                    <p className="text-sm text-muted-foreground">
                      Saniyeler içinde ilgili kararları bulun
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-success mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Doğru Sonuçlar</h3>
                    <p className="text-sm text-muted-foreground">
                      AI destekli analiz ile en alakalı sonuçlar
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-success mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Güncel Arşiv</h3>
                    <p className="text-sm text-muted-foreground">
                      Sürekli güncellenen karar veri tabanı
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-hero rounded-2xl p-8 text-white">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">%80 Zaman Tasarrufu</h3>
                  <p className="text-sm opacity-90">Geleneksel araştırmaya kıyasla</p>
                </div>
                <div className="text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Güvenli Platform</h3>
                  <p className="text-sm opacity-90">Enterprise düzeyde güvenlik</p>
                </div>
                <div className="text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">7/24 Erişim</h3>
                  <p className="text-sm opacity-90">Kesintisiz hizmet</p>
                </div>
                <div className="text-center">
                  <Award className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Kalite Garantisi</h3>
                  <p className="text-sm opacity-90">Doğruluğu onaylanmış veriler</p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Değerlerimiz</h2>
              <p className="text-lg text-muted-foreground">
                TurkLaw AI'ı yönlendiren temel ilkeler
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center bg-card shadow-card hover:shadow-hover transition-all">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ekibimiz</h2>
              <p className="text-lg text-muted-foreground">
                Hukuk ve teknoloji alanında deneyimli profesyoneller
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center bg-card shadow-card">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-hero text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Hukuki Araştırmalarınızı Dönüştürün
              </h2>
              <p className="text-xl mb-8 opacity-90">
                TurkLaw AI ile hukuki araştırma deneyiminizi geliştirin
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate('/register')}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Ücretsiz Deneyin
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/contact')}
                  className="border-white text-white hover:bg-white/10"
                >
                  İletişime Geçin
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