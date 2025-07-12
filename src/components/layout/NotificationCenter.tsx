import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Bell, Check, X, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface NotificationCenterProps {
  trigger?: React.ReactNode;
}

export function NotificationCenter({ trigger }: NotificationCenterProps) {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '💡';
    }
  };

  const getNotificationColors = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-success';
      case 'warning':
        return 'border-l-warning';
      case 'error':
        return 'border-l-destructive';
      default:
        return 'border-l-primary';
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button 
            variant="ghost" 
            size="sm"
            className="relative h-9 w-9 rounded-lg hover:bg-muted transition-colors"
            aria-label={`Bildirimler ${unreadCount > 0 ? `(${unreadCount} okunmamış)` : ''}`}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-card border border-border shadow-lg"
        sideOffset={5}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Bildirimler</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Tümünü Okundu İşaretle
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {unreadCount} okunmamış bildirim
            </p>
          )}
        </div>
        
        <Separator />
        
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Henüz bildirim yok</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-80">
              <div className="p-2 space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-3 rounded-lg border-l-4 cursor-pointer transition-colors hover:bg-muted/50',
                      getNotificationColors(notification.type),
                      !notification.read && 'bg-muted/30'
                    )}
                    onClick={() => handleNotificationClick(notification)}
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
                            {formatDistanceToNow(notification.timestamp, {
                              addSuffix: true,
                              locale: tr,
                            })}
                          </span>
                          
                          {notification.actionLabel && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-primary hover:text-primary-foreground hover:bg-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationClick(notification);
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
                ))}
              </div>
            </ScrollArea>
            
            {notifications.length > 0 && (
              <>
                <Separator />
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="w-full justify-center text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Tüm Bildirimleri Temizle
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}