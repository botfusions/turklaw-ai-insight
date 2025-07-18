
import { errorTracker } from './errorTracking';
import { ErrorType, ErrorSeverity } from '@/components/system/ErrorMonitoringSystem';

interface UnifiedErrorOptions {
  component?: string;
  action?: string;
  severity?: ErrorSeverity;
  type?: ErrorType;
  metadata?: Record<string, any>;
  showToast?: boolean;
  autoRecover?: boolean;
}

interface ErrorState {
  id: string;
  error: Error;
  context: UnifiedErrorOptions;
  timestamp: number;
  attempts: number;
}

class UnifiedErrorHandler {
  private static instance: UnifiedErrorHandler;
  private errors: ErrorState[] = [];
  private readonly maxErrors = 20;
  private readonly maxRetries = 3;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private unhandledRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;
  private globalErrorHandler: ((event: ErrorEvent) => void) | null = null;

  static getInstance(): UnifiedErrorHandler {
    if (!UnifiedErrorHandler.instance) {
      UnifiedErrorHandler.instance = new UnifiedErrorHandler();
    }
    return UnifiedErrorHandler.instance;
  }

  constructor() {
    this.startCleanupTimer();
    this.setupGlobalErrorHandlers();
  }

  handleError(error: Error | string, options: UnifiedErrorOptions = {}) {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const {
      component = 'Unknown',
      action = 'unknown',
      severity = this.classifyErrorSeverity(errorObj),
      type = this.classifyErrorType(errorObj),
      metadata = {},
      showToast = true,
      autoRecover = false
    } = options;

    const errorState: ErrorState = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      error: errorObj,
      context: { component, action, severity, type, metadata, showToast, autoRecover },
      timestamp: Date.now(),
      attempts: 0
    };

    // Add to error collection with memory management
    this.addError(errorState);

    // Log to tracking service
    errorTracker.logError(errorObj, {
      component,
      action,
      metadata: {
        ...metadata,
        severity,
        type,
        errorId: errorState.id
      }
    });

    // Console logging based on environment and severity
    if (import.meta.env.DEV || severity === ErrorSeverity.CRITICAL) {
      console.error(`[${severity}] ${component}:${action}`, errorObj);
    }

    // Auto-recovery for specific error types
    if (autoRecover && this.shouldAttemptRecovery(errorState)) {
      setTimeout(() => this.attemptRecovery(errorState.id), 2000);
    }

