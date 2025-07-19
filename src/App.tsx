
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppRoutes } from "@/components/routing/RouteConfig";
import { AuthDataProvider } from "@/contexts/AuthDataContext";
import { AuthActionsProvider } from "@/contexts/AuthActionsContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SimplifiedErrorBoundary } from "@/components/ui/SimplifiedErrorBoundary";

const App = () => (
  <SimplifiedErrorBoundary>
    <AuthDataProvider>
      <AuthActionsProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </NotificationProvider>
      </AuthActionsProvider>
    </AuthDataProvider>
  </SimplifiedErrorBoundary>
);

export default App;
