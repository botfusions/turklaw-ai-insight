import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, Bell, Search, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function DashboardHeader() {
  const { user, profile, signOut } = useAuth();
  
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı';
  const userInitials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="relative bg-gradient-to-r from-primary/5 via-background to-primary/5 border-b border-border/50 backdrop-blur-sm">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-30"></div>
      
      <div className="relative px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Sol: Enhanced Logo + Dashboard */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-primary" />
                <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm"></div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                  TurkLawAI
                </h1>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <span className="text-sm sm:text-lg font-medium text-muted-foreground">
                  Dashboard
                </span>
              </div>
            </div>
          </div>

          {/* Sağ: Quick Actions + Notifications + User Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Search - Hidden on mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Hızlı Arama</span>
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 hover:bg-accent/10 transition-colors"
            >
              <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse"></span>
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 sm:gap-3 p-2 hover:bg-accent/10 transition-all duration-200 rounded-lg"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium text-foreground">
                    {displayName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg"
              >
                <div className="px-3 py-2 border-b border-border/50">
                  <p className="text-sm font-medium text-foreground">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuItem className="hover:bg-accent/10 transition-colors">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-accent/10 transition-colors">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ayarlar</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}