import { useCallback } from 'react';
import { useErrorMonitoring, ErrorType } from '@/components/system/ErrorMonitoringSystem';
import { errorTracker } from '@/services/errorTracking';
import { useToast } from '@/hooks/use-toast';

interface ErrorHandlerOptions {
  showToast?: boolean;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
  autoRetry?: boolean;
  retryDelay?: number;
}

export const useErrorHandler = () => {
  const { reportError } = useErrorMonitoring();
  const { toast } = useToast();

  const handleError = useCallback((
    error: Error | string,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      component = 'Unknown',
      action = 'unknown',
      metadata = {},
      autoRetry = false,
      retryDelay = 3000
    } = options;

    // Create error object if string is passed
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    // Log to error tracking service
    errorTracker.logError(errorObj, {
      component,
      action,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    });

    // Report to error monitoring system
    reportError(errorObj, undefined, {
      component,
      action,
      ...metadata
    });

    // Show toast notification if enabled
    if (showToast) {
      toast({
        title: "Hata",
        description: typeof error === 'string' ? error : error.message,
        variant: "destructive",
      });
    }

    // Auto-retry functionality
    if (autoRetry && typeof options.retryDelay === 'number') {
      setTimeout(() => {
        // This would need to be implemented based on the specific use case
        console.log('Auto-retry mechanism triggered');
      }, retryDelay);
    }
  }, [reportError, toast]);

  const handleAsyncError = useCallback(async (
    asyncOperation: () => Promise<any>,
    options: ErrorHandlerOptions = {}
  ) => {
    try {
      const result = await asyncOperation();
      return { success: true, data: result, error: null };
    } catch (error) {
      handleError(error as Error, options);
      return { success: false, data: null, error: error as Error };
    }
  }, [handleError]);

  const handleNetworkError = useCallback((
    error: Error | string,
    options: Omit<ErrorHandlerOptions, 'component'> = {}
  ) => {
    handleError(error, {
      ...options,
      component: 'NetworkRequest',
      metadata: {
        ...options.metadata,
        type: 'network',
        online: navigator.onLine
      }
    });
  }, [handleError]);

  const handleAuthError = useCallback((
    error: Error | string,
    options: Omit<ErrorHandlerOptions, 'component'> = {}
  ) => {
    handleError(error, {
      ...options,
      component: 'Authentication',
      metadata: {
        ...options.metadata,
        type: 'auth'
      }
    });
  }, [handleError]);

  const handleValidationError = useCallback((
    error: Error | string,
    fieldName?: string,
    options: Omit<ErrorHandlerOptions, 'component'> = {}
  ) => {
    handleError(error, {
      ...options,
      component: 'Validation',
      showToast: false, // Validation errors usually show in forms
      metadata: {
        ...options.metadata,
        type: 'validation',
        field: fieldName
      }
    });
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
    handleNetworkError,
    handleAuthError,
    handleValidationError
  };
};