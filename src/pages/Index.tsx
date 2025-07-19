import React, { useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LandingPage } from "@/components/landing";

const Index = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  console.log('🏠 Index: Auth state:', {
    user: !!auth.user,
    initialized: auth.initialized,
    authLoading: auth.authLoading,
    actionLoading: auth.actionLoading,
    authError: auth.authError
  });

  // ✅ SMART ROUTING: Auth durumuna göre akıllı yönlendirme
  useEffect(() => {
    console.log('🏠 Index: useEffect triggered', { 
      initialized: auth.initialized, 
      hasUser: !!auth.user 
    });
    
    // Auth initialized olduktan sonra kontrol et
    if (auth.initialized && auth.user) {
      console.log('🏠 Index: Redirecting to dashboard');
      // Giriş yapmış kullanıcıyı dashboard'a yönlendir
      navigate('/dashboard', { replace: true });
    }
    // Giriş yapmamış kullanıcılar landing page'te kalır
  }, [auth.initialized, auth.user, navigate]);

  // Auth yüklenirken loading göster
  if (!auth.initialized) {
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
  // Giriş yapmamış kullanıcılar için landing page
  return <LandingPage />;
};

export default Index;