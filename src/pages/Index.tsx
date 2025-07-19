import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  // ✅ CENTRALIZED AUTH: Basit yönlendirme - auth kontrolü ProtectedRoute'ta yapılıyor
  useEffect(() => {
    // Anasayfa ziyaretçilerini dashboard'a yönlendir
    // ProtectedRoute auth kontrolü yapacak ve gerekirse login'e gönderecek
    navigate('/dashboard');
  }, [navigate]);

  // Yönlendirme sırasında minimal loading
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-medium">Yönlendiriliyor...</div>
      </div>
    </div>
  );
};

export default Index;