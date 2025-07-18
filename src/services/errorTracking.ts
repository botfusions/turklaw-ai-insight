
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
  private maxErrors = 100; // Limit stored errors to prevent memory issues

  logError(error: Error | string, context: ErrorContext = {}) {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const logEntry = {
      error: errorObj,
      context,
      timestamp: Date.now()
    };

    this.errors.push(logEntry);

    // Limit stored errors to prevent memory issues
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

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

    // Limit stored metrics to prevent memory issues
    if (this.metrics.length > this.maxErrors) {
      this.metrics = this.metrics.slice(-this.maxErrors);
    }

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

  // Get error statistics
  getErrorStats() {
    const now = Date.now();
    const last24Hours = now - (24 * 60 * 60 * 1000);
    const lastHour = now - (60 * 60 * 1000);
    
    return {
      total: this.errors.length,
      last24Hours: this.errors.filter(e => e.timestamp > last24Hours).length,
      lastHour: this.errors.filter(e => e.timestamp > lastHour).length,
      components: this.getComponentStats(),
      actions: this.getActionStats()
    };
  }

  private getComponentStats() {
    const stats: Record<string, number> = {};
    this.errors.forEach(error => {
      const component = error.context.component || 'unknown';
      stats[component] = (stats[component] || 0) + 1;
    });
    return stats;
  }

  private getActionStats() {
    const stats: Record<string, number> = {};
    this.errors.forEach(error => {
      const action = error.context.action || 'unknown';
      stats[action] = (stats[action] || 0) + 1;
    });
    return stats;
  }
}

export const errorTracker = new ErrorTrackingService();
