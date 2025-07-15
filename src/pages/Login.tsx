import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Scale, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, loading, resendConfirmation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showEmailNotConfirmed, setShowEmailNotConfirmed] = useState(false);
  const [lastAttemptedEmail, setLastAttemptedEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
    
    if (!validateEmail(formData.email)) {
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast({
        title: "Hata",
        description: "Şifre en az 6 karakter olmalıdır",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const result = await signIn(formData.email, formData.password);
    
    if (result.success) {
      toast({
        title: "Giriş Başarılı!",
        description: "Dashboard'a yönlendiriliyorsunuz...",
      });
      // Remember me functionality would be handled in AuthContext
      if (formData.rememberMe) {
        localStorage.setItem('turklaw_remember_user', 'true');
      }
      navigate('/dashboard');
    } else {
      const errorMessage = result.error || '';
      if (errorMessage.includes('E-posta adresiniz doğrulanmamış')) {
        setShowEmailNotConfirmed(true);
        setLastAttemptedEmail(formData.email);
      }
      
      toast({
        title: "Giriş Hatası",
        description: result.error,
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Real-time email validation
    if (name === 'email' && value) {
      validateEmail(value);
    }
  };

  const handleResendVerification = async () => {
    if (!lastAttemptedEmail) return;
    
    setIsSubmitting(true);
    const result = await resendConfirmation(lastAttemptedEmail);
    
    if (result.success) {
      toast({
        title: "E-posta Gönderildi!",
        description: "Doğrulama e-postası tekrar gönderildi. Lütfen e-postanızı kontrol edin.",
      });
      setShowEmailNotConfirmed(false);
    } else {
      toast({
        title: "Hata",
        description: result.error,
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
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
                <CardTitle className="text-2xl">Giriş Yapın</CardTitle>
                <CardDescription>
                  TurkLaw AI hesabınıza erişin
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {showEmailNotConfirmed && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <Mail className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      E-posta adresiniz doğrulanmamış. Giriş yapabilmek için e-postanızı doğrulamanız gerekir.
                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleResendVerification}
                          disabled={isSubmitting}
                          className="text-orange-700 border-orange-300 hover:bg-orange-100"
                        >
                          <Mail className="mr-1 h-3 w-3" />
                          {isSubmitting ? 'Gönderiliyor...' : 'Tekrar Gönder'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowEmailNotConfirmed(false)}
                          className="text-orange-700 hover:bg-orange-100"
                        >
                          Kapat
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="avukat@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={emailError ? 'border-destructive' : ''}
                        required
                      />
                      {formData.email && !emailError && (
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Şifre</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Şifrenizi girin"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                        }
                      />
                      <Label htmlFor="rememberMe" className="text-sm">
                        Beni hatırla
                      </Label>
                    </div>
                    
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Şifremi unuttum
                    </Link>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || isSubmitting || !!emailError}
                  >
                    {(loading || isSubmitting) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Giriş Yapılıyor...
                      </>
                    ) : (
                      'Giriş Yap'
                    )}
                  </Button>
                </form>
                
                <div className="text-center text-sm text-muted-foreground">
                  Hesabınız yok mu?{' '}
                  <Link to="/register" className="text-primary hover:underline">
                    Ücretsiz Hesap Oluşturun
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