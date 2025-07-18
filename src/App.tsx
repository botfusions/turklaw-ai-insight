
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppRoutes } from "@/components/routing/RouteConfig";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { NetworkStatus } from "@/components/layout/NetworkStatus";
import { AccessibilitySettings } from "@/components/accessibility/AccessibilitySettings";
import { SimplifiedErrorBoundary } from "@/components/ui/SimplifiedErrorBoundary";
import { SmartLoadingProvider } from "@/contexts/SmartLoadingContext";
import { MemoryManagementProvider } from "@/contexts/MemoryManagementContext";
import { LoadingPerformanceMonitor } from "@/components/ui/LoadingPerformanceMonitor";
import { ErrorMonitoringProvider } from "@/components/system/ErrorMonitoringSystem";
import NetworkMonitor from "@/components/system/NetworkMonitor";

const App = () => (
  <SimplifiedErrorBoundary>
    <ErrorMonitoringProvider>
      <MemoryManagementProvider>
        <SmartLoadingProvider>
          <AccessibilityProvider>
            <TooltipProvider>
              <NetworkStatus />
              <NetworkMonitor />
              <Toaster />
              <Sonner />
              <AppRoutes />
              <AccessibilitySettings />
              <LoadingPerformanceMonitor />
              {import.meta.env.DEV && (
                <>
                  <ProfileDebugPanel />
                  <MemoryDebugPanel />
                  <ErrorDebugPanel />
                </>
              )}
            </TooltipProvider>
          </AccessibilityProvider>
        </SmartLoadingProvider>
      </MemoryManagementProvider>
    </ErrorMonitoringProvider>
  </SimplifiedErrorBoundary>
);

export default App;
