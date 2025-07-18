
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthErrorRecoveryProps {
  error: string;
  onRetry: () => void;
  onClearError: () => void;
}

export const AuthErrorRecovery: React.FC<AuthErrorRecoveryProps> = ({
  error,
  onRetry,
  onClearError,
}) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    onClearError();
    onRetry();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="mt-2">
                {error}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Button 
                onClick={handleRetry}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tekrar Dene
              </Button>
              
              <Button 
                onClick={() => navigate('/login')}
                className="w-full"
                variant="outline"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Giriş Yap
              </Button>
              
              <Button 
                onClick={onClearError}
                className="w-full"
                variant="ghost"
              >
                Devam Et
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
