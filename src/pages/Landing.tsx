import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardPreview } from '@/components/dashboard/DashboardPreview';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';
import { useSmartLoading } from '@/contexts/SmartLoadingContext';
import { SmartLoader } from '@/components/ui/SmartLoader';
import { AuthSkeleton, DashboardSkeleton } from '@/components/ui/SkeletonLoaders';
import { 
  Search, 
  Zap, 
  Shield, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  Scale,
  Clock,
  Database,
  TrendingUp,
  Award,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { subscriptionPlans } from '@/constants';

export default function Landing() {
  const navigate = useNavigate();
  
  // Use optimized auth hook with smart loading states
  const {
    // Optimized states
    isInitializing,
    isReady,
    hasAuthError,
    isUserAuthenticated,
    isProfileLoading,
    isActionInProgress,
    canRenderApp,
    // Original auth context
    authError,
    profileError,
    clearAuthError,
    clearProfileError,
    refreshProfile
  } = useOptimizedAuth();

  const { isCriticalLoading, isBackgroundLoading } = useSmartLoading();

  console.log('Landing: Optimized auth states:', { 
    isInitializing,
    isReady,
    hasAuthError,
    isUserAuthenticated,
    isProfileLoading,
    isActionInProgress,
    canRenderApp,
    isCriticalLoading: isCriticalLoading(),
    isBackgroundLoading: isBackgroundLoading()
  });

  // Show smart loading for critical operations
  if (isCriticalLoading()) {
    console.log('Landing: Showing critical loading with Smart Loader');
    return (
      <SmartLoader
        type="auth"
        skeleton={<AuthSkeleton />}
        progressBar={true}
        timeout={8000}
        onTimeout={() => console.log('Auth loading timed out')}
        onRetry={() => {
          console.log('Retrying auth...');
          refreshProfile();
        }}
      />
    );
  }

  // Show auth error with recovery options
  if (hasAuthError && authError) {
    console.log('Landing: Showing auth error recovery:', authError);
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto space-y-6">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="mt-2">
                  {authError}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    clearAuthError();
                    refreshProfile();
                  }}
                  className="w-full"
                  variant="default"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Tekrar Dene
                </Button>
                
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full"
                  variant="outline"
                >
                  Giriş Yap
                </Button>
                
                <Button 
                  onClick={clearAuthError}
                  className="w-full"
                  variant="ghost"
                >
                  Devam Et
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // Can't render app due to critical issues
  if (!canRenderApp) {
    console.log('Landing: Cannot render app, showing smart loading fallback');
    return (
      <SmartLoader
        type="auth"
        skeleton={<AuthSkeleton />}
        timeout={10000}
        fallback="error"
      />
    );
  }

  // Static data
  const features = [
    {
      icon: Search,
      title: 'AI Destekli Araştırma',
      description: 'Gelişmiş yapay zeka algoritmaları ile saniyeler içinde ilgili kararları bulun'
    },
    {
      icon: Database,
      title: '100,000+ Karar',
      description: 'Yargıtay, Danıştay ve tüm mahkemelerden güncel karar arşivi'
    },
    {
      icon: Clock,
      title: 'Anında Sonuç',
      description: 'Geleneksel araştırma yöntemlerinden 10x daha hızlı sonuç alın'
    },
    {
      icon: Shield,
      title: 'Güvenli Platform',
      description: 'Verileriniz en yüksek güvenlik standartlarıyla korunur'
    }
  ];

  const testimonials = [
    {
      name: 'Av. Mehmet Özkan',
      title: 'Hukuk Bürosu Sahibi',
      content: 'TurkLaw AI sayesinde araştırma sürem %80 azaldı. Müvekkillerime daha kaliteli hizmet verebiliyorum.',
      rating: 5
    },
    {
      name: 'Av. Ayşe Demir',
      title: 'İş Hukuku Uzmanı',
      content: 'Emsal kararları bulmak hiç bu kadar kolay olmamıştı. Platform gerçekten etkileyici.',
      rating: 5
    },
    {
      name: 'Hukuk Firması ABC',
      title: 'Kurumsal Müşteri',
      content: 'Tüm ekibimiz TurkLaw AI kullanıyor. Verimliliğimiz önemli ölçüde arttı.',
      rating: 5
    }
  ];

  console.log('Landing: Rendering main content. User authenticated:', isUserAuthenticated);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Show profile error if present but don't block the page */}
      {profileError && (
        <div className="container mx-auto px-4 pt-4">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {profileError}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearProfileError}
                className="ml-2"
              >
                ✕
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Show smart loading for actions */}
      <SmartLoader
        type="action"
        progressBar={true}
        showNetworkStatus={true}
        className="fixed top-4 right-4 z-50"
      />
      
      {isUserAuthenticated ? (
        // Authenticated User View
        <>
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50"></div>
            <div className="container mx-auto px-4 relative">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <Badge variant="secondary" className="mb-4">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Aktif Kullanıcı Dashboard
                    {isProfileLoading && (
                      <span className="ml-2">
                        <SmartLoader 
                          type="profile" 
                          className="inline-flex items-center text-xs"
                        />
                      </span>
                    )}
                  </Badge>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                    Hukuki Araştırmalarınıza
                    <span className="text-primary block">Devam Edin</span>
                  </h1>
                  
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Dashboard'unuzda son aramalarınızı görün ve yeni aramalar yapın
                  </p>
                </div>

                <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border shadow-2xl">
                  <SmartLoader
                    type="data"
                    skeleton={<DashboardSkeleton />}
                    progressBar={true}
                    showNetworkStatus={false}
                  >
                    <DashboardPreview />
                  </SmartLoader>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Başarı Hikayeleri
                </h2>
                <p className="text-xl text-muted-foreground">
                  Sizin gibi hukuk profesyonellerinin başarı hikayeleri
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.slice(0, 2).map((testimonial, index) => (
                  <Card key={index} className="bg-card shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        // Guest User View with Smart Loading
        <>
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50"></div>
            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="secondary" className="mb-6">
                  🚀 Türkiye'nin İlk AI Destekli Hukuk Platformu
                </Badge>
                
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                  Türk Hukukunda
                  <span className="text-primary block">AI Destekli Araştırma</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Yargıtay, Danıştay ve Emsal kararlarını saniyeler içinde bulun. 
                  100,000+ karar, AI destekli analiz, mobil uyumlu platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/register')}
                    disabled={isActionInProgress}
                    className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
                  >
                    {isActionInProgress ? 'İşlem yapılıyor...' : 'Ücretsiz Deneyin'}
                    {!isActionInProgress && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/search')}
                    disabled={isActionInProgress}
                    className="text-lg px-8 py-6"
                  >
                    Demo İzle
                  </Button>
                </div>
                
                <div className="flex items-center justify-center space-x-8 mt-12 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    7 gün ücretsiz deneme
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Anında aktivasyon
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    İptal etmek istediğinizde
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Neden TurkLaw AI?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Modern hukuk pratiği için tasarlanmış en gelişmiş araştırma araçları
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="bg-card shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="text-center">
                      <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
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

          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Hukuk Pratiğinize Uygun Plan
                </h2>
                <p className="text-xl text-muted-foreground">
                  Her ihtiyaca uygun esnek fiyatlandırma seçenekleri
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {subscriptionPlans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`relative bg-card shadow-lg hover:shadow-xl transition-all duration-300 ${
                      plan.popular ? 'border-primary shadow-2xl scale-105' : ''
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                        En Popüler
                      </Badge>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">₺/ay</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      <Button 
                        className="w-full mt-6"
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => navigate('/register')}
                        disabled={isActionInProgress}
                      >
                        {isActionInProgress ? 'İşlem yapılıyor...' : 'Başlayın'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Müşterilerimiz Ne Diyor?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Türkiye'nin önde gelen hukuk büroları TurkLaw AI'ı tercih ediyor
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-card shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 bg-gradient-to-r from-primary/20 to-secondary/20">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-3xl mx-auto">
                <Scale className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Hukuki Araştırmalarınızda Devrim Yaratın
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Bugün başlayın ve ilk 7 gün ücretsiz olarak TurkLaw AI'ın gücünü keşfedin
                </p>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')}
                  disabled={isActionInProgress}
                  className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
                >
                  {isActionInProgress ? 'İşlem yapılıyor...' : 'Hemen Başlayın - Ücretsiz'}
                  {!isActionInProgress && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
