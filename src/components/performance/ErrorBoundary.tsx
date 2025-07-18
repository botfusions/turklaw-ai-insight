
import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { errorTracker } from '@/services/errorTracking';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isContextError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isContextError: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    console.error('ErrorBoundary caught error:', error);
    
    // Log to error tracking service
    errorTracker.logError(error, {
      component: 'ErrorBoundary',
      action: 'getDerivedStateFromError',
      metadata: {
        errorMessage: error.message,
        stack: error.stack,
        timestamp: Date.now()
      }
    });
    
    const isContextError = error.message.includes('useAuth') || 
                          error.message.includes('AuthProvider') ||
                          error.message.includes('context') ||
                          error.stack?.includes('useAuth') ||
                          error.stack?.includes('AuthContext');
    
    return {
      hasError: true,
      error,
      isContextError,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Enhanced error logging with detailed context
    errorTracker.logError(error, {
      component: 'ErrorBoundary',
      action: 'componentDidCatch',
      metadata: {
        errorInfo: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }
    });
    
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isContextError: false,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleHardRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Special handling for context errors
      if (this.state.isContextError) {
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="max-w-lg w-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-xl">Uygulama Başlatma Hatası</CardTitle>
                <CardDescription>
                  Uygulama başlatılırken bir hata oluştu. Sayfayı yenileyerek tekrar deneyin.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={this.handleHardRefresh}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sayfayı Yenile
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={this.handleGoHome}
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Ana Sayfaya Dön
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl">Sistem Hatası</CardTitle>
              <CardDescription>
                Bir sistem hatası oluştu. Sorunu çözmek için aşağıdaki seçenekleri deneyebilirsiniz.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Error Info in Development */}
              {import.meta.env.DEV && this.state.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Bug className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Development Error Info:</span>
                  </div>
                  <div className="text-xs text-red-700 space-y-1">
                    <div><strong>Message:</strong> {this.state.error.message}</div>
                    <div><strong>Component:</strong> {this.state.errorInfo?.componentStack?.split('\n')[1]?.trim()}</div>
                  </div>
                </div>
              )}

              {/* User-friendly suggestions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Önerilen Çözümler:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sayfayı yenilemeyi deneyin</li>
                  <li>• Tarayıcınızın önbelleğini temizleyin</li>
                  <li>• İnternet bağlantınızı kontrol edin</li>
                  <li>• Sorun devam ederse ana sayfaya dönün</li>
                </ul>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleRetry}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tekrar Dene
                </Button>
                
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Ana Sayfaya Dön
                </Button>
              </div>
              
              <Button
                variant="ghost"
                onClick={this.handleHardRefresh}
                className="w-full text-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Sayfayı Yenile (Zorla)
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
  };
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: T) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
