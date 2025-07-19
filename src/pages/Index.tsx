import React, { useState, useEffect } from 'react'; // useEffect'i import ettiğinizden emin olun
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
// ... diğer importlar

// ...

const Dashboard = () => {
  const { user, profile, initialized } = useAuth();
  const navigate = useNavigate();
  // ... diğer state'ler

  // ...

  // YENİ VE DOĞRU YÖNTEM: useEffect ile yetkilendirme kontrolü
  useEffect(() => {
    // 1. Auth hook'unun işini bitirmesini bekle (initialized === true)
    if (initialized) {
      // 2. İş bittikten sonra kullanıcı var mı diye kontrol et
      if (!user) {
        // 3. Kullanıcı yoksa güvenli bir şekilde yönlendir
        toast.info("Lütfen giriş yapın.");
        navigate('/login');
      }
    }
  }, [initialized, user, navigate]); // Bu effect, bu değerler değiştiğinde tekrar çalışır

  // Loading state (Yükleme durumu)
  if (!initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          {/* Kullanıcının gördüğü metni değiştirdik */}
          <div className="text-lg font-medium">Yetkilendirme kontrol ediliyor...</div>
        </div>
      </div>
    );
  }

  veya bir yükleme iconu daha göstermek, sayfanın titremesini engeller.
  if (!user) {
    return null; // veya <LoadingSpinner /> gibi bir bileşen
  }

  // ... Bileşenin geri kalanı (return JSX)
  return (
    <SimplifiedErrorBoundary>
      {/* ... kodun geri kalanı aynı ... */}
    </SimplifiedErrorBoundary>
  );
};

export default Dashboard;