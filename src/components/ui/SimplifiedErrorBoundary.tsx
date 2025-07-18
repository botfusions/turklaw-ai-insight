
import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { unifiedErrorHandler } from '@/services/unifiedErrorHandler';
import { ErrorSeverity, ErrorType } from '@/components/system/ErrorMonitoringSystem';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

export class SimplifiedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Use unified error handler
    const result = unifiedErrorHandler.handleError(error, {
      component: 'SimplifiedErrorBoundary',
      action: 'getDerivedStateFromError',
      severity: ErrorSeverity.HIGH,
      type: ErrorType.SYSTEM,
      showToast: false // Don't show toast for boundary errors
    });
    
    return {
      hasError: true,
      error,
      errorId: result.errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    unifiedErrorHandler.handleError(error, {
      component: 'SimplifiedErrorBoundary',
      action: 'componentDidCatch',
      severity: ErrorSeverity.HIGH,
      type: ErrorType.SYSTEM,
      metadata: {
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId
      },
      showToast: false
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = import.meta.env.DEV;
      const userMessage = isDev 
        ? 'Geliştirme ortamında bir hata oluştu. Konsolu kontrol edin.'
        : 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.';

      return (
        <div className="min-h-64 flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-lg font-semibold">Bir hata oluştu</h2>
            <p className="text-muted-foreground">
              {userMessage}
            </p>
            
            {isDev && this.state.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-left text-xs">
                <div className="font-medium text-red-800 mb-1">Hata Detayı:</div>
                <div className="text-red-700">{this.state.error.message}</div>
                {this.state.errorId && (
                  <div className="text-red-600 mt-1">ID: {this.state.errorId}</div>
                )}
              </div>
            )}
            
            <Button onClick={this.handleRetry}>
              Tekrar Dene
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
