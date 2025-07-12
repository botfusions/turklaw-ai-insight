import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scale, User, Search, LogOut, Menu } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  // Props are now optional since we get auth state from context
}

export function Header({}: HeaderProps) {
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuth();

  const handleLogout = async () => {
    await signOut();
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
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="hidden md:flex items-center"
              >
                <Search className="h-4 w-4 mr-2" />
                Ara
              </Button>
              
              {/* Search Count Badge */}
              {profile && (
                <div className="hidden md:flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {profile.monthly_search_count}/{profile.max_searches} arama
                  </Badge>
                </div>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">
                      {profile?.full_name || user.email?.split('@')[0] || 'Kullanıcı'}
                    </span>
                    <span className="md:hidden">
                      <Menu className="h-4 w-4" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card w-56">
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">{profile?.full_name || 'Kullanıcı'}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                    {profile && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Plan: {profile.plan} • {profile.monthly_search_count}/{profile.max_searches} arama
                      </div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profil Ayarları
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/search')} className="md:hidden">
                    <Search className="h-4 w-4 mr-2" />
                    Arama Yap
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