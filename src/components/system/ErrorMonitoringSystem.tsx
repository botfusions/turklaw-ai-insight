import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { errorTracker } from '@/services/errorTracking';
import { useToast } from '@/hooks/use-toast';

// Enhanced error types for better categorization
export enum ErrorType {
  AUTH = 'auth',
  NETWORK = 'network',
  DATABASE = 'database',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  SYSTEM = 'system',
  UNKNOWN = 'unknown'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface MonitoredError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  timestamp: number;
  stack?: string;
  context?: Record<string, any>;
  resolved?: boolean;
  autoRecoverable?: boolean;
}

interface ErrorMonitoringContextType {
  errors: MonitoredError[];
  reportError: (error: Error | string, type?: ErrorType, context?: Record<string, any>) => void;
  clearError: (id: string) => void;
  clearAllErrors: () => void;
  getErrorsByType: (type: ErrorType) => MonitoredError[];
  getUnresolvedErrors: () => MonitoredError[];
  attemptAutoRecovery: (errorId: string) => Promise<boolean>;
}

const ErrorMonitoringContext = createContext<ErrorMonitoringContextType | undefined>(undefined);

interface ErrorMonitoringProviderProps {
  children: ReactNode;
}

export const ErrorMonitoringProvider: React.FC<ErrorMonitoringProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<MonitoredError[]>([]);
  const { toast } = useToast();

  // Enhanced error classification
  const classifyError = useCallback((error: Error | string): { type: ErrorType; severity: ErrorSeverity; userMessage: string } => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'string' ? undefined : error.stack;
    
    const lowerMessage = errorMessage.toLowerCase();
    
    // Authentication errors
    if (lowerMessage.includes('auth') || lowerMessage.includes('login') || lowerMessage.includes('unauthorized')) {
      return {
        type: ErrorType.AUTH,
        severity: ErrorSeverity.HIGH,
        userMessage: 'Kimlik doğrulama hatası. Lütfen tekrar giriş yapın.'
      };
    }
    
    // Network errors
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('connection')) {
      return {
        type: ErrorType.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.'
      };
    }
    
    // Database errors
    if (lowerMessage.includes('database') || lowerMessage.includes('sql') || lowerMessage.includes('query')) {
      return {
        type: ErrorType.DATABASE,
        severity: ErrorSeverity.HIGH,
        userMessage: 'Veritabanı hatası. Lütfen daha sonra tekrar deneyin.'
      };
    }
    
    // Validation errors
    if (lowerMessage.includes('validation') || lowerMessage.includes('invalid') || lowerMessage.includes('required')) {
      return {
        type: ErrorType.VALIDATION,
        severity: ErrorSeverity.LOW,
        userMessage: 'Girdiğiniz bilgilerde hata var. Lütfen kontrol edin.'
      };
    }
    
    // Permission errors
    if (lowerMessage.includes('permission') || lowerMessage.includes('forbidden') || lowerMessage.includes('access')) {
      return {
        type: ErrorType.PERMISSION,
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'Bu işlem için yetkiniz yok.'
      };
    }
    
    // System errors
    if (lowerMessage.includes('system') || lowerMessage.includes('internal') || stack?.includes('react')) {
      return {
        type: ErrorType.SYSTEM,
        severity: ErrorSeverity.CRITICAL,
        userMessage: 'Sistem hatası. Sayfa yenilenerek düzeltilmeye çalışılıyor.'
      };
    }
    
    // Unknown errors
    return {
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      userMessage: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
    };
  }, []);

  // Enhanced error reporting with auto-recovery detection
  const reportError = useCallback((error: Error | string, type?: ErrorType, context?: Record<string, any>) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const classification = classifyError(errorObj);
    
    const monitoredError: MonitoredError = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type || classification.type,
      severity: classification.severity,
      message: errorObj.message,
      userMessage: classification.userMessage,
      timestamp: Date.now(),
      stack: errorObj.stack,
      context,
      resolved: false,
      autoRecoverable: classification.type === ErrorType.NETWORK || classification.type === ErrorType.VALIDATION
    };
    
    setErrors(prev => [...prev, monitoredError]);
    
    // Log to error tracking service
    errorTracker.logError(errorObj, {
      component: 'ErrorMonitoringSystem',
      action: 'reportError',
      metadata: {
        type: monitoredError.type,
        severity: monitoredError.severity,
        autoRecoverable: monitoredError.autoRecoverable,
        ...context
      }
    });
    
    // Show user-friendly toast notification
    if (classification.severity === ErrorSeverity.HIGH || classification.severity === ErrorSeverity.CRITICAL) {
      toast({
        title: "Hata",
        description: monitoredError.userMessage,
        variant: "destructive",
      });
    }
    
    // Auto-recovery for recoverable errors
    if (monitoredError.autoRecoverable) {
      setTimeout(() => {
        attemptAutoRecovery(monitoredError.id);
      }, 2000);
    }
  }, [classifyError, toast]);

  // Auto-recovery mechanism
  const attemptAutoRecovery = useCallback(async (errorId: string): Promise<boolean> => {
    const error = errors.find(e => e.id === errorId);
    if (!error || !error.autoRecoverable) return false;
    
    try {
      // Simulate recovery attempts based on error type
      if (error.type === ErrorType.NETWORK) {
        // For network errors, try to refresh the page or retry the request
        window.location.reload();
        return true;
      }
      
      if (error.type === ErrorType.VALIDATION) {
        // For validation errors, mark as resolved (user needs to correct input)
        setErrors(prev => prev.map(e => 
          e.id === errorId ? { ...e, resolved: true } : e
        ));
        return true;
      }
      
      return false;
    } catch (recoveryError) {
      errorTracker.logError(recoveryError as Error, {
        component: 'ErrorMonitoringSystem',
        action: 'attemptAutoRecovery',
        metadata: { originalErrorId: errorId }
      });
      return false;
    }
  }, [errors]);

  // Error management functions
  const clearError = useCallback((id: string) => {
    setErrors(prev => prev.filter(e => e.id !== id));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getErrorsByType = useCallback((type: ErrorType) => {
    return errors.filter(e => e.type === type);
  }, [errors]);

  const getUnresolvedErrors = useCallback(() => {
    return errors.filter(e => !e.resolved);
  }, [errors]);

  // Global error handlers
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportError(event.reason, ErrorType.SYSTEM, {
        source: 'unhandledRejection',
        url: window.location.href
      });
    };

    const handleError = (event: ErrorEvent) => {
      reportError(event.error || event.message, ErrorType.SYSTEM, {
        source: 'windowError',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        url: window.location.href
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [reportError]);

  // Cleanup old errors (keep only last 50)
  useEffect(() => {
    if (errors.length > 50) {
      setErrors(prev => prev.slice(-50));
    }
  }, [errors]);

  const value: ErrorMonitoringContextType = {
    errors,
    reportError,
    clearError,
    clearAllErrors,
    getErrorsByType,
    getUnresolvedErrors,
    attemptAutoRecovery
  };

  return (
    <ErrorMonitoringContext.Provider value={value}>
      {children}
    </ErrorMonitoringContext.Provider>
  );
};

export const useErrorMonitoring = (): ErrorMonitoringContextType => {
  const context = useContext(ErrorMonitoringContext);
  if (context === undefined) {
    throw new Error('useErrorMonitoring must be used within an ErrorMonitoringProvider');
  }
  return context;
};
