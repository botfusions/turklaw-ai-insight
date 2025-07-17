import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Lightbulb, 
  TrendingUp, 
  BookOpen, 
  Target,
  Sparkles
} from "lucide-react";

interface SmartSuggestionsSectionProps {
  onSuggestionClick?: (suggestion: string, type: string) => void;
}

export function SmartSuggestionsSection({ onSuggestionClick }: SmartSuggestionsSectionProps) {
  // Mock suggestion data - in real app this would come from ML/analytics
  const suggestions = {
    similar: [
      { text: "İcra iflas hukuku", confidence: 95 },
      { text: "Alacak takibi", confidence: 89 },
      { text: "Haciz işlemleri", confidence: 82 }
    ],
    trending: [
      { text: "Dijital vergi kanunu", trend: "+25%" },
      { text: "İş güvencesi mevzuatı", trend: "+18%" },
      { text: "Kira artış oranları", trend: "+12%" }
    ],
    related: [
      { text: "TTK md. 125", type: "mevzuat" },
      { text: "İcra İflas Kanunu", type: "mevzuat" },
      { text: "Yargıtay 15. HD", type: "karar" }
    ],
    personalized: [
      { text: "Ticaret hukuku kararları", reason: "Geçmiş aramalarınıza göre" },
      { text: "Şirketler hukuku", reason: "İlgi alanınıza göre" }
    ]
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          Akıllı Öneriler
        </CardTitle>
      </CardHeader>
      <ScrollArea className="h-64">
        <CardContent className="space-y-4">
          {/* Similar Searches */}
          {suggestions.similar.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Target className="h-3 w-3" />
                Benzer Aramalar
              </div>
              <div className="space-y-1">
                {suggestions.similar.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs h-7 px-2"
                    onClick={() => onSuggestionClick?.(item.text, 'similar')}
                  >
                    <span className="truncate">{item.text}</span>
                    <Badge variant="secondary" className="h-4 px-1 text-xs">
                      {item.confidence}%
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Topics */}
          {suggestions.trending.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                Popüler Konular
              </div>
              <div className="space-y-1">
                {suggestions.trending.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs h-7 px-2"
                    onClick={() => onSuggestionClick?.(item.text, 'trending')}
                  >
                    <span className="truncate">{item.text}</span>
                    <Badge variant="outline" className="h-4 px-1 text-xs text-green-600 border-green-200">
                      {item.trend}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Related Legislation */}
          {suggestions.related.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                İlgili Mevzuat
              </div>
              <div className="space-y-1">
                {suggestions.related.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-xs h-7 px-2"
                    onClick={() => onSuggestionClick?.(item.text, 'related')}
                  >
                    <span className="truncate">{item.text}</span>
                    <Badge 
                      variant="outline" 
                      className={`h-4 px-1 text-xs ${
                        item.type === 'mevzuat' ? 'text-blue-600 border-blue-200' : 'text-purple-600 border-purple-200'
                      }`}
                    >
                      {item.type}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Personalized Suggestions */}
          {suggestions.personalized.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                Size Özel
              </div>
              <div className="space-y-1">
                {suggestions.personalized.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-7 px-2"
                      onClick={() => onSuggestionClick?.(item.text, 'personalized')}
                    >
                      <span className="truncate">{item.text}</span>
                    </Button>
                    <p className="text-xs text-muted-foreground px-2 leading-tight">
                      {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}