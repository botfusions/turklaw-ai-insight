
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/performance/ErrorBoundary";
import { AuthDataProvider } from "@/contexts/AuthDataContext";
import { AuthActionsProvider } from "@/contexts/AuthActionsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Toaster } from "@/components/ui/toaster";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthDataProvider>
            <AuthActionsProvider>
              <ThemeProvider>
                <NotificationProvider>
                  <App />
                  <Toaster />
                </NotificationProvider>
              </ThemeProvider>
            </AuthActionsProvider>
          </AuthDataProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
