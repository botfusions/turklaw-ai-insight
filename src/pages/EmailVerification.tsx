import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, Mail } from 'lucide-react';

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const type = searchParams.get('type');

  useEffect(() => {
    if (token && type) {
      verifyEmail();
    } else {
      // No token, show manual verification form
      setStatus('error');
      setError('Doğrulama linki geçersiz');
    }
  }, [token, type]);

  const verifyEmail = async () => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token!,
        type: 'email' as any
      });

      if (error) {
        if (error.message.includes('expired')) {
          setStatus('expired');
          setError('Doğrulama linki süresi dolmuş');
        } else {
          setStatus('error');
          setError(error.message || 'Doğrulama başarısız');
        }
      } else {
        setStatus('success');
        toast({
          title: 'Başarılı!',
          description: 'E-posta adresiniz başarıyla doğrulandı.',
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Beklenmeyen bir hata oluştu');
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Lütfen e-posta adresinizi girin.',
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-verification`
        }
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Hata',
          description: error.message || 'E-posta gönderilemedi',
        });
      } else {
        toast({
          title: 'Başarılı!',
          description: 'Doğrulama e-postası tekrar gönderildi.',
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Beklenmeyen bir hata oluştu',
      });
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <Clock className="mx-auto h-12 w-12 text-blue-500 animate-spin mb-4" />
            <h2 className="text-xl font-semibold mb-2">E-posta Doğrulanıyor...</h2>
            <p className="text-muted-foreground">
              Lütfen bekleyin, e-posta adresiniz doğrulanıyor.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">E-posta Doğrulandı!</h2>
            <p className="text-muted-foreground mb-4">
              E-posta adresiniz başarıyla doğrulandı. Artık giriş yapabilirsiniz.
            </p>
            <Button asChild>
              <Link to="/login">Giriş Yap</Link>
            </Button>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Link Süresi Doldu</h2>
            <p className="text-muted-foreground mb-4">
              Doğrulama linkinin süresi dolmuş. Yeni bir doğrulama e-postası göndermek için 
              e-posta adresinizi girin.
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">E-posta Adresi</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresinizi girin"
                />
              </div>
              <Button 
                onClick={handleResendVerification} 
                disabled={isResending}
                className="w-full"
              >
                <Mail className="mr-2 h-4 w-4" />
                {isResending ? 'Gönderiliyor...' : 'Doğrulama E-postası Gönder'}
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Doğrulama Başarısız</h2>
            <p className="text-muted-foreground mb-4">
              {error || 'E-posta doğrulama işlemi başarısız oldu.'}
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">E-posta Adresi</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresinizi girin"
                />
              </div>
              <Button 
                onClick={handleResendVerification} 
                disabled={isResending}
                className="w-full"
              >
                <Mail className="mr-2 h-4 w-4" />
                {isResending ? 'Gönderiliyor...' : 'Doğrulama E-postası Gönder'}
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/register">Yeniden Kayıt Ol</Link>
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            Legal AI
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>E-posta Doğrulama</CardTitle>
            <CardDescription>
              E-posta adresinizi doğrulayın
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Ana Sayfaya Dön
          </Link>
        </div>
      </footer>
    </div>
  );
}