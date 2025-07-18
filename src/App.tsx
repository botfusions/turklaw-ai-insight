
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
import NetworkMonitor from "@/components/system/NetworkMonitor";
import ProfileDebugPanel from "@/components/debug/ProfileDebugPanel";
import MemoryDebugPanel from "@/components/debug/MemoryDebugPanel";
import ErrorDebugPanel from "@/components/debug/ErrorDebugPanel";

const App = () => (
  <SimplifiedErrorBoundary>
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
  </SimplifiedErrorBoundary>
);

export default App;
