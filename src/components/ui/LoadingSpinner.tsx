
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  showProgress?: boolean;
  variant?: 'default' | 'minimal' | 'detailed';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  message = 'Yükleniyor...',
  showProgress = false,
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-4">
        <div className={`animate-spin rounded-full border-2 border-muted border-t-primary ${sizeClasses[size]}`} />
        {message && (
          <p className="ml-3 text-sm text-muted-foreground">
            {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="bg-card/50 backdrop-blur-sm rounded-lg p-8 border border-border shadow-lg">
          <div className={`animate-spin rounded-full border-2 border-muted border-t-primary ${sizeClasses[size]} mx-auto`} />
          {message && (
            <p className="mt-4 text-sm text-muted-foreground text-center animate-pulse">
              {message}
            </p>
          )}
          {showProgress && (
            <div className="mt-4 w-48 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className={`animate-spin rounded-full border-2 border-muted border-t-primary ${sizeClasses[size]}`} />
      {message && (
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
      {showProgress && (
        <div className="mt-4 w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
        </div>
      )}
    </div>
  );
};
