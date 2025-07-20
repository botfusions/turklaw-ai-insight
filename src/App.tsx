
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppRoutes } from "@/components/routing/RouteConfig";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SmartLoadingProvider } from "@/contexts/SmartLoadingContext";
import { SimplifiedErrorBoundary } from "@/components/ui/SimplifiedErrorBoundary";

const App = () => (
  <SimplifiedErrorBoundary>
    <SimpleAuthProvider>
      <SmartLoadingProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </NotificationProvider>
      </SmartLoadingProvider>
    </SimpleAuthProvider>
  </SimplifiedErrorBoundary>
);

export default App;
