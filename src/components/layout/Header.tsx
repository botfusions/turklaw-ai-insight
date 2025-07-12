import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Scale, User, Search, LogOut } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
}

export function Header({ isAuthenticated = false, userName }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic
    navigate('/');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="bg-gradient-hero p-2 rounded-lg">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">TurkLaw AI</h1>
            <p className="text-xs text-muted-foreground">Hukuki Araştırma Platformu</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/pricing" className="text-foreground hover:text-primary transition-colors">
            Fiyatlar
          </Link>
          <Link to="/about" className="text-foreground hover:text-primary transition-colors">
            Hakkımızda
          </Link>
          <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
            İletişim
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/search')}
                className="hidden md:flex items-center"
              >
                <Search className="h-4 w-4 mr-2" />
                Ara
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {userName || 'Kullanıcı'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Giriş Yap
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Ücretsiz Deneyin
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}