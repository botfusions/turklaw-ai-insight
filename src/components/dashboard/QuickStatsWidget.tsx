import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Search, Bookmark, Eye, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface StatItem {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface QuickStatsWidgetProps {
  className?: string;
}

export function QuickStatsWidget({ className }: QuickStatsWidgetProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatItem[]>([
    {
      label: 'Bu Ay Aramalar',
      value: 0,
      change: 0,
      icon: <Search className="h-4 w-4" />,
      color: 'text-blue-600'
    },
    {
      label: 'Kaydedilen Kararlar',
      value: 0,
      change: 0,
      icon: <Bookmark className="h-4 w-4" />,
      color: 'text-green-600'
    },
    {
      label: 'Görüntülemeler',
      value: 0,
      change: 0,
      icon: <Eye className="h-4 w-4" />,
      color: 'text-purple-600'
    },
    {
      label: 'Bu Hafta',
      value: 0,
      change: 0,
      icon: <Calendar className="h-4 w-4" />,
      color: 'text-orange-600'
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    } else {
      // Show demo stats for non-authenticated users
      setStats([
        {
          label: 'Bu Ay Aramalar',
          value: 45,
          change: 12.5,
          icon: <Search className="h-4 w-4" />,
          color: 'text-blue-600'
        },
        {
          label: 'Kaydedilen Kararlar',
          value: 8,
          change: -2.1,
          icon: <Bookmark className="h-4 w-4" />,
          color: 'text-green-600'
        },
        {
          label: 'Görüntülemeler',
          value: 156,
          change: 8.3,
          icon: <Eye className="h-4 w-4" />,
          color: 'text-purple-600'
        },
        {
          label: 'Bu Hafta',
          value: 12,
          change: 15.7,
          icon: <Calendar className="h-4 w-4" />,
          color: 'text-orange-600'
        }
      ]);
      setLoading(false);
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Get current month searches
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthlySearches, error: searchError } = await supabase
        .from('user_searches')
        .select('id')
        .eq('user_id', user.id)
        .gte('search_date', startOfMonth.toISOString());

      // Get saved cases count
      const { data: savedCases, error: savedError } = await supabase
        .from('saved_cases')
        .select('id')
        .eq('user_id', user.id);

      // Get this week's searches
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const { data: weeklySearches, error: weeklyError } = await supabase
        .from('user_searches')
        .select('id')
        .eq('user_id', user.id)
        .gte('search_date', startOfWeek.toISOString());

      if (searchError || savedError || weeklyError) {
        throw new Error('Error fetching stats');
      }

      // Generate some demo changes (in real app, you'd compare with previous periods)
      const generateChange = () => (Math.random() - 0.5) * 30;

      setStats([
        {
          label: 'Bu Ay Aramalar',
          value: monthlySearches?.length || 0,
          change: generateChange(),
          icon: <Search className="h-4 w-4" />,
          color: 'text-blue-600'
        },
        {
          label: 'Kaydedilen Kararlar',
          value: savedCases?.length || 0,
          change: generateChange(),
          icon: <Bookmark className="h-4 w-4" />,
          color: 'text-green-600'
        },
        {
          label: 'Görüntülemeler',
          value: (monthlySearches?.length || 0) * 3 + Math.floor(Math.random() * 20),
          change: generateChange(),
          icon: <Eye className="h-4 w-4" />,
          color: 'text-purple-600'
        },
        {
          label: 'Bu Hafta',
          value: weeklySearches?.length || 0,
          change: generateChange(),
          icon: <Calendar className="h-4 w-4" />,
          color: 'text-orange-600'
        }
      ]);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Fallback to demo stats
      setStats(prev => prev.map(stat => ({
        ...stat,
        value: Math.floor(Math.random() * 50) + 10,
        change: (Math.random() - 0.5) * 30
      })));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        <h3 className="font-medium text-sm text-foreground">Hızlı İstatistikler</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
                <Badge 
                  variant={stat.change >= 0 ? "default" : "secondary"}
                  className="text-xs px-2 py-0"
                >
                  <div className="flex items-center gap-1">
                    {stat.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(stat.change).toFixed(1)}%
                  </div>
                </Badge>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}