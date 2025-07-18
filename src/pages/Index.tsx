
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Search, Scale, BookOpen, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { APP_CONFIG } from '@/constants';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: 'Gelişmiş Arama',
      description: 'AI destekli akıllı arama ile binlerce hukuki karara hızlıca ulaşın.'
    },
    {
      icon: Scale,
      title: 'Yargıtay Kararları',
      description: 'Güncel Yargıtay kararlarını kategorize edilmiş şekilde inceleyin.'
    },
    {
      icon: BookOpen,
      title: 'Mevzuat Veritabanı',
      description: 'Kapsamlı mevzuat veritabanı ile yasalara kolayca erişin.'
    },
    {
      icon: Users,
      title: 'Uzman Analizi',
      description: 'AI analizi ile karmaşık hukuki metinleri basit dilde açıklama.'
    }
  ];

  const stats = [
    { label: 'Hukuki Karar', value: '50,000+' },
    { label: 'Aktif Kullanıcı', value: '5,000+' },
    { label: 'Mevzuat Maddesi', value: '100,000+' },
    { label: 'Günlük Arama', value: '10,000+' }
  ];

  const benefits = [
    'Zaman tasarrufu sağlayan akıllı arama',
    'Güncel ve doğrulanmış hukuki içerik',
    'Kullanıcı dostu arayüz tasarımı',
    'Mobil uyumlu responsive tasarım',
    '7/24 erişilebilir platform',
    'Güvenli ve şifreli veri koruması'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-2">
              🚀 Yapay Zeka Destekli Hukuki Araştırma Platformu
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {APP_CONFIG.name}
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Türkiye'nin en kapsamlı hukuki veritabanında AI destekli arama yapın. 
              Yargıtay kararları, mevzuat ve içtihatları saniyeler içinde bulun.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/search')}
                className="px-8 py-3 text-base font-semibold"
              >
                Aramaya Başla
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/pricing')}
                className="px-8 py-3 text-base"
              >
                Fiyatları İncele
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Neden {APP_CONFIG.name}?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern teknoloji ile hukuki araştırmanızı hızlandırın ve daha etkili sonuçlar elde edin.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Avantajları</h2>
            <p className="text-muted-foreground">
              Hukuki araştırmanızda size sağladığımız değerli avantajlar
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">
                Hukuki Araştırmanızı Bugün Başlatın
              </CardTitle>
              <CardDescription className="text-lg">
                Ücretsiz hesabınızı oluşturun ve platformun tüm özelliklerini keşfedin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="px-8 py-3"
                >
                  Ücretsiz Hesap Oluştur
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/about')}
                  className="px-8 py-3"
                >
                  Daha Fazla Bilgi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
