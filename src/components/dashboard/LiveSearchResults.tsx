import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Users, TrendingUp, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface LiveActivity {
  id: string;
  type: 'search' | 'save' | 'view';
  query?: string;
  timestamp: Date;
  anonymizedUser: string;
}

interface LiveSearchResultsProps {
  className?: string;
}

export function LiveSearchResults({ className }: LiveSearchResultsProps) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [totalSearchesToday, setTotalSearchesToday] = useState(0);

  // Generate mock live activities for demo
  const generateMockActivity = useCallback(() => {
    const queries = [
      'Borçlar Kanunu madde 6',
      'İş Kanunu tatil günleri',
      'Yargıtay kararı 2024',
      'İcra İflas Kanunu',
      'Tazminat davası',
      'Ticaret Kanunu şirket',
      'Anayasa Mahkemesi'
    ];
    
    const types: Array<'search' | 'save' | 'view'> = ['search', 'save', 'view'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      id: Date.now().toString(),
      type,
      query: type === 'search' ? queries[Math.floor(Math.random() * queries.length)] : undefined,
      timestamp: new Date(),
      anonymizedUser: `Kullanıcı ${Math.floor(Math.random() * 1000) + 1}`
    };
  }, []);

  useEffect(() => {
    // Initialize with some activities
    const initialActivities = Array.from({ length: 5 }, generateMockActivity);
    setActivities(initialActivities);
    setOnlineUsers(Math.floor(Math.random() * 50) + 10);
    setTotalSearchesToday(Math.floor(Math.random() * 1000) + 500);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newActivity = generateMockActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep last 10
      
      // Randomly update counters
      if (Math.random() > 0.7) {
        setOnlineUsers(prev => Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)));
      }
      if (Math.random() > 0.8) {
        setTotalSearchesToday(prev => prev + 1);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [generateMockActivity]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'search':
        return <TrendingUp className="h-3 w-3" />;
      case 'save':
        return <Users className="h-3 w-3" />;
      case 'view':
        return <Activity className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  const getActivityText = (activity: LiveActivity) => {
    switch (activity.type) {
      case 'search':
        return `"${activity.query}" araması yaptı`;
      case 'save':
        return 'bir kararı kaydetti';
      case 'view':
        return 'bir kararı görüntüledi';
      default:
        return 'bir işlem yaptı';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'search':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'save':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'view':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Canlı Aktivite</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">{onlineUsers} online</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{onlineUsers}</div>
            <div className="text-xs text-muted-foreground">Aktif Kullanıcı</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{totalSearchesToday}</div>
            <div className="text-xs text-muted-foreground">Bugünkü Arama</div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Son Aktiviteler</h4>
          <AnimatePresence>
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <Badge className={`p-1 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </Badge>
                <div className="flex-1 text-xs">
                  <span className="font-medium">{activity.anonymizedUser}</span>
                  <span className="text-muted-foreground ml-1">
                    {getActivityText(activity)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {Math.floor((Date.now() - activity.timestamp.getTime()) / 1000)}s
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <Button variant="outline" size="sm" className="w-full">
          <TrendingUp className="h-3 w-3 mr-1" />
          Tüm İstatistikleri Görüntüle
        </Button>
      </div>
    </Card>
  );
}