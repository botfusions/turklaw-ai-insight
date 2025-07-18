
import React from 'react';
import { cn } from '@/lib/utils';

interface SimplifiedLoaderProps {
  isLoading: boolean;
  message?: string;
  variant?: 'minimal' | 'card' | 'fullscreen';
  className?: string;
  children?: React.ReactNode;
}

export const SimplifiedLoader: React.FC<SimplifiedLoaderProps> = ({
  isLoading,
  message = 'Yükleniyor...',
  variant = 'minimal',
  className = '',
  children
}) => {
  if (!isLoading) {
    return children ? <>{children}</> : null;
  }

  const baseSpinner = (
    <div className="animate-spin rounded-full h-6 w-6 border-2 border-muted border-t-primary" />
  );

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-center gap-2 p-2', className)}>
        {baseSpinner}
        {message && (
          <span className="text-sm text-muted-foreground">{message}</span>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('flex flex-col items-center justify-center p-6 space-y-3', className)}>
        {baseSpinner}
        {message && (
          <p className="text-sm text-muted-foreground text-center">{message}</p>
        )}
      </div>
    );
  }

  // fullscreen variant
  return (
    <div className={cn('min-h-screen flex flex-col items-center justify-center bg-background', className)}>
      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-8 border border-border shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          {baseSpinner}
          {message && (
            <p className="text-sm text-muted-foreground animate-pulse text-center">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
