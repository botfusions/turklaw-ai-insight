import React from 'react';
import { Scale, Database, Server, FileText, AlertTriangle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchHeaderProps {
  dataSource: 'cache' | 'api' | 'static' | 'error';
}

const getDataSourceConfig = (source: string) => {
  switch (source) {
    case 'cache':
      return { 
        label: 'Cache Verisi', 
        icon: Database,
        className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
        pulseClass: 'animate-pulse'
      };
    case 'api':
      return { 
        label: 'Canlı API', 
        icon: Server,
        className: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
        pulseClass: 'animate-pulse'
      };
    case 'static':
      return { 
        label: 'Statik Veri', 
        icon: FileText,
        className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
        pulseClass: ''
      };
    case 'error':
      return { 
        label: 'Hata', 
        icon: AlertTriangle,
        className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
        pulseClass: 'animate-pulse'
      };
    default:
      return { 
        label: 'Hazır', 
        icon: RefreshCw,
        className: 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
        pulseClass: ''
      };
  }
};

export const SearchHeader = React.memo(({ dataSource }: SearchHeaderProps) => {
  const sourceConfig = getDataSourceConfig(dataSource);
  const IconComponent = sourceConfig.icon;

  return (
    <header 
      className="glass-effect border-b border-border sticky top-0 z-40 backdrop-blur-md"
      role="banner"
      aria-label="Hukuk Araştırma Sistemi Header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Scale 
                className="w-10 h-10 sm:w-12 sm:h-12 text-primary transition-colors hover:text-primary-glow" 
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Hukuk Araştırma Sistemi
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 font-medium">
                Türk Hukuk Veritabanları - Hibrit Arama
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge 
              variant="outline" 
              className={`
                text-sm font-semibold px-3 py-1.5 rounded-full
                transition-all duration-300 ease-in-out
                ${sourceConfig.className}
                ${sourceConfig.pulseClass}
                shadow-sm hover:shadow-md
              `}
              aria-label={`Veri kaynağı: ${sourceConfig.label}`}
            >
              <IconComponent className="w-4 h-4 mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">{sourceConfig.label}</span>
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
});