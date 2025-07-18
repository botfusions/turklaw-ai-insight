
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppRoutes } from "@/components/routing/RouteConfig";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { NetworkStatus } from "@/components/layout/NetworkStatus";
import { AccessibilitySettings } from "@/components/accessibility/AccessibilitySettings";
import { ErrorBoundary } from "@/components/performance/ErrorBoundary";

const App = () => (
  <ErrorBoundary>
    <AccessibilityProvider>
      <TooltipProvider>
        <NetworkStatus />
        <Toaster />
        <Sonner />
        <AppRoutes />
        <AccessibilitySettings />
      </TooltipProvider>
    </AccessibilityProvider>
  </ErrorBoundary>
);

export default App;
