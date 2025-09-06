import React, { useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LandingPage } from "@/components/landing";

const Index = () => {
  const { user, initialized, authLoading } = useAuth();
  const navigate = useNavigate();

  console.log('🏠 Index: Auth state:', {
    hasUser: !!user,
    initialized,
    authLoading
  });

  // Otomatik yönlendirme kaldırıldı - kullanıcı ana sayfayı görebilmeli

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