import React, { useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SimplifiedErrorBoundary } from "@/components/ui/SimplifiedErrorBoundary";

// ...

const Index = () => {
  const { user, initialized } = useAuth();
  const navigate = useNavigate();

  // Auth redirection logic
  useEffect(() => {
    if (initialized) {
      if (user) {
        // User is authenticated, redirect to dashboard
        navigate('/dashboard');
      } else {
        // User is not authenticated, redirect to login
        navigate('/login');
      }
    }
  }, [initialized, user, navigate]);

  // Loading state while auth is initializing
  if (!initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  // This component should redirect, so return null
  return null;
};

export default Index;