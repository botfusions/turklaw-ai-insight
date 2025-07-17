import { Link, useNavigate } from 'react-router-dom';
import { X, Search, User, Settings, LogOut, Scale, Bell, TrendingUp, Bookmark, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UserAvatar } from './UserAvatar';
import { ThemeToggle } from './ThemeToggle';
import { NotificationCenter } from './NotificationCenter';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { unreadCount } = useNotifications();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    onClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };


  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı';

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-80 bg-card border-l border-border shadow-xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-hero p-2 rounded-lg">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">TurkLaw AI</h2>
                <p className="text-xs text-muted-foreground">Menü</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Section */}
          {user && profile && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <UserAvatar 
                  name={displayName}
                  email={user.email}
                  plan={profile.plan}
                  size="md"
                  showPlanBadge
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {profile.plan}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {user ? (
                <>
                  {/* Authenticated Menu */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/search')}
                  >
                    <Search className="h-4 w-4 mr-3" />
                    Arama Yap
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/dashboard')}
                  >
                    <TrendingUp className="h-4 w-4 mr-3" />
                    Kontrol Paneli
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/saved-cases')}
                  >
                    <Bookmark className="h-4 w-4 mr-3" />
                    Kayıtlı Kararlar
                  </Button>

                  <Separator className="my-3" />

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/profile')}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profil Ayarları
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/subscription')}
                  >
                    <Crown className="h-4 w-4 mr-3" />
                    Abonelik
                  </Button>
                </>
              ) : (
                <>
                  {/* Guest Menu */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/login')}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Giriş Yap
                  </Button>

                  <Button
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/register')}
                  >
                    <Scale className="h-4 w-4 mr-3" />
                    Ücretsiz Deneyin
                  </Button>
                </>
              )}

              <Separator className="my-3" />

              {/* Public Links */}
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigation('/pricing')}
              >
                Fiyatlar
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigation('/about')}
              >
                Hakkımızda
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigation('/contact')}
              >
                İletişim
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Tema & Bildirimler</span>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <NotificationCenter 
                  trigger={
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="relative h-9 w-9 rounded-lg"
                    >
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  }
                />
              </div>
            </div>

            {user && (
              <Button
                variant="outline"
                className="w-full justify-start text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Çıkış Yap
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}