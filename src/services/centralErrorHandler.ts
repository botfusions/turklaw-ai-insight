
import { errorTracker } from './errorTracking';
import { ErrorType, ErrorSeverity } from '@/components/system/ErrorMonitoringSystem';

interface CentralErrorOptions {
  component?: string;
  action?: string;
  severity?: ErrorSeverity;
  type?: ErrorType;
  metadata?: Record<string, any>;
  showToast?: boolean;
}

class CentralErrorHandler {
  private static instance: CentralErrorHandler;

  static getInstance(): CentralErrorHandler {
    if (!CentralErrorHandler.instance) {
      CentralErrorHandler.instance = new CentralErrorHandler();
    }
    return CentralErrorHandler.instance;
  }

  handleError(error: Error | string, options: CentralErrorOptions = {}) {
    const {
      component = 'Unknown',
      action = 'unknown',
      severity = ErrorSeverity.MEDIUM,
      type = ErrorType.UNKNOWN,
      metadata = {},
      showToast = true
    } = options;

    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    // Single source of truth for error logging
    errorTracker.logError(errorObj, {
      component,
      action,
      metadata: {
        ...metadata,
        severity,
        type,
        timestamp: Date.now()
      }
    });

    // Only log critical errors to console in production
    if (import.meta.env.DEV || severity === ErrorSeverity.CRITICAL) {
      console.error(`[${severity}] ${component}:${action}`, errorObj);
    }

    return {
      success: false,
      error: errorObj.message,
      severity,
      type
    };
  }

  async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    options: CentralErrorOptions = {}
  ): Promise<{ success: boolean; data: T | null; error: string | null }> {
    try {
      const data = await operation();
      return { success: true, data, error: null };
    } catch (error) {
      const result = this.handleError(error as Error, options);
      return { success: false, data: null, error: result.error };
    }
  }
}

export const centralErrorHandler = CentralErrorHandler.getInstance();
