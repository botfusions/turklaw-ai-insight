
import { Link, useNavigate } from 'react-router-dom';
import { 
  Scale, 
  Search, 
  Menu, 
  LogOut, 
  User, 
  Settings,
  Crown,
  TrendingUp,
  BookmarkCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel 
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from './UserAvatar';
import { ThemeToggle } from './ThemeToggle';
import { NotificationCenter } from './NotificationCenter';
import { MobileMenu } from './MobileMenu';
import { useHeader } from '@/hooks/useHeader';
import { cn } from '@/lib/utils';

interface HeaderProps {
  // Header artık tamamen kendi state'ini yönetir
}

export function Header({}: HeaderProps) {
  const navigate = useNavigate();
  
  console.log('Header rendering...'); // Debug log
  
  // useHeader'ı güvenli şekilde kullan
  let headerData;
  try {
    headerData = useHeader();
    console.log('Header useHeader success:', { 
      user: !!headerData.user, 
      loading: headerData.loading 
    });
  } catch (error) {
    console.error('Header useHeader error:', error);
    // Fallback değerler
    headerData = {
      user: null,
      profile: null,
      signOut: async () => {},
      loading: false,
      displayName: 'Kullanıcı',
      userInitials: 'KU',
      unreadCount: 0,
      mobileMenuOpen: false,
      toggleMobileMenu: () => {},
      closeMobileMenu: () => {},
      scrolled: false,
      isHeaderVisible: true,
    };
  }

  const {
    user,
    profile,
    signOut,
    loading,
    displayName,
    userInitials,
    unreadCount,
    mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    scrolled,
    isHeaderVisible,
  } = headerData;

  console.log('Header using data:', { user: !!user, profile: !!profile, loading });

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Header logout error:', error);
      navigate('/');
    }
  };

  const isPremiumUser = profile && !['free', 'basic'].includes(profile.plan);

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ease-in-out',
          scrolled 
            ? 'bg-background/80 backdrop-blur-md border-border/50 shadow-sm h-14' 
            : 'bg-background border-border h-16',
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
          >
            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Scale className={cn(
                'text-white transition-transform group-hover:scale-110',
                scrolled ? 'h-5 w-5' : 'h-6 w-6'
              )} />
            </div>
            <div className="hidden sm:block">
              <h1 className={cn(
                'font-bold text-foreground transition-all',
                scrolled ? 'text-lg' : 'text-xl'
              )}>
                TurkLaw AI
              </h1>
              <p className={cn(
                'text-muted-foreground transition-all',
                scrolled ? 'text-xs' : 'text-sm'
              )}>
                Hukuki Araştırma Platformu
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link 
              to="/hybrid-search" 
              className="text-foreground hover:text-primary transition-colors relative group"
            >
              🚀 Hibrit Arama
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
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

          {/* User Section */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Search Button - Desktop */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/search')}
                  className="hidden md:flex items-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  disabled={false}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Ara
                </Button>
                
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Notifications */}
                <NotificationCenter />
                
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto">
                      <UserAvatar 
                        name={displayName}
                        email={user.email}
                        plan={profile?.plan}
                        size="sm"
                        showPlanBadge={isPremiumUser}
                        className="hover:ring-2 hover:ring-primary/50 transition-all"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent 
                    align="end" 
                    className="w-64 bg-card border border-border shadow-lg"
                    sideOffset={8}
                  >
                    {/* User Info */}
                    <DropdownMenuLabel className="p-3">
                      <div className="flex items-center space-x-3">
                        <UserAvatar 
                          name={displayName}
                          email={user.email}
                          plan={profile?.plan}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {displayName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                          {profile && (
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {profile.plan}
                              </Badge>
                              {isPremiumUser && (
                                <Crown className="h-3 w-3 text-yellow-500" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                    </DropdownMenuLabel>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Menu Items */}
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <TrendingUp className="h-4 w-4 mr-3" />
                      Kontrol Paneli
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="h-4 w-4 mr-3" />
                      Profil Ayarları
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/search')} className="md:hidden">
                      <Search className="h-4 w-4 mr-3" />
                      Arama Yap
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/saved-cases')}>
                      <BookmarkCheck className="h-4 w-4 mr-3" />
                      Kayıtlı Kararlar
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/subscription')}>
                      <Crown className="h-4 w-4 mr-3" />
                      Abonelik
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={toggleMobileMenu}
                  className="lg:hidden h-9 w-9 p-0"
                  aria-label="Menüyü aç"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                {/* Guest Actions */}
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
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                >
                  <span className="hidden sm:inline">Ücretsiz Deneyin</span>
                  <span className="sm:hidden">Kayıt Ol</span>
                </Button>

                {/* Mobile Menu Button for Guests */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={toggleMobileMenu}
                  className="lg:hidden h-9 w-9 p-0"
                  aria-label="Menüyü aç"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
}
