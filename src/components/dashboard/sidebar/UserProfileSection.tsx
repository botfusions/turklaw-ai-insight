
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileProgressiveLoader } from "@/components/ui/ProfileProgressiveLoader";

export function UserProfileSection() {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-4 space-y-3">
        <ProfileProgressiveLoader showRefreshButton={true} />

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
