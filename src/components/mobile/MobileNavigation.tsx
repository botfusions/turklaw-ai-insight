
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Menu, 
  Search, 
  Home, 
  Bookmark, 
  User, 
  Settings, 
  HelpCircle,
  Bell,
  Crown,
  LogOut 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string | number;
  requiresAuth?: boolean;
}

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { unreadCount } = useNotifications();

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Ana Sayfa',
      icon: Home,
      path: '/',
    },
    {
      id: 'search',
      label: 'Arama',
      icon: Search,
      path: '/search',
      requiresAuth: true,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Crown,
      path: '/dashboard',
      requiresAuth: true,
    },
    {
      id: 'saved',
      label: 'Kaydedilenler',
      icon: Bookmark,
      path: '/saved-cases',
      requiresAuth: true,
    },
    {
      id: 'notifications',
      label: 'Bildirimler',
      icon: Bell,
      path: '/notifications',
      badge: unreadCount > 0 ? unreadCount : undefined,
      requiresAuth: true,
    },
  ];

  const accountItems: NavigationItem[] = [
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      path: '/profile',
      requiresAuth: true,
    },
    {
      id: 'subscription',
      label: 'Abonelik',
      icon: Crown,
      path: '/subscription',
      requiresAuth: true,
    },
    {
      id: 'settings',
      label: 'Ayarlar',
      icon: Settings,
      path: '/settings',
      requiresAuth: true,
    },
    {
      id: 'help',
      label: 'Yardım',
      icon: HelpCircle,
      path: '/help',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı';

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden p-2"
          aria-label="Menüyü aç"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Crown className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">TurkLawAI</h2>
                {user && (
                  <p className="text-sm text-muted-foreground">
                    Hoş geldin, {displayName}
                  </p>
                )}
              </div>
            </div>
            
            {profile?.plan && (
              <Badge variant="secondary" className="mt-3 capitalize">
                {profile.plan} Plan
              </Badge>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Main Navigation */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground px-2">
                  Ana Menü
                </h3>
                <nav className="space-y-1">
                  {navigationItems
                    .filter(item => !item.requiresAuth || user)
                    .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                        isCurrentPath(item.path)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant={isCurrentPath(item.path) ? "secondary" : "default"}
                          className="text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <Separator />

              {/* Account Section */}
              {user && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground px-2">
                    Hesap
                  </h3>
                  <nav className="space-y-1">
                    {accountItems
                      .filter(item => !item.requiresAuth || user)
                      .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                          isCurrentPath(item.path)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t">
            {user ? (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Çıkış Yap
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={() => handleNavigation('/login')}
                  className="w-full"
                >
                  Giriş Yap
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleNavigation('/register')}
                  className="w-full"
                >
                  Üye Ol
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
