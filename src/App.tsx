import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppRoutes } from "@/components/routing/RouteConfig";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AppRoutes />
  </TooltipProvider>
);

export default App;
