import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface AnalyticsChartProps {
  data: Array<{
    date: string;
    searches: number;
  }>;
}

export const AnalyticsChart = ({ data }: AnalyticsChartProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const maxSearches = Math.max(...data.map(d => d.searches));

  return (
    <Card className="bg-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Arama Trendleri
        </CardTitle>
        <CardDescription>
          Son 7 günlük arama aktivitesi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground min-w-[60px]">
                {formatDate(item.date)}
              </div>
              <div className="flex-1 mx-4">
                <div className="flex items-center">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${maxSearches > 0 ? (item.searches / maxSearches) * 100 : 0}%`,
                      minWidth: item.searches > 0 ? '4px' : '0px'
                    }}
                  />
                </div>
              </div>
              <div className="text-sm font-medium text-foreground min-w-[30px] text-right">
                {item.searches}
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Henüz veri bulunmamaktadır</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};