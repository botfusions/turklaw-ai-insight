
import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, RotateCcw } from 'lucide-react';

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
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isContextError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    console.error('ErrorBoundary caught error:', error);
    
    const isContextError = error.message.includes('useAuth') || 
                          error.message.includes('AuthProvider') ||
                          error.message.includes('context') ||
                          error.message.includes('undefined') ||
                          error.message.includes('Cannot read') ||
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
    
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error callback
    this.props.onError?.(error, errorInfo);

    // Auto-retry for context errors
    if (this.state.isContextError && this.state.retryCount < this.maxRetries) {
      this.scheduleRetry();
    }
  }

  scheduleRetry = () => {
    const delay = Math.min(1000 * Math.pow(2, this.state.retryCount), 5000); // Exponential backoff, max 5s
    
    this.retryTimeout = setTimeout(() => {
      console.log(`ErrorBoundary: Auto-retrying (${this.state.retryCount + 1}/${this.maxRetries})`);
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        isContextError: false,
        retryCount: prevState.retryCount + 1,
      }));
    }, delay);
  };

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isContextError: false,
      retryCount: 0,
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
        const isAutoRetrying = this.state.retryCount < this.maxRetries;
        
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="max-w-lg w-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-xl">
                  {isAutoRetrying ? 'Yeniden Deneniyor...' : 'Yükleme Hatası'}
                </CardTitle>
                <CardDescription>
                  {isAutoRetrying 
                    ? `Uygulama otomatik olarak yeniden başlatılıyor (${this.state.retryCount}/${this.maxRetries})`
                    : 'Uygulama yüklenirken bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.'
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {isAutoRetrying && (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={this.handleHardRefresh}
                    className="flex-1"
                    disabled={isAutoRetrying}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sayfayı Yenile
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={this.handleRetry}
                    className="flex-1"
                    disabled={isAutoRetrying}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Tekrar Dene
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={this.handleGoHome}
                  className="w-full"
                  disabled={isAutoRetrying}
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
              <CardTitle className="text-xl">Bir Hata Oluştu</CardTitle>
              <CardDescription>
                Beklenmeyen bir hata meydana geldi. Lütfen sayfayı yenilemeyi deneyin.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-sm bg-muted p-3 rounded">
                  <summary className="cursor-pointer font-medium mb-2">
                    Hata Detayları (Geliştirici Modu)
                  </summary>
                  <pre className="whitespace-pre-wrap text-xs overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

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

              {/* Support Info */}
              <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                <p>
                  Sorun devam ediyorsa lütfen{' '}
                  <a href="/contact" className="text-primary hover:underline">
                    destek ekibiyle iletişime geçin
                  </a>
                </p>
              </div>
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
