
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { HelpCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedTooltipProps {
  content: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'help' | 'warning' | 'success';
  size?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
  className?: string;
}

export function EnhancedTooltip({
  content,
  title,
  children,
  variant = 'default',
  size = 'md',
  showCloseButton = false,
  className
}: EnhancedTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const variantStyles = {
    default: 'bg-popover text-popover-foreground border',
    help: 'bg-blue-50 text-blue-900 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    success: 'bg-green-50 text-green-900 border-green-200'
  };

  const sizeStyles = {
    sm: 'max-w-xs p-2 text-xs',
    md: 'max-w-sm p-3 text-sm',
    lg: 'max-w-md p-4 text-base'
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          className={cn(
            variantStyles[variant],
            sizeStyles[size],
            'shadow-lg',
            className
          )}
          sideOffset={8}
        >
          <div className="space-y-2">
            {title && (
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{title}</h4>
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
            <div>{content}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface HelpTooltipProps {
  content: React.ReactNode;
  title?: string;
  className?: string;
}

export function HelpTooltip({ content, title, className }: HelpTooltipProps) {
  return (
    <EnhancedTooltip
      content={content}
      title={title}
      variant="help"
      size="md"
      showCloseButton
      className={className}
    >
      <Button variant="ghost" size="sm" className="h-auto p-1 text-muted-foreground hover:text-foreground">
        <HelpCircle className="h-4 w-4" />
      </Button>
    </EnhancedTooltip>
  );
}
