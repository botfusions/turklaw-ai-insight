import React from 'react';
import { Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchHeaderProps {
  dataSource: 'cache' | 'api' | 'static' | 'error';
}

const getDataSourceConfig = (source: string) => {
  switch (source) {
    case 'cache':
      return { 
        label: '⚡ Cache', 
        className: 'bg-green-100 text-green-700 border-green-200'
      };
    case 'api':
      return { 
        label: '🔴 Live API', 
        className: 'bg-blue-100 text-blue-700 border-blue-200'
      };
    case 'static':
      return { 
        label: '📄 Static', 
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
      };
    case 'error':
      return { 
        label: '❌ Error', 
        className: 'bg-red-100 text-red-700 border-red-200'
      };
    default:
      return { 
        label: '🔄 Ready', 
        className: 'bg-gray-100 text-gray-700 border-gray-200'
      };
  }
};

export function SearchHeader({ dataSource }: SearchHeaderProps) {
  const sourceConfig = getDataSourceConfig(dataSource);

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Scale className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hukuk Araştırma Sistemi
              </h1>
              <p className="text-sm text-gray-600">
                Türk Hukuk Veritabanları - Hibrit Arama
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={`text-xs font-medium ${sourceConfig.className}`}
            >
              {sourceConfig.label}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}