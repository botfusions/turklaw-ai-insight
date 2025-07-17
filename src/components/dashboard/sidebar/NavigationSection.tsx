import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Search, 
  Bookmark, 
  History, 
  Settings, 
  ChevronRight 
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function NavigationSection() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      badge: null
    },
    {
      id: 'search',
      label: 'Gelişmiş Arama',
      icon: Search,
      path: '/search',
      badge: null
    },
    {
      id: 'saved',
      label: 'Kayıtlı Kararlar',
      icon: Bookmark,
      path: '/saved-cases',
      badge: 12
    },
    {
      id: 'history',
      label: 'Arama Geçmişi',
      icon: History,
      path: '/search-history',
      badge: null
    },
    {
      id: 'profile',
      label: 'Profil Ayarları',
      icon: Settings,
      path: '/profile',
      badge: null
    }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Ana Menü</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(item.path);
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-between text-sm h-9 px-3 ${
                isActive ? 'bg-primary/10 text-primary border-primary/20' : ''
              }`}
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1">
                {item.badge && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {item.badge}
                  </Badge>
                )}
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}