    return {
      success: false,
      error: errorObj.message,
      errorId: errorState.id,
      severity,
      type,
      userMessage: this.getUserFriendlyMessage(type, severity)
    };
  }

  async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    options: UnifiedErrorOptions = {}
  ): Promise<{ success: boolean; data: T | null; error: string | null }> {
    try {
      const data = await operation();
      return { success: true, data, error: null };
    } catch (error) {
      const result = this.handleError(error as Error, options);
      return { success: false, data: null, error: result.error };
    }
  }

  private addError(errorState: ErrorState) {
    this.errors.push(errorState);
    
    // Maintain memory limit
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }
  }

  private classifyErrorSeverity(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorSeverity.MEDIUM;
    }
    if (message.includes('auth') || message.includes('permission')) {
      return ErrorSeverity.HIGH;
    }
    if (message.includes('system') || message.includes('critical')) {
      return ErrorSeverity.CRITICAL;
    }
    return ErrorSeverity.LOW;
  }

  private classifyErrorType(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    
    if (message.includes('auth') || message.includes('login')) return ErrorType.AUTH;
    if (message.includes('network') || message.includes('fetch')) return ErrorType.NETWORK;
    if (message.includes('database') || message.includes('query')) return ErrorType.DATABASE;
    if (message.includes('validation') || message.includes('invalid')) return ErrorType.VALIDATION;
    if (message.includes('permission') || message.includes('forbidden')) return ErrorType.PERMISSION;
    if (message.includes('system') || message.includes('internal')) return ErrorType.SYSTEM;
    
    return ErrorType.UNKNOWN;
  }

  private getUserFriendlyMessage(type: ErrorType, severity: ErrorSeverity): string {
    if (import.meta.env.DEV) {
      return 'Bir hata oluştu. Detaylar için konsolu kontrol edin.';
    }

    switch (type) {
      case ErrorType.AUTH:
        return 'Giriş yapma sorunu. Lütfen tekrar deneyin.';
      case ErrorType.NETWORK:
        return 'Bağlantı sorunu. İnternet bağlantınızı kontrol edin.';
      case ErrorType.DATABASE:
        return 'Veri işleme sorunu. Lütfen daha sonra tekrar deneyin.';
      case ErrorType.VALIDATION:
        return 'Girdiğiniz bilgiler geçersiz. Lütfen kontrol edin.';
      case ErrorType.PERMISSION:
        return 'Bu işlem için yetkiniz yok.';
      default:
        return severity === ErrorSeverity.CRITICAL 
          ? 'Kritik sistem hatası. Sayfa yenileniyor...'
          : 'Bir sorun oluştu. Lütfen tekrar deneyin.';
    }
  }

  private shouldAttemptRecovery(errorState: ErrorState): boolean {
    const { type } = errorState.context;
    return (type === ErrorType.NETWORK || type === ErrorType.VALIDATION) && 
           errorState.attempts < this.maxRetries;
  }

  private async attemptRecovery(errorId: string): Promise<boolean> {
    const errorState = this.errors.find(e => e.id === errorId);
    if (!errorState || errorState.attempts >= this.maxRetries) {
      return false;
    }

    errorState.attempts++;

    try {
      if (errorState.context.type === ErrorType.NETWORK) {
        // For network errors, we can't really retry automatically
        // but we can mark them as potentially resolved
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  private startCleanupTimer() {
    this.cleanupTimer = setInterval(() => {
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      this.errors = this.errors.filter(e => e.timestamp > oneHourAgo);
    }, 10 * 60 * 1000); // Clean up every 10 minutes
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      this.handleError(event.reason, {
        component: 'GlobalHandler',
        action: 'unhandledRejection',
        type: ErrorType.SYSTEM,
        severity: ErrorSeverity.HIGH,
        metadata: { url: window.location.href }
      });
    };

    // Handle global errors
    const handleGlobalError = (event: ErrorEvent) => {
      this.handleError(event.error || event.message, {
        component: 'GlobalHandler',
        action: 'globalError',
        type: ErrorType.SYSTEM,
        severity: ErrorSeverity.HIGH,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          url: window.location.href
        }
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    // Store references for cleanup
    this.unhandledRejectionHandler = handleUnhandledRejection;
    this.globalErrorHandler = handleGlobalError;
  }

  getErrorStats() {
    const now = Date.now();
    const last24Hours = now - (24 * 60 * 60 * 1000);
    
    return {
      total: this.errors.length,
      recent: this.errors.filter(e => e.timestamp > last24Hours).length,
      byType: this.getErrorsByType(),
      bySeverity: this.getErrorsBySeverity()
    };
  }

  private getErrorsByType() {
    const stats: Record<string, number> = {};
    this.errors.forEach(error => {
      const type = error.context.type || ErrorType.UNKNOWN;
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  }

  private getErrorsBySeverity() {
    const stats: Record<string, number> = {};
    this.errors.forEach(error => {
      const severity = error.context.severity || ErrorSeverity.MEDIUM;
      stats[severity] = (stats[severity] || 0) + 1;
    });
    return stats;
  }

  cleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.errors = [];
    
    if (this.unhandledRejectionHandler) {
      window.removeEventListener('unhandledrejection', this.unhandledRejectionHandler);
      this.unhandledRejectionHandler = null;
    }
    
    if (this.globalErrorHandler) {
      window.removeEventListener('error', this.globalErrorHandler);
      this.globalErrorHandler = null;
    }
  }
}

export const unifiedErrorHandler = UnifiedErrorHandler.getInstance();
