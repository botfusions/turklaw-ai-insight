
import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { centralErrorHandler } from '@/services/centralErrorHandler';
import { ErrorSeverity, ErrorType } from '@/components/system/ErrorMonitoringSystem';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SimplifiedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Log error through central handler
    centralErrorHandler.handleError(error, {
      component: 'SimplifiedErrorBoundary',
      action: 'getDerivedStateFromError',
      severity: ErrorSeverity.HIGH,
      type: ErrorType.SYSTEM
    });
    
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    centralErrorHandler.handleError(error, {
      component: 'SimplifiedErrorBoundary',
      action: 'componentDidCatch',
      severity: ErrorSeverity.HIGH,
      type: ErrorType.SYSTEM,
      metadata: {
        componentStack: errorInfo.componentStack
      }
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-64 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-lg font-semibold">Bir hata oluştu</h2>
            <p className="text-muted-foreground">
              Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
            </p>
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
