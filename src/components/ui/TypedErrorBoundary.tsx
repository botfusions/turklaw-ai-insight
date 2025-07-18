
import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { errorTracker } from '@/services/errorTracking';

interface TypedErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  isolate?: boolean;
}

interface TypedErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class TypedErrorBoundary extends Component<
  TypedErrorBoundaryProps,
  TypedErrorBoundaryState
> {
  constructor(props: TypedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<TypedErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    errorTracker.logError(error, {
      component: 'TypedErrorBoundary',
      action: 'getDerivedStateFromError',
      metadata: { errorId }
    });

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('TypedErrorBoundary caught an error:', error, errorInfo);
    
    errorTracker.logError(error, {
      component: 'TypedErrorBoundary',
      action: 'componentDidCatch',
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name,
      }
    });

    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: TypedErrorBoundaryProps): void {
    const { resetOnPropsChange } = this.props;
    const { hasError } = this.state;
    
    if (hasError && prevProps.children !== this.props.children && resetOnPropsChange) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
      });
    }
  }

  private handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback(error, this.handleRetry);
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle>Bir Hata Oluştu</CardTitle>
              <CardDescription>
                Uygulama beklenmedik bir hatayla karşılaştı. Lütfen tekrar deneyin.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {import.meta.env.DEV && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs">
                  <div className="font-medium text-red-800 mb-1">Geliştirici Bilgisi:</div>
                  <div className="text-red-700">{error.message}</div>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tekrar Dene
                </Button>
                
                <Button variant="outline" onClick={this.handleGoHome} className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Ana Sayfa
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}
