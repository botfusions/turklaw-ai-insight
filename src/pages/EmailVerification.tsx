import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Scale, CheckCircle, AlertCircle, Loader2, Mail, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired';

export default function EmailVerification() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (!token || type !== 'signup') {
        setStatus('error');
        setError('Geçersiz doğrulama bağlantısı');
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (error) {
          console.error('Verification error:', error);
          if (error.message.includes('expired')) {
            setStatus('expired');
            setError('Doğrulama bağlantısının süresi dolmuş');
          } else {
            setStatus('error');
            setError('Doğrulama başarısız oldu');
          }
        } else {
          setStatus('success');
          toast({
            title: "E-posta Doğrulandı!",
            description: "Hesabınız başarıyla aktifleştirildi.",
          });
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setStatus('error');
        setError('Beklenmeyen bir hata oluştu');
      }
    };

    verifyEmail();
  }, [searchParams, toast]);

  const handleResendVerification = async () => {
    const email = localStorage.getItem('turklaw_pending_email');
    
    if (!email) {
      toast({
        title: "Hata",
        description: "E-posta adresi bulunamadı. Lütfen tekrar kayıt olun.",
        variant: "destructive",
      });
      navigate('/register');
      return;
    }

    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast({
          title: "Hata",
          description: "E-posta gönderilemedi. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "E-posta Gönderildi",
          description: "Yeni doğrulama e-postası gönderildi.",
        });
      }
    } catch (err) {
      toast({
        title: "Hata",
        description: "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    }

    setIsResending(false);
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
            <h3 className="text-lg font-semibold">E-posta Doğrulanıyor...</h3>
            <p className="text-muted-foreground">
              Lütfen bekleyin, e-posta adresiniz doğrulanıyor.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="bg-success/10 p-6 rounded-lg border border-success/20">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">E-posta Doğrulandı!</h3>
              <p className="text-muted-foreground mb-4">
                Hesabınız başarıyla aktifleştirildi. Artık TurkLaw AI'yi kullanmaya başlayabilirsiniz.
              </p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Giriş Yapın
              </Button>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center space-y-4">
            <div className="bg-warning/10 p-6 rounded-lg border border-warning/20">
              <AlertCircle className="h-12 w-12 text-warning mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Bağlantının Süresi Dolmuş</h3>
              <p className="text-muted-foreground mb-4">
                Doğrulama bağlantısının süresi dolmuş. Yeni bir doğrulama e-postası göndermek için aşağıdaki butona tıklayın.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={handleResendVerification} 
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Yeni Doğrulama E-postası Gönder
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => navigate('/register')} className="w-full">
                  Tekrar Kayıt Ol
                </Button>
              </div>
            </div>
          </div>
        );

      case 'error':
      default:
        return (
          <div className="text-center space-y-4">
            <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Doğrulama Başarısız</h3>
              <p className="text-muted-foreground mb-4">
                {error || 'E-posta doğrulama sırasında bir hata oluştu.'}
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={handleResendVerification} 
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Yeni Doğrulama E-postası Gönder
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => navigate('/register')} className="w-full">
                  Tekrar Kayıt Ol
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="bg-card shadow-card">
              <CardHeader className="text-center">
                <div className="bg-gradient-hero p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Scale className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">E-posta Doğrulama</CardTitle>
                <CardDescription>
                  Hesabınızı aktifleştirmek için e-posta doğrulaması
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {renderContent()}
                
                <div className="text-center mt-6">
                  <Link 
                    to="/" 
                    className="text-sm text-primary hover:underline"
                  >
                    Ana sayfaya dön
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}