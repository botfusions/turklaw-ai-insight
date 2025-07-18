
import { unifiedErrorHandler } from './unifiedErrorHandler';
import { ErrorType, ErrorSeverity } from '@/components/system/ErrorMonitoringSystem';

interface CentralErrorOptions {
  component?: string;
  action?: string;
  severity?: ErrorSeverity;
  type?: ErrorType;
  metadata?: Record<string, any>;
  showToast?: boolean;
}

// Legacy wrapper for backward compatibility
class CentralErrorHandler {
  private static instance: CentralErrorHandler;

  static getInstance(): CentralErrorHandler {
    if (!CentralErrorHandler.instance) {
      CentralErrorHandler.instance = new CentralErrorHandler();
    }
    return CentralErrorHandler.instance;
  }

  handleError(error: Error | string, options: CentralErrorOptions = {}) {
    // Delegate to unified error handler
    return unifiedErrorHandler.handleError(error, options);
  }

  async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    options: CentralErrorOptions = {}
  ): Promise<{ success: boolean; data: T | null; error: string | null }> {
    // Delegate to unified error handler
    return unifiedErrorHandler.handleAsyncOperation(operation, options);
  }
}

export const centralErrorHandler = CentralErrorHandler.getInstance();
