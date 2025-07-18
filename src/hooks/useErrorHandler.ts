
import { useUnifiedErrorHandler } from './useUnifiedErrorHandler';
import { UseErrorHandlerOptions } from '@/types/hooks';

// Backward compatibility wrapper
export const useErrorHandler = (options: { component?: string } = {}) => {
  const { handleError, handleAsyncError } = useUnifiedErrorHandler({
    component: options.component || 'Unknown',
    showToast: true
  });

  // Legacy API compatibility
  const legacyHandleError = (
    error: Error | string,
    legacyOptions: UseErrorHandlerOptions = {}
  ) => {
    return handleError(error, legacyOptions.action || 'unknown', legacyOptions.metadata);
  };

  const legacyHandleAsyncError = async <T>(
    asyncOperation: () => Promise<T>,
    legacyOptions: UseErrorHandlerOptions = {}
  ) => {
    return handleAsyncError(asyncOperation, legacyOptions.action || 'execute', legacyOptions.metadata);
  };

  return {
    handleError: legacyHandleError,
    handleAsyncError: legacyHandleAsyncError
  };
};
