
import { useCallback } from 'react';
import { unifiedErrorHandler } from '@/services/unifiedErrorHandler';
import { useToast } from '@/hooks/use-toast';
import { ErrorType, ErrorSeverity } from '@/components/system/ErrorMonitoringSystem';

interface UseUnifiedErrorHandlerOptions {
  component?: string;
  showToast?: boolean;
}

export const useUnifiedErrorHandler = (options: UseUnifiedErrorHandlerOptions = {}) => {
  const { toast } = useToast();
  const { component = 'Component', showToast = true } = options;

  const handleError = useCallback((
    error: Error | string,
    action = 'unknown',
    metadata = {}
  ) => {
    const result = unifiedErrorHandler.handleError(error, {
      component,
      action,
      metadata,
      showToast: false // We'll handle toast here to avoid duplicates
    });

    // Show toast notification if enabled and not in production for low severity errors
    if (showToast && (import.meta.env.DEV || result.severity !== ErrorSeverity.LOW)) {
      toast({
        title: "Hata",
        description: result.userMessage,
        variant: "destructive",
      });
    }

    return result;
  }, [component, showToast, toast]);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    action = 'execute',
    metadata = {}
  ) => {
    const result = await unifiedErrorHandler.handleAsyncOperation(asyncOperation, {
      component,
      action,
      metadata,
      showToast: false // We'll handle toast here
    });

    // Show toast for failed operations
    if (!result.success && showToast) {
      toast({
        title: "Hata",
        description: result.error || 'Bir hata oluştu',
        variant: "destructive",
      });
    }

    return result;
  }, [component, showToast, toast]);

  return {
    handleError,
    handleAsyncError,
    getErrorStats: unifiedErrorHandler.getErrorStats.bind(unifiedErrorHandler)
  };
};
