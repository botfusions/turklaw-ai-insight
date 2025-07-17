import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  HeadphonesIcon,
  Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Mail,
    title: 'E-posta',
    value: 'info@turklaw.ai',
    description: 'Genel sorularınız için'
  },
  {
    icon: Phone,
    title: 'Telefon',
    value: '+90 212 555 0123',
    description: 'Pazartesi - Cuma: 09:00 - 18:00'
  },
  {
    icon: MapPin,
    title: 'Adres',
    value: 'Maslak Mahallesi, Büyükdere Cad. No:123',
    description: 'Sarıyer, İstanbul'
  },
  {
    icon: Clock,
    title: 'Çalışma Saatleri',
    value: '09:00 - 18:00',
    description: 'Pazartesi - Cuma'
  }
];

const supportOptions = [
  {
    icon: MessageCircle,
    title: 'Canlı Destek',
    description: 'Anlık yardım için canlı destek hattımızı kullanın',
    action: 'Canlı Destek'
  },
  {
    icon: HeadphonesIcon,
    title: 'Teknik Destek',
    description: 'Teknik sorunlarınız için özel destek ekibimiz',
    action: 'Teknik Destek'
  },
  {
    icon: Building,
    title: 'Kurumsal Satış',
    description: 'Kurumsal çözümler ve özel fiyatlandırma',
    action: 'Satış Ekibi'
  }
];

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Mesajınız Gönderildi",
      description: "En kısa sürede size geri dönüş yapacağız.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 pt-8">
            <Badge variant="secondary" className="mb-4">
              <Mail className="h-4 w-4 mr-2" />
              İletişim
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Size Nasıl Yardımcı Olabiliriz?
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Sorularınız, önerileriniz veya teknik destek ihtiyacınız için bizimle iletişime geçin. 
              Uzman ekibimiz size yardımcı olmaktan mutluluk duyar.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center bg-card shadow-card hover:shadow-hover transition-all">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                  <p className="text-sm font-medium text-primary mb-1">{info.value}</p>
                  <p className="text-xs text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <Card className="bg-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2 text-primary" />
                  İletişim Formu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                        Ad Soyad
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                        E-posta
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                      Konu
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Mesajınızın konusu"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                      Mesaj
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Mesajınızı buraya yazın..."
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Mesajı Gönder
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Support Options */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Destek Seçenekleri</h2>
                <p className="text-muted-foreground mb-6">
                  İhtiyacınıza uygun destek kanalını seçin ve hızlı çözüm alın.
                </p>
              </div>
              
              <div className="space-y-4">
                {supportOptions.map((option, index) => (
                  <Card key={index} className="bg-card shadow-card hover:shadow-hover transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                          <option.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{option.title}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          {option.action}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* FAQ Section */}
              <Card className="bg-muted/30">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Sık Sorulan Sorular</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Nasıl hesap oluşturabilirim?</p>
                      <p className="text-xs text-muted-foreground">
                        "Ücretsiz Deneyin" butonuna tıklayarak hemen hesap oluşturabilirsiniz.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Aboneliğimi nasıl iptal edebilirim?</p>
                      <p className="text-xs text-muted-foreground">
                        Profil ayarlarınızdan aboneliğinizi istediğiniz zaman iptal edebilirsiniz.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Teknik destek saatleri nedir?</p>
                      <p className="text-xs text-muted-foreground">
                        Pazartesi-Cuma 09:00-18:00 saatleri arasında canlı destek mevcuttur.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}