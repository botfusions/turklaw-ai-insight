
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppRoutes } from "@/components/routing/RouteConfig";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { NetworkStatus } from "@/components/layout/NetworkStatus";
import { AccessibilitySettings } from "@/components/accessibility/AccessibilitySettings";
import { SimplifiedErrorBoundary } from "@/components/ui/SimplifiedErrorBoundary";
import { UnifiedPerformanceProvider } from "@/contexts/UnifiedPerformanceContext";
import NetworkMonitor from "@/components/system/NetworkMonitor";

// Only show performance monitors in development
const DevelopmentMonitors = () => {
  if (!import.meta.env.DEV) return null;
  
  return (
    <>
      <div id="profile-debug-panel" />
      <div id="memory-debug-panel" />
      <div id="error-debug-panel" />
    </>
  );
};

const App = () => (
  <SimplifiedErrorBoundary>
    <UnifiedPerformanceProvider>
      <AccessibilityProvider>
        <TooltipProvider>
          <NetworkStatus />
          <NetworkMonitor />
          <Toaster />
          <Sonner />
          <AppRoutes />
          <AccessibilitySettings />
          <DevelopmentMonitors />
        </TooltipProvider>
      </AccessibilityProvider>
    </UnifiedPerformanceProvider>
  </SimplifiedErrorBoundary>
);

export default App;
