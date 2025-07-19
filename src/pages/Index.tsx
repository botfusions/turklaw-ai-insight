import React, { useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LandingPage } from "@/components/landing";

const Index = () => {
  const { user, initialized } = useAuth();
  const navigate = useNavigate();

  // ✅ SMART ROUTING: Auth durumuna göre akıllı yönlendirme
  useEffect(() => {
    // Auth initialized olduktan sonra kontrol et
    if (initialized && user) {
      // Giriş yapmış kullanıcıyı dashboard'a yönlendir
      navigate('/dashboard', { replace: true });
    }
    // Giriş yapmamış kullanıcılar landing page'te kalır
  }, [initialized, user, navigate]);

  // Auth yüklenirken loading göster
  if (!initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  // Giriş yapmamış kullanıcılar için landing page
  return <LandingPage />;
};

export default Index;