import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Scale, ArrowLeft, Mail, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('E-posta adresi gereklidir');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Geçerli bir e-posta adresi girin');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    setIsSubmitting(true);
    
    const result = await resetPassword(email);
    
    if (result.success) {
      setIsSuccess(true);
      toast({
        title: "E-posta Gönderildi!",
        description: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
      });
    } else {
      toast({
        title: "Hata",
        description: result.error,
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      validateEmail(value);
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
                <CardTitle className="text-2xl">Şifremi Unuttum</CardTitle>
                <CardDescription>
                  E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {isSuccess ? (
                  <div className="text-center space-y-4">
                    <div className="bg-success/10 p-6 rounded-lg border border-success/20">
                      <Mail className="h-12 w-12 text-success mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">E-posta Gönderildi!</h3>
                      <p className="text-muted-foreground mb-4">
                        <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderildi.
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        E-posta gelmezse spam klasörünüzü kontrol edin. Bağlantı 1 saat geçerlidir.
                      </p>
                      <div className="space-y-2">
                        <Button onClick={() => setIsSuccess(false)} variant="outline" className="w-full">
                          Başka E-posta Gönder
                        </Button>
                        <Button onClick={() => navigate('/login')} className="w-full">
                          Giriş Sayfasına Dön
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta Adresi</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="avukat@example.com"
                          value={email}
                          onChange={handleEmailChange}
                          className={emailError ? 'border-destructive' : ''}
                          required
                        />
                        {email && !emailError && (
                          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
                        )}
                        {emailError && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                        )}
                      </div>
                      {emailError && (
                        <p className="text-sm text-destructive">{emailError}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting || !!emailError || !email}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Şifre Sıfırlama Bağlantısı Gönder
                        </>
                      )}
                    </Button>
                  </form>
                )}
                
                <div className="text-center">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Giriş sayfasına dön
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