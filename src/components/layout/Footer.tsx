import { Link } from 'react-router-dom';
import { Scale, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scale className="h-6 w-6" />
              <span className="text-xl font-bold">TurkLaw AI</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Türkiye'nin en kapsamlı AI destekli hukuki araştırma platformu. 
              Yargıtay, Danıştay ve emsal kararlarına hızlı erişim.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold">Ürün</h3>
            <div className="space-y-2 text-sm">
              <Link to="/pricing" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Fiyatlar
              </Link>
              <Link to="/search" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Araştırma
              </Link>
              <Link to="/dashboard" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Panel
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Hukuki</h3>
            <div className="space-y-2 text-sm">
              <Link to="/privacy" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Gizlilik Politikası
              </Link>
              <Link to="/terms" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Kullanım Koşulları
              </Link>
              <Link to="/cookies" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Çerez Politikası
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">İletişim</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span>destek@turklawai.com</span>
              </div>
              <div className="flex items-center space-x-2 text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span>0532 611 14 79</span>
              </div>
              <div className="flex items-center space-x-2 text-primary-foreground/80">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Yukarı Dudullu Mah Kerem sok No:7a Kat:3 Ümraniye İstanbul</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; 2024 TurkLaw AI. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}