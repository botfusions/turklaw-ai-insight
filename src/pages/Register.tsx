import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle, Scale, Eye, EyeOff, Loader2, AlertCircle, Shield, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, user, loading } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const validateForm = () => {
    const errors = { name: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Ad Soyad gereklidir';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Ad Soyad en az 2 karakter olmalıdır';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'E-posta adresi gereklidir';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Geçerli bir e-posta adresi girin';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Şifre gereklidir';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'Şifre en az 8 karakter olmalıdır';
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Şifreler eşleşmiyor';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!formData.agreedToTerms) {
      toast({
        title: "Hata", 
        description: "Kullanım koşullarını kabul etmelisiniz",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const result = await signUp(formData.email, formData.password, formData.name);
    
    if (result.success) {
      setIsSuccess(true);
      toast({
        title: "Hesap Oluşturuldu!",
        description: "E-posta adresinize doğrulama bağlantısı gönderildi.",
      });
    } else {
      toast({
        title: "Kayıt Hatası",
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

    // Real-time password strength calculation
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear validation errors on input
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
                <CardTitle className="text-2xl">Hesap Oluşturun</CardTitle>
                <CardDescription>
                  7 gün ücretsiz deneme ile başlayın
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {isSuccess ? (
                  <div className="text-center space-y-4">
                    <div className="bg-success/10 p-6 rounded-lg border border-success/20">
                      <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Hesabınız Oluşturuldu!</h3>
                      <p className="text-muted-foreground mb-4">
                        E-posta adresinize doğrulama bağlantısı gönderildi. 
                        Hesabınızı aktifleştirmek için lütfen e-postanızı kontrol edin.
                      </p>
                      <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                        <Clock className="h-4 w-4 mr-2" />
                        E-posta gelmezse spam klasörünü kontrol edin
                      </div>
                      <Button onClick={() => navigate('/login')} className="w-full">
                        Giriş Sayfasına Dön
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Av. Mehmet Yılmaz"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={validationErrors.name ? 'border-destructive' : ''}
                          required
                        />
                        {formData.name && !validationErrors.name && (
                          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
                        )}
                        {validationErrors.name && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                        )}
                      </div>
                      {validationErrors.name && (
                        <p className="text-sm text-destructive">{validationErrors.name}</p>
                      )}
                    </div>
                  
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
                          className={validationErrors.email ? 'border-destructive' : ''}
                          required
                        />
                        {formData.email && !validationErrors.email && (
                          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
                        )}
                        {validationErrors.email && (
                          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                        )}
                      </div>
                      {validationErrors.email && (
                        <p className="text-sm text-destructive">{validationErrors.email}</p>
                      )}
                    </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="password">Şifre</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="En az 8 karakter, büyük-küçük harf ve rakam"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={validationErrors.password ? 'border-destructive' : ''}
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
                      {formData.password && (
                        <div className="space-y-2">
                          <Progress value={passwordStrength} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            Şifre Güvenliği: {
                              passwordStrength < 50 ? 'Zayıf' :
                              passwordStrength < 75 ? 'Orta' : 'Güçlü'
                            }
                          </p>
                        </div>
                      )}
                      {validationErrors.password && (
                        <p className="text-sm text-destructive">{validationErrors.password}</p>
                      )}
                    </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Şifrenizi tekrar girin"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={validationErrors.confirmPassword ? 'border-destructive' : ''}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                          <CheckCircle className="absolute right-12 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
                        )}
                      </div>
                      {validationErrors.confirmPassword && (
                        <p className="text-sm text-destructive">{validationErrors.confirmPassword}</p>
                      )}
                    </div>
                  
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreedToTerms}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, agreedToTerms: checked as boolean }))
                        }
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        <Link to="/terms" className="text-primary hover:underline">
                          Kullanım Koşulları
                        </Link>
                        {' '}ve{' '}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Gizlilik Politikası
                        </Link>
                        'nı okudum ve kabul ediyorum
                      </Label>
                    </div>
                  
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loading || isSubmitting || !formData.agreedToTerms || passwordStrength < 50}
                    >
                      {(loading || isSubmitting) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Hesap Oluşturuluyor...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Güvenli Hesap Oluştur
                        </>
                      )}
                    </Button>
                  </form>
                )}
                
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    7 gün ücretsiz deneme
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Kredi kartı gerektirmez
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    İstediğiniz zaman iptal edin
                  </div>
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  Zaten hesabınız var mı?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Giriş Yapın
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