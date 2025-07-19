import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

interface GuestHeaderProps {
  transparent?: boolean;
}

export function GuestHeader({ transparent = false }: GuestHeaderProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out h-16',
          transparent 
            ? 'bg-transparent' 
            : 'bg-background/80 backdrop-blur-md border-b border-border/50'
        )}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
            onClick={closeMobileMenu}
          >
            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Scale className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">
                TurkLaw AI
              </h1>
              <p className="text-sm text-muted-foreground">
                Hukuki Araştırma Platformu
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link 
              to="/pricing" 
              className="text-foreground hover:text-primary transition-colors relative group"
            >
              Fiyatlar
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary transition-colors relative group"
            >
              Hakkımızda
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
            <Link 
              to="/contact" 
              className="text-foreground hover:text-primary transition-colors relative group"
            >
              İletişim
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/login')}
              className="hidden sm:flex"
            >
              Giriş Yap
            </Button>
            
            <Button 
              size="sm" 
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity hover-scale"
            >
              <span className="hidden sm:inline">Ücretsiz Deneyin</span>
              <span className="sm:hidden">Kayıt Ol</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleMobileMenu}
              className="lg:hidden h-9 w-9 p-0"
              aria-label="Menüyü aç/kapat"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-fade-in"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div className={cn(
        'fixed top-16 left-0 right-0 z-50 lg:hidden bg-background border-b border-border shadow-lg transition-all duration-300 ease-in-out',
        mobileMenuOpen 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-4 pointer-events-none'
      )}>
        <nav className="container mx-auto px-4 py-6 space-y-4">
          <Link 
            to="/pricing" 
            className="block py-2 text-foreground hover:text-primary transition-colors"
            onClick={closeMobileMenu}
          >
            Fiyatlar
          </Link>
          <Link 
            to="/about" 
            className="block py-2 text-foreground hover:text-primary transition-colors"
            onClick={closeMobileMenu}
          >
            Hakkımızda
          </Link>
          <Link 
            to="/contact" 
            className="block py-2 text-foreground hover:text-primary transition-colors"
            onClick={closeMobileMenu}
          >
            İletişim
          </Link>
          
          <div className="pt-4 border-t border-border space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                navigate('/login');
                closeMobileMenu();
              }}
            >
              Giriş Yap
            </Button>
            <Button 
              className="w-full justify-start bg-gradient-to-r from-primary to-secondary"
              onClick={() => {
                navigate('/register');
                closeMobileMenu();
              }}
            >
              Ücretsiz Deneyin
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}