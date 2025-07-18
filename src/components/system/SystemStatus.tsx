import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface SystemService {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  responseTime?: number;
  uptime?: number;
  lastChecked: Date;
}

interface SystemStatusProps {
  className?: string;
}

export function SystemStatus({ className }: SystemStatusProps) {
  const [services, setServices] = useState<SystemService[]>([
    {
      name: 'Arama Servisi',
      status: 'operational',
      responseTime: 145,
      uptime: 99.9,
      lastChecked: new Date()
    },
    {
      name: 'Veritabanı',
      status: 'operational',
      responseTime: 89,
      uptime: 99.95,
      lastChecked: new Date()
    },
    {
      name: 'Dosya Sistemi',
      status: 'operational',
      responseTime: 234,
      uptime: 99.8,
      lastChecked: new Date()
    },
    {
      name: 'API Gateway',
      status: 'operational',
      responseTime: 67,
      uptime: 99.99,
      lastChecked: new Date()
    }
  ]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'outage':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'outage':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Çalışıyor';
      case 'degraded':
        return 'Yavaş';
      case 'outage':
        return 'Arızalı';
      default:
        return 'Bilinmiyor';
    }
  };

  const refreshStatus = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Randomly update some service statuses for demo
    setServices(prev => prev.map(service => ({
      ...service,
      responseTime: Math.floor(Math.random() * 300) + 50,
      lastChecked: new Date(),
      // Rarely change status for demo
      status: Math.random() > 0.9 ? 
        (Math.random() > 0.5 ? 'degraded' : 'operational') : 
        service.status
    })));
    
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const overallStatus = services.every(s => s.status === 'operational') ? 
    'operational' : 
    services.some(s => s.status === 'outage') ? 
      'outage' : 
      'degraded';

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(overallStatus)}
            <h3 className="font-medium">Sistem Durumu</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshStatus}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Overall Status */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            {getStatusIcon(overallStatus)}
            <span className="font-medium">Genel Durum</span>
          </div>
          <Badge className={getStatusColor(overallStatus)}>
            {getStatusText(overallStatus)}
          </Badge>
        </div>

        {/* Services */}
        <div className="space-y-2">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(service.status)}
                <span className="text-sm font-medium">{service.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {service.responseTime && (
                  <span className="text-xs text-muted-foreground">
                    {service.responseTime}ms
                  </span>
                )}
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(service.status)}`}
                >
                  {getStatusText(service.status)}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Last Update */}
        <div className="text-xs text-muted-foreground text-center">
          Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
        </div>
      </div>
    </Card>
  );
}