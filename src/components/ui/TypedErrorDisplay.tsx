
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ErrorDisplayProps } from '@/types/components';
import { cn } from '@/lib/utils';

export function TypedErrorDisplay({
  error,
  onRetry,
  showRetry = true,
  variant = 'destructive',
  className,
  children
}: ErrorDisplayProps) {
  if (!error) {
    return <>{children}</>;
  }

  const errorMessage = error instanceof Error ? error.message : error;

  const variantClasses = {
    default: 'border-border',
    destructive: 'border-destructive/50 text-destructive dark:border-destructive',
    warning: 'border-yellow-500/50 text-yellow-700 dark:border-yellow-500'
  };

  return (
    <Alert className={cn(variantClasses[variant], className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Hata</AlertTitle>
      <AlertDescription className="mt-2">
        {errorMessage}
        {showRetry && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-3"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tekrar Dene
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
