
import { Button } from '@/components/ui/button';
import { Check, X, ExternalLink } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const navigate = useNavigate();
  const { markAsRead, removeNotification } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '💡';
    }
  };

  const getNotificationColors = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500';
      case 'warning': return 'border-l-yellow-500';
      case 'error': return 'border-l-red-500';
      default: return 'border-l-primary';
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose?.();
    }
  };

  return (
    <div
      className={cn(
        'p-3 rounded-lg border-l-4 cursor-pointer transition-colors hover:bg-muted/50',
        getNotificationColors(notification.type),
        !notification.read && 'bg-muted/30'
      )}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">
              {getNotificationIcon(notification.type)}
            </span>
            <p className="font-medium text-sm text-foreground truncate">
              {notification.title}
            </p>
            {!notification.read && (
              <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
            )}
          </div>
          
          {notification.message && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {notification.message}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {new Date(notification.timestamp).toLocaleDateString('tr-TR')}
            </span>
            
            {notification.actionLabel && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-primary hover:text-primary-foreground hover:bg-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                {notification.actionLabel}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(notification.id);
              }}
              aria-label="Okundu işaretle"
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
            aria-label="Bildirimi sil"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
