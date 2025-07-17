import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Crown, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function UserProfileSection() {
  const { user } = useAuth();
  
  // Mock data - in real app this would come from user profile
  const userProfile = {
    plan: "Temel Plan",
    monthlySearches: 45,
    maxSearches: 100,
    notifications: 2
  };

  const usagePercentage = (userProfile.monthlySearches / userProfile.maxSearches) * 100;
  const isNearLimit = usagePercentage > 80;

  if (!user) return null;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {user.email?.split('@')[0] || 'Kullanıcı'}
            </p>
            <div className="flex items-center gap-1">
              <Crown className="h-3 w-3 text-primary" />
              <span className="text-xs text-muted-foreground">{userProfile.plan}</span>
            </div>
          </div>
          {userProfile.notifications > 0 && (
            <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
              {userProfile.notifications}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Aylık Arama</span>
            <span className={`font-medium ${isNearLimit ? 'text-destructive' : 'text-foreground'}`}>
              {userProfile.monthlySearches}/{userProfile.maxSearches}
            </span>
          </div>
          <Progress 
            value={usagePercentage} 
            className={`h-2 ${isNearLimit ? '[&>div]:bg-destructive' : ''}`}
          />
          {isNearLimit && (
            <div className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              <span>Limite yaklaşıyorsunuz</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}