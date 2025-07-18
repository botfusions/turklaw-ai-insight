
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { FilterTags } from './FilterTags';
import { SavedFilters } from './SavedFilters';
import { Filter, Search, X, Save } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface FilterOptions {
  court: string;
  department: string;
  dateRange: DateRange | undefined;
  caseType: string[];
  keywords: string;
  relevanceThreshold: number;
}

interface AdvancedFilterPanelProps {
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function AdvancedFilterPanel({ onFiltersChange, isOpen, onToggle }: AdvancedFilterPanelProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    court: '',
    department: '',
    dateRange: undefined,
    caseType: [],
    keywords: '',
    relevanceThreshold: 0.5,
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const courts = [
    'Yargıtay',
    'Danıştay',
    'Anayasa Mahkemesi',
    'Asliye Hukuk Mahkemesi',
    'Asliye Ceza Mahkemesi',
    'İş Mahkemesi',
    'Aile Mahkemesi'
  ];

  const departments = [
    'Hukuk Genel Kurulu',
    '1. Hukuk Dairesi',
    '2. Hukuk Dairesi',
    '3. Hukuk Dairesi',
    'Ceza Genel Kurulu',
    '1. Ceza Dairesi',
    '2. Ceza Dairesi'
  ];

  const caseTypes = [
    'Boşanma',
    'İş Kazası',
    'Tazminat',
    'Sözleşme İhlali',
    'Miras',
    'Kiralama Uyuşmazlığı',
    'İcra Takibi'
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    
    // Update active filters for display
    updateActiveFilters(newFilters);
  };

  const updateActiveFilters = (currentFilters: FilterOptions) => {
    const active: string[] = [];
    
    if (currentFilters.court) active.push(`Mahkeme: ${currentFilters.court}`);
    if (currentFilters.department) active.push(`Daire: ${currentFilters.department}`);
    if (currentFilters.dateRange?.from) active.push('Tarih Aralığı Seçili');
    if (currentFilters.caseType.length > 0) active.push(`Dava Türü: ${currentFilters.caseType.length}`);
    if (currentFilters.keywords) active.push(`Anahtar Kelime: ${currentFilters.keywords}`);
    
    setActiveFilters(active);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterOptions = {
      court: '',
      department: '',
      dateRange: undefined,
      caseType: [],
      keywords: '',
      relevanceThreshold: 0.5,
    };
    setFilters(emptyFilters);
    setActiveFilters([]);
    onFiltersChange(emptyFilters);
  };

  const handleCaseTypeChange = (caseType: string, checked: boolean) => {
    const newCaseTypes = checked
      ? [...filters.caseType, caseType]
      : filters.caseType.filter(type => type !== caseType);
    
    handleFilterChange('caseType', newCaseTypes);
  };

  if (!isOpen) {
    return (
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          onClick={onToggle}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Gelişmiş Filtreler
        </Button>
        <FilterTags filters={activeFilters} onRemove={(filter) => {
          // Handle individual filter removal
          console.log('Remove filter:', filter);
        }} />
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Gelişmiş Filtreler
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-1" />
              Temizle
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Court and Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="court">Mahkeme</Label>
            <Select value={filters.court} onValueChange={(value) => handleFilterChange('court', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Mahkeme seçin" />
              </SelectTrigger>
              <SelectContent>
                {courts.map((court) => (
                  <SelectItem key={court} value={court}>
                    {court}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Daire</Label>
            <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Daire seçin" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Tarih Aralığı</Label>
          <DatePickerWithRange
            date={filters.dateRange}
            onDateChange={(dateRange) => handleFilterChange('dateRange', dateRange)}
          />
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <Label htmlFor="keywords">Anahtar Kelimeler</Label>
          <Input
            id="keywords"
            placeholder="Virgülle ayırarak yazın..."
            value={filters.keywords}
            onChange={(e) => handleFilterChange('keywords', e.target.value)}
          />
        </div>

        {/* Case Types */}
        <div className="space-y-2">
          <Label>Dava Türleri</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {caseTypes.map((caseType) => (
              <div key={caseType} className="flex items-center space-x-2">
                <Checkbox
                  id={caseType}
                  checked={filters.caseType.includes(caseType)}
                  onCheckedChange={(checked) => handleCaseTypeChange(caseType, checked as boolean)}
                />
                <Label htmlFor={caseType} className="text-sm">
                  {caseType}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        <FilterTags filters={activeFilters} onRemove={(filter) => {
          console.log('Remove filter:', filter);
        }} />

        {/* Saved Filters */}
        <SavedFilters 
          currentFilters={filters}
          onLoadFilters={(loadedFilters) => {
            setFilters(loadedFilters);
            onFiltersChange(loadedFilters);
            updateActiveFilters(loadedFilters);
          }}
        />
      </CardContent>
    </Card>
  );
}
