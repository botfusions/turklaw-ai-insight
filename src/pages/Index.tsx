import React, { useEffect } from 'react';
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useNavigate } from "react-router-dom";
import { LandingPage } from "@/components/landing";

const Index = () => {
  const { user, initialized, loading } = useSimpleAuth();
  const navigate = useNavigate();

  console.log('🏠 Index: Auth state:', {
    hasUser: !!user,
    initialized,
    loading
  });

  // Auth durumuna göre yönlendirme
  useEffect(() => {
    console.log('🏠 Index: useEffect triggered', { 
      initialized, 
      hasUser: !!user 
    });
    
    if (initialized && user) {
      console.log('🏠 Index: Redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [initialized, user, navigate]);

  // Auth yüklenirken loading göster
  if (!initialized) {
    console.log('🏠 Index: Showing loading state');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  console.log('🏠 Index: Showing landing page');
  return <LandingPage />;
};

export default Index;