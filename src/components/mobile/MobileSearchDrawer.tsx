
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BottomSheet } from './BottomSheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Mic, 
  Filter, 
  History, 
  Star, 
  Clock,
  X,
  MicIcon
} from 'lucide-react';

interface MobileSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string, filters?: any) => void;
}

const QUICK_SEARCHES = [
  "İcra takibi",
  "Kira sözleşmesi", 
  "İş hukuku",
  "Boşanma davası",
  "Miras hukuku",
  "Tazminat hesabı"
];

const RECENT_SEARCHES = [
  { query: "Yargıtay 11. Daire tazminat", timestamp: Date.now() - 3600000 },
  { query: "İdari mahkeme iptal davası", timestamp: Date.now() - 7200000 },
  { query: "İş mahkemesi işçi tazminat", timestamp: Date.now() - 86400000 }
];

export function MobileSearchDrawer({ isOpen, onClose, onSearch }: MobileSearchDrawerProps) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      onSearch(query.trim());
      onClose();
    }
  }, [query, onSearch, onClose]);

  const handleQuickSearch = useCallback((searchQuery: string) => {
    onSearch(searchQuery);
    onClose();
  }, [onSearch, onClose]);

  const handleVoiceSearch = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'tr-TR';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };
      
      recognition.start();
    }
  }, []);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Az önce';
    if (hours < 24) return `${hours} saat önce`;
    return `${Math.floor(hours / 24)} gün önce`;
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Akıllı Arama"
      snapPoints={[30, 60, 90]}
    >
      <div className="space-y-6">
        {/* Search Input */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hukuki konu, karar numara veya mahkeme ara..."
              className="pl-12 pr-20 h-12 text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceSearch}
                className={`h-8 w-8 p-0 ${isListening ? 'bg-red-100 text-red-600' : ''}`}
              >
                <MicIcon className="h-4 w-4" />
              </Button>
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuery("")}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSearch}
              disabled={!query.trim()}
              className="flex-1 h-11"
            >
              <Search className="h-4 w-4 mr-2" />
              Ara
            </Button>
            <Button variant="outline" size="icon" className="h-11 w-11">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Searches */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Hızlı Aramalar
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {QUICK_SEARCHES.map((search, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleQuickSearch(search)}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Searches */}
        {RECENT_SEARCHES.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                Son Aramalar
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {RECENT_SEARCHES.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => handleQuickSearch(search.query)}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{search.query}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(search.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Voice Search Status */}
        {isListening && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-red-700">
                  Dinleniyor... Lütfen konuşun
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </BottomSheet>
  );
}
