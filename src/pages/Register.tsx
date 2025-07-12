import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle, Scale } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, user, loading } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Hata",
        description: "Şifreler eşleşmiyor",
        variant: "destructive",
      });
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

    const result = await signUp(formData.email, formData.password, formData.name);
    
    if (result.success) {
      setIsSuccess(true);
      toast({
        title: "Hesap Oluşturuldu!",
        description: "E-posta adresinizi doğruladıktan sonra giriş yapabilirsiniz.",
      });
    } else {
      toast({
        title: "Kayıt Hatası",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Mehmet Yılmaz"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="avukat@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Şifre</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="En az 8 karakter"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={8}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Şifrenizi tekrar girin"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      id="terms"
                      name="agreedToTerms"
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={handleInputChange}
                      className="rounded border-border"
                    />
                    <Label htmlFor="terms" className="text-sm">
                      <Link to="/terms" className="text-primary hover:underline">
                        Kullanım Koşulları
                      </Link>
                      {' '}ve{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Gizlilik Politikası
                      </Link>
                      'nı kabul ediyorum
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || !formData.agreedToTerms}
                  >
                    {loading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
                  </Button>
                </form>
                
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