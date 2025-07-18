
import { useCallback } from 'react';
import { centralErrorHandler } from '@/services/centralErrorHandler';
import { useToast } from '@/hooks/use-toast';
import { UseErrorHandlerOptions } from '@/types/hooks';
import { ErrorType, ErrorSeverity } from '@/components/system/ErrorMonitoringSystem';

export const useErrorHandler = () => {
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

    const result = centralErrorHandler.handleError(error, {
      component,
      action,
      metadata,
      showToast
    });

    // Show toast notification if enabled
    if (showToast) {
      toast({
        title: "Hata",
        description: result.error,
        variant: "destructive",
      });
    }

    return result;
  }, [toast]);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    options: UseErrorHandlerOptions = {}
  ): Promise<{ success: boolean; data: T | null; error: Error | null }> => {
    const result = await centralErrorHandler.handleAsyncOperation(asyncOperation, {
      component: options.component || 'useErrorHandler',
      action: options.action || 'execute',
      metadata: options.metadata
    });

    if (!result.success && options.showToast !== false) {
      toast({
        title: "Hata",
        description: result.error || 'Bir hata oluştu',
        variant: "destructive",
      });
    }

    return {
      success: result.success,
      data: result.data,
      error: result.error ? new Error(result.error) : null
    };
  }, [toast]);

  return {
    handleError,
    handleAsyncError
  };
};
