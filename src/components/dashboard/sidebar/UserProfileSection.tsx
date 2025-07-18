
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Crown, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function UserProfileSection() {
  const { user, profile } = useAuth();
  
  if (!user) return null;

  const displayName = user.email?.split('@')[0] || 'Kullanıcı';
  const currentPlan = profile?.plan || 'free';
  
  const planNames = {
    free: 'Ücretsiz',
    basic: 'Temel',
    premium: 'Premium',
    enterprise: 'Kurumsal'
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {displayName}
            </p>
            <div className="flex items-center gap-1">
              <Crown className="h-3 w-3 text-primary" />
              <span className="text-xs text-muted-foreground">
                {planNames[currentPlan as keyof typeof planNames]}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2"
          >
            <Settings className="h-4 w-4" />
            Abonelik Yönetimi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
