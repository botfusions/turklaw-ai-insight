import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  AlertTriangle, 
  Bug, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Trash2,
  Network,
  Database,
  Shield,
  User,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useErrorMonitoring, ErrorType, ErrorSeverity, MonitoredError } from '@/components/system/ErrorMonitoringSystem';
import { errorTracker } from '@/services/errorTracking';

const ErrorDebugPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedError, setSelectedError] = useState<MonitoredError | null>(null);
  const { 
    errors, 
    clearError, 
    clearAllErrors, 
    getErrorsByType,
    getUnresolvedErrors,
    attemptAutoRecovery 
  } = useErrorMonitoring();

  // Don't render in production
  if (!import.meta.env.DEV) {
    return null;
  }

  const getErrorIcon = (type: ErrorType) => {
    switch (type) {
      case ErrorType.AUTH:
        return <User className="h-4 w-4" />;
      case ErrorType.NETWORK:
        return <Network className="h-4 w-4" />;
      case ErrorType.DATABASE:
        return <Database className="h-4 w-4" />;
      case ErrorType.PERMISSION:
        return <Shield className="h-4 w-4" />;
      case ErrorType.SYSTEM:
        return <Settings className="h-4 w-4" />;
      case ErrorType.VALIDATION:
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'bg-blue-100 text-blue-800';
      case ErrorSeverity.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case ErrorSeverity.HIGH:
        return 'bg-orange-100 text-orange-800';
      case ErrorSeverity.CRITICAL:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: ErrorType) => {
    switch (type) {
      case ErrorType.AUTH:
        return 'bg-purple-100 text-purple-800';
      case ErrorType.NETWORK:
        return 'bg-blue-100 text-blue-800';
      case ErrorType.DATABASE:
        return 'bg-green-100 text-green-800';
      case ErrorType.PERMISSION:
        return 'bg-red-100 text-red-800';
      case ErrorType.SYSTEM:
        return 'bg-gray-100 text-gray-800';
      case ErrorType.VALIDATION:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('tr-TR');
  };

  const unresolvedErrors = getUnresolvedErrors();
  const errorsByType = Object.values(ErrorType).map(type => ({
    type,
    count: getErrorsByType(type).length,
    unresolved: getErrorsByType(type).filter(e => !e.resolved).length
  }));

  const trackingErrors = errorTracker.getErrors();
  const trackingMetrics = errorTracker.getMetrics();

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="border-2 border-orange-200 bg-orange-50">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bug className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-sm font-medium text-orange-800">
                    Error Debug Panel
                  </CardTitle>
                  {unresolvedErrors.length > 0 && (
                    <Badge variant="destructive" className="h-5 text-xs">
                      {unresolvedErrors.length}
                    </Badge>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-orange-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-orange-600" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* Error Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Errors:</span>
                  <Badge variant="secondary">{errors.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Unresolved:</span>
                  <Badge variant="destructive">{unresolvedErrors.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tracking Errors:</span>
                  <Badge variant="outline">{trackingErrors.length}</Badge>
                </div>
              </div>

              <Separator />

              {/* Error Types Breakdown */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Error Types:</h4>
                <div className="space-y-1">
                  {errorsByType.filter(item => item.count > 0).map(item => (
                    <div key={item.type} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {getErrorIcon(item.type)}
                        <span className="capitalize">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge className={`h-4 text-xs ${getTypeColor(item.type)}`}>
                          {item.count}
                        </Badge>
                        {item.unresolved > 0 && (
                          <Badge variant="destructive" className="h-4 text-xs">
                            {item.unresolved}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Recent Errors */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Errors:</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {errors.slice(-10).reverse().map(error => (
                    <div 
                      key={error.id} 
                      className={`p-2 rounded border text-xs cursor-pointer transition-colors ${
                        selectedError?.id === error.id 
                          ? 'border-orange-300 bg-orange-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedError(selectedError?.id === error.id ? null : error)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getErrorIcon(error.type)}
                          <span className="font-medium">{error.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge className={`h-4 text-xs ${getSeverityColor(error.severity)}`}>
                            {error.severity}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatTime(error.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1 text-gray-600 truncate">
                        {error.message}
                      </div>
                      {error.autoRecoverable && (
                        <div className="mt-1">
                          <Badge variant="outline" className="h-4 text-xs">
                            Auto-recoverable
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Error Details */}
              {selectedError && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Error Details:</h4>
                    <div className="text-xs space-y-1">
                      <div><strong>Message:</strong> {selectedError.message}</div>
                      <div><strong>User Message:</strong> {selectedError.userMessage}</div>
                      <div><strong>Type:</strong> {selectedError.type}</div>
                      <div><strong>Severity:</strong> {selectedError.severity}</div>
                      <div><strong>Time:</strong> {new Date(selectedError.timestamp).toLocaleString('tr-TR')}</div>
                      {selectedError.context && (
                        <div><strong>Context:</strong> {JSON.stringify(selectedError.context, null, 2)}</div>
                      )}
                      {selectedError.stack && (
                        <div className="mt-2">
                          <strong>Stack:</strong>
                          <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {selectedError.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => clearError(selectedError.id)}
                        className="text-xs"
                      >
                        Clear
                      </Button>
                      {selectedError.autoRecoverable && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => attemptAutoRecovery(selectedError.id)}
                          className="text-xs"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearAllErrors}
                  className="text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => errorTracker.clearLogs()}
                  className="text-xs"
                >
                  Clear Tracking
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default ErrorDebugPanel;