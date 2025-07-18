
import { cn } from '@/lib/utils';
import { LoadingProps } from '@/types/components';
import { Loader2 } from 'lucide-react';

export function TypedLoadingSpinner({ 
  isLoading, 
  text = 'Yükleniyor...', 
  size = 'md', 
  className,
  children 
}: LoadingProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-4', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}
