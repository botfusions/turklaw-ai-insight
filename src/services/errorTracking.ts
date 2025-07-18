
interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  context?: Record<string, any>;
}

class ErrorTrackingService {
  private isDevelopment = import.meta.env.DEV;
  private errors: Array<{ error: Error; context: ErrorContext; timestamp: number }> = [];
  private metrics: PerformanceMetric[] = [];

  logError(error: Error | string, context: ErrorContext = {}) {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const logEntry = {
      error: errorObj,
      context,
      timestamp: Date.now()
    };

    this.errors.push(logEntry);

    if (this.isDevelopment) {
      console.error('🚨 Error:', errorObj.message, context);
    }

    // In production, you would send this to your error tracking service
    // Example: Sentry, LogRocket, or custom endpoint
  }

  logInfo(message: string, context: ErrorContext = {}) {
    if (this.isDevelopment) {
      console.log('ℹ️ Info:', message, context);
    }

    // In production, you might want to send important info logs
    // to your logging service
  }

  logWarning(message: string, context: ErrorContext = {}) {
    if (this.isDevelopment) {
      console.warn('⚠️ Warning:', message, context);
    }

    // In production, send warnings to logging service
  }

  trackPerformance(name: string, startTime: number, context: Record<string, any> = {}) {
    const metric: PerformanceMetric = {
      name,
      value: Date.now() - startTime,
      timestamp: Date.now(),
      context
    };

    this.metrics.push(metric);

    if (this.isDevelopment) {
      console.log(`⏱️ Performance: ${name} took ${metric.value}ms`, context);
    }

    // In production, send to analytics service
  }

  getErrors() {
    return this.errors;
  }

  getMetrics() {
    return this.metrics;
  }

  clearLogs() {
    this.errors = [];
    this.metrics = [];
  }
}

export const errorTracker = new ErrorTrackingService();
