
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppRoutes } from "@/components/routing/RouteConfig";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { NetworkStatus } from "@/components/layout/NetworkStatus";
import { AccessibilitySettings } from "@/components/accessibility/AccessibilitySettings";
import { ErrorBoundary } from "@/components/performance/ErrorBoundary";
import { SmartLoadingProvider } from "@/contexts/SmartLoadingContext";
import { LoadingPerformanceMonitor } from "@/components/ui/LoadingPerformanceMonitor";
import ProfileDebugPanel from "@/components/debug/ProfileDebugPanel";

const App = () => (
  <ErrorBoundary>
    <SmartLoadingProvider>
      <AccessibilityProvider>
        <TooltipProvider>
          <NetworkStatus />
          <Toaster />
          <Sonner />
          <AppRoutes />
          <AccessibilitySettings />
          <LoadingPerformanceMonitor />
          <ProfileDebugPanel />
        </TooltipProvider>
      </AccessibilityProvider>
    </SmartLoadingProvider>
  </ErrorBoundary>
);

export default App;
