import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  WifiOff,
  User,
  Database,
  Shield,
  Settings,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import { ErrorType, ErrorSeverity } from '@/components/system/ErrorMonitoringSystem';

interface UserFriendlyErrorDisplayProps {
  type: ErrorType;
  severity: ErrorSeverity;
  title: string;
  message: string;
  suggestions?: string[];
  onRetry?: () => void;
  onGoHome?: () => void;
  onRefresh?: () => void;
  autoRecovering?: boolean;
  showDetails?: boolean;
  className?: string;
}

export const UserFriendlyErrorDisplay: React.FC<UserFriendlyErrorDisplayProps> = ({
  type,
  severity,
  title,
  message,
  suggestions = [],
  onRetry,
  onGoHome,
  onRefresh,
  autoRecovering = false,
  showDetails = false,
  className = ''
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case ErrorType.AUTH:
        return <User className="h-6 w-6" />;
      case ErrorType.NETWORK:
        return <WifiOff className="h-6 w-6" />;
      case ErrorType.DATABASE:
        return <Database className="h-6 w-6" />;
      case ErrorType.PERMISSION:
        return <Shield className="h-6 w-6" />;
      case ErrorType.SYSTEM:
        return <Settings className="h-6 w-6" />;
      case ErrorType.VALIDATION:
        return <AlertTriangle className="h-6 w-6" />;
      default:
        return <HelpCircle className="h-6 w-6" />;
    }
  };

  const getErrorColor = () => {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'border-blue-200 bg-blue-50';
      case ErrorSeverity.MEDIUM:
        return 'border-yellow-200 bg-yellow-50';
      case ErrorSeverity.HIGH:
        return 'border-orange-200 bg-orange-50';
      case ErrorSeverity.CRITICAL:
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getIconColor = () => {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'text-blue-600';
      case ErrorSeverity.MEDIUM:
        return 'text-yellow-600';
      case ErrorSeverity.HIGH:
        return 'text-orange-600';
      case ErrorSeverity.CRITICAL:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDefaultSuggestions = () => {
    switch (type) {
      case ErrorType.AUTH:
        return [
          'Oturum açma bilgilerinizi kontrol edin',
          'Şifrenizi sıfırlamayı deneyin',
          'Tarayıcınızın çerezlerini temizleyin',
          'Farklı bir tarayıcıda deneyin'
        ];
      case ErrorType.NETWORK:
        return [
          'İnternet bağlantınızı kontrol edin',
          'Sayfayı yenilemeyi deneyin',
          'VPN kullanıyorsanız kapatmayı deneyin',
          'Birkaç dakika bekleyip tekrar deneyin'
        ];
      case ErrorType.DATABASE:
        return [
          'Sayfayı yenilemeyi deneyin',
          'İşleminizi birkaç dakika sonra tekrar deneyin',
          'Tarayıcınızı yeniden başlatın',
          'Sorun devam ederse destek ekibine başvurun'
        ];
      case ErrorType.PERMISSION:
        return [
          'Yetkili bir kullanıcı ile giriş yapın',
          'Hesap yöneticinizle iletişime geçin',
          'İzin ayarlarınızı kontrol edin',
          'Farklı bir sayfa üzerinden deneyim'
        ];
      case ErrorType.SYSTEM:
        return [
          'Sayfayı yenilemeyi deneyin',
          'Tarayıcınızı yeniden başlatın',
          'Önbelleğinizi temizleyin',
          'Sistem yöneticisine haber verin'
        ];
      case ErrorType.VALIDATION:
        return [
          'Girdiğiniz bilgileri kontrol edin',
          'Zorunlu alanları doldurun',
          'Geçerli bir format kullanın',
          'Özel karakterleri kaldırın'
        ];
      default:
        return [
          'Sayfayı yenilemeyi deneyin',
          'İnternet bağlantınızı kontrol edin',
          'Tarayıcınızı yeniden başlatın',
          'Sorun devam ederse destek ekibine başvurun'
        ];
    }
  };

  const displaySuggestions = suggestions.length > 0 ? suggestions : getDefaultSuggestions();

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <Card className={`${getErrorColor()} border-2`}>
        <CardHeader className="text-center">
          <div className={`mx-auto mb-4 p-3 rounded-full w-fit ${getIconColor()}`}>
            {getErrorIcon()}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-sm">
            {message}
          </CardDescription>
          
          {showDetails && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {type.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {severity.toUpperCase()}
              </Badge>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {autoRecovering && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Sistem otomatik olarak düzeltme yapıyor, lütfen bekleyin...
              </AlertDescription>
            </Alert>
          )}
          
          {/* Suggestions */}
          {displaySuggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Önerilen Çözümler:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {displaySuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tekrar Dene
              </Button>
            )}
            
            <div className="flex gap-2">
              {onRefresh && (
                <Button variant="outline" onClick={onRefresh} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenile
                </Button>
              )}
              
              {onGoHome && (
                <Button variant="outline" onClick={onGoHome} className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Ana Sayfa
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};