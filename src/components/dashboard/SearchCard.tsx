import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  Mic, 
  X, 
  ChevronDown, 
  Calendar as CalendarIcon,
  Filter,
  Sparkles,
  History,
  Bookmark,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface SearchCardProps {
  onSearch: (query: string, filters: { 
    court?: string; 
    department?: string; 
    dateRange?: string;
    legalField?: string;
    documentType?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) => void;
}

const PLACEHOLDERS = [
  "Örn: 'tazminat davası' için arama yapın...",
  "Mahkeme kararı numara ile arama...",
  "Hukuki terim veya kavram arayın...",
  "Emsal karar araması yapın..."
];

const LEGAL_FIELDS = [
  { value: "ceza", label: "Ceza Hukuku" },
  { value: "medeni", label: "Medeni Hukuk" },
  { value: "idari", label: "İdari Hukuk" },
  { value: "ticaret", label: "Ticaret Hukuku" },
  { value: "is", label: "İş Hukuku" },
  { value: "icra", label: "İcra İflas" },
  { value: "aile", label: "Aile Hukuku" },
  { value: "vergi", label: "Vergi Hukuku" }
];

const DOCUMENT_TYPES = [
  { value: "karar", label: "Karar" },
  { value: "ilam", label: "İlam" },
  { value: "ara-karar", label: "Ara Karar" },
  { value: "temyiz", label: "Temyiz Kararı" },
  { value: "birlestime", label: "Birleştirme Kararı" }
];

const QUICK_SUGGESTIONS = [
  "Tazminat hesabı",
  "İş kazası sorumluluğu", 
  "Kira artışı oranları",
  "Nafaka hesaplama",
  "İhale iptali",
  "Patent ihlali"
];

const RECENT_SEARCHES = [
  "Yargıtay 11. Daire tazminat",
  "İdari mahkeme iptal davası",
  "İş mahkemesi işçi tazminat",
  "Danıştay kamu ihale"
];

export function SearchCard({ onSearch }: SearchCardProps) {
  const [query, setQuery] = useState("");
  const [court, setCourt] = useState("");
  const [department, setDepartment] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [legalField, setLegalField] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Rotate placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Generate suggestions based on query
  useEffect(() => {
    if (query.length > 2) {
      const filtered = QUICK_SUGGESTIONS.filter(s => 
        s.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  // Track active filters
  useEffect(() => {
    const filters = [];
    if (court) filters.push(`Mahkeme: ${court}`);
    if (department) filters.push(`Daire: ${department}`);
    if (legalField) filters.push(`Dal: ${LEGAL_FIELDS.find(f => f.value === legalField)?.label}`);
    if (documentType) filters.push(`Tür: ${DOCUMENT_TYPES.find(d => d.value === documentType)?.label}`);
    if (dateFrom) filters.push(`Başlangıç: ${format(dateFrom, "dd.MM.yyyy")}`);
    if (dateTo) filters.push(`Bitiş: ${format(dateTo, "dd.MM.yyyy")}`);
    if (dateRange) filters.push(`Tarih: ${dateRange}`);
    setActiveFilters(filters);
  }, [court, department, legalField, documentType, dateFrom, dateTo, dateRange]);

  const handleSearch = () => {
    onSearch(query, { 
      court, 
      department, 
      dateRange, 
      legalField, 
      documentType,
      dateFrom,
      dateTo
    });
  };

  const clearFilters = () => {
    setCourt("");
    setDepartment("");
    setDateRange("");
    setLegalField("");
    setDocumentType("");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleRecentSearchClick = (recentSearch: string) => {
    setQuery(recentSearch);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent mb-4">
          Hukuk Araştırma Sistemi
        </h1>
        <p className="text-lg text-muted-foreground">
          Türkiye'nin en kapsamlı hukuki veritabanında arama yapın
        </p>
      </div>

      {/* Main Search Card */}
      <Card className="backdrop-blur-sm bg-background/95 border border-border/50 shadow-xl">
        <CardHeader className="pb-4">
          <div className="space-y-6">
            {/* Enhanced Search Input */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={PLACEHOLDERS[placeholderIndex]}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-16 text-lg pl-14 pr-20 border-2 focus:border-primary transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  {query && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuery("")}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
                  <CardContent className="p-2">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Sparkles className="h-4 w-4 mr-2 text-primary" />
                        {suggestion}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Quick Access Pills */}
            <div className="space-y-4">
              {/* Recent Searches */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Son Aramalar</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {RECENT_SEARCHES.map((search, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Quick Suggestions */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Popüler Aramalar</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.slice(0, 4).map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Advanced Filters */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Gelişmiş Filtreler
                  {activeFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFilters.length}
                    </Badge>
                  )}
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", filtersOpen && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-6 mt-6">
              {/* Active Filters Display */}
              {activeFilters.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Aktif Filtreler:</span>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Tümünü Temizle
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter, index) => (
                      <Badge key={index} variant="secondary">
                        {filter}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Court Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mahkeme</label>
                  <Select value={court} onValueChange={setCourt}>
                    <SelectTrigger>
                      <SelectValue placeholder="Mahkeme seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yargitay">Yargıtay</SelectItem>
                      <SelectItem value="danistay">Danıştay</SelectItem>
                      <SelectItem value="bolge">Bölge Adliye Mahkemesi</SelectItem>
                      <SelectItem value="asliye">Asliye Mahkemesi</SelectItem>
                      <SelectItem value="idare">İdare Mahkemesi</SelectItem>
                      <SelectItem value="is">İş Mahkemesi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Department Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Daire</label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Daire seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 15 }, (_, i) => (
                        <SelectItem key={i + 1} value={`${i + 1}`}>
                          {i + 1}. Daire
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Legal Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hukuk Dalı</label>
                  <Select value={legalField} onValueChange={setLegalField}>
                    <SelectTrigger>
                      <SelectValue placeholder="Hukuk dalı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEGAL_FIELDS.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Document Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Belge Türü</label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Belge türü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date From */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Başlangıç Tarihi</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "dd.MM.yyyy", { locale: tr }) : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        locale={tr}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Date To */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bitiş Tarihi</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "dd.MM.yyyy", { locale: tr }) : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        locale={tr}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Quick Date Ranges */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Hızlı Tarih Seçimi</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={dateRange === "1m" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateRange("1m")}
                  >
                    Son 1 Ay
                  </Button>
                  <Button
                    variant={dateRange === "3m" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateRange("3m")}
                  >
                    Son 3 Ay
                  </Button>
                  <Button
                    variant={dateRange === "1y" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateRange("1y")}
                  >
                    Son 1 Yıl
                  </Button>
                  <Button
                    variant={dateRange === "5y" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateRange("5y")}
                  >
                    Son 5 Yıl
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Search Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button 
              onClick={handleSearch}
              size="lg"
              className="px-12 py-3 text-lg font-semibold bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Search className="mr-2 h-5 w-5" />
              Arama Yap
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}