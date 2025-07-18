
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bell, Check, Trash2 } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationListProps {
  onClose?: () => void;
}

export function NotificationList({ onClose }: NotificationListProps) {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    clearAll,
  } = useNotifications();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Bildirimler</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <Check className="h-3 w-3 mr-1" />
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

      {/* Content */}
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
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClose={onClose}
                />
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
    </div>
  );
}
