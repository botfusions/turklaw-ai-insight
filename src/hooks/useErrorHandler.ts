
import { useCallback } from 'react';
import { useErrorMonitoring } from '@/components/system/ErrorMonitoringSystem';
import { errorTracker } from '@/services/errorTracking';
import { useToast } from '@/hooks/use-toast';
import { UseErrorHandlerOptions } from '@/types/hooks';

export const useErrorHandler = () => {
  const { reportError } = useErrorMonitoring();
  const { toast } = useToast();

  const handleError = useCallback((
    error: Error | string,
    options: UseErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      component = 'Unknown',
      action = 'unknown',
      metadata = {}
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
  }, [reportError, toast]);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    options: UseErrorHandlerOptions = {}
  ): Promise<{ success: boolean; data: T | null; error: Error | null }> => {
    try {
      const result = await asyncOperation();
      return { success: true, data: result, error: null };
    } catch (error) {
      const err = error as Error;
      handleError(err, options);
      return { success: false, data: null, error: err };
    }
  }, [handleError]);

  const handleNetworkError = useCallback((
    error: Error | string,
    options: Omit<UseErrorHandlerOptions, 'component'> = {}
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
    options: Omit<UseErrorHandlerOptions, 'component'> = {}
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
    options: Omit<UseErrorHandlerOptions, 'component'> = {}
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
