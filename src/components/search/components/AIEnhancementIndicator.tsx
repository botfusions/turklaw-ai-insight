import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles, Brain, Target, Loader2 } from 'lucide-react';
import { QueryEnhancement } from '@/hooks/useAIQueryEnhancement';
import { cn } from '@/lib/utils';

interface AIEnhancementIndicatorProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  enhancement: QueryEnhancement | null;
  loading: boolean;
}

export const AIEnhancementIndicator: React.FC<AIEnhancementIndicatorProps> = ({
  enabled,
  onToggle,
  enhancement,
  loading
}) => {
  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'legal_regulation_search':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'case_search':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'legal_advice':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getIntentLabel = (intent: string) => {
    switch (intent) {
      case 'legal_regulation_search':
        return 'Mevzuat Araması';
      case 'case_search':
        return 'Karar Araması';
      case 'legal_advice':
        return 'Hukuki Görüş';
      default:
        return 'Genel Arama';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <Label htmlFor="ai-enhancement" className="text-sm font-medium">
            AI Geliştirme
          </Label>
          <Switch
            id="ai-enhancement"
            checked={enabled}
            onCheckedChange={onToggle}
          />
        </div>

        {loading && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-xs">Analiz ediliyor...</span>
          </div>
        )}
      </div>

      {enabled && enhancement && (
        <div className="flex items-center gap-2">
          {enhancement.confidence > 0.8 && (
            <Badge variant="outline" className="gap-1">
              <Target className="h-3 w-3" />
              <span className="text-xs">
                %{Math.round(enhancement.confidence * 100)} güven
              </span>
            </Badge>
          )}

          <Badge 
            variant="outline" 
            className={cn(
              "gap-1 text-xs",
              getIntentColor(enhancement.intent)
            )}
          >
            <Brain className="h-3 w-3" />
            {getIntentLabel(enhancement.intent)}
          </Badge>

          {enhancement.legalTerms.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {enhancement.legalTerms.length} terim
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};