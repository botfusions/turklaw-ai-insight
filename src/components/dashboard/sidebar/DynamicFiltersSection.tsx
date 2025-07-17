import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Filter, 
  Calendar, 
  Save, 
  ChevronDown, 
  ChevronRight,
  Trash2 
} from "lucide-react";

interface FilterState {
  courtType: string;
  department: string;
  dateRange: string;
  lawField: string;
  decisionType: string;
}

interface DynamicFiltersSectionProps {
  onFiltersChange?: (filters: FilterState) => void;
}

export function DynamicFiltersSection({ onFiltersChange }: DynamicFiltersSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    courtType: '',
    department: '',
    dateRange: '',
    lawField: '',
    decisionType: ''
  });

  // Mock saved filters
  const savedFilters = [
    { id: '1', name: 'Yargıtay Ceza', count: 3 },
    { id: '2', name: 'Son 1 Yıl', count: 2 },
  ];

  const courtTypes = [
    { value: 'yargitay', label: 'Yargıtay' },
    { value: 'danistay', label: 'Danıştay' },
    { value: 'bolge', label: 'Bölge Adliye' },
    { value: 'asliye', label: 'Asliye Mahkemesi' },
    { value: 'idare', label: 'İdare Mahkemesi' }
  ];

  const departments = [
    { value: '1', label: '1. Daire' },
    { value: '2', label: '2. Daire' },
    { value: '3', label: '3. Daire' },
    { value: '4', label: '4. Daire' },
    { value: '5', label: '5. Daire' }
  ];

  const dateRanges = [
    { value: '1m', label: 'Son 1 Ay' },
    { value: '3m', label: 'Son 3 Ay' },
    { value: '6m', label: 'Son 6 Ay' },
    { value: '1y', label: 'Son 1 Yıl' },
    { value: '5y', label: 'Son 5 Yıl' },
    { value: 'all', label: 'Tüm Zamanlar' }
  ];

  const lawFields = [
    { value: 'ceza', label: 'Ceza Hukuku' },
    { value: 'medeni', label: 'Medeni Hukuk' },
    { value: 'idare', label: 'İdare Hukuku' },
    { value: 'is', label: 'İş Hukuku' },
    { value: 'ticaret', label: 'Ticaret Hukuku' }
  ];

  const decisionTypes = [
    { value: 'ilam', label: 'İlam' },
    { value: 'karar', label: 'Karar' },
    { value: 'ara_karar', label: 'Ara Karar' },
    { value: 'ret', label: 'Ret Kararı' }
  ];

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      courtType: '',
      department: '',
      dateRange: '',
      lawField: '',
      decisionType: ''
    };
    setFilters(emptyFilters);
    onFiltersChange?.(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Card>
      <CardHeader className="pb-3">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between w-full cursor-pointer">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Dinamik Filtreler
                {hasActiveFilters && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {Object.values(filters).filter(v => v).length}
                  </Badge>
                )}
              </CardTitle>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
        </Collapsible>
      </CardHeader>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Filter Controls */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Mahkeme Türü
                </label>
                <Select 
                  value={filters.courtType} 
                  onValueChange={(value) => updateFilter('courtType', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {courtTypes.map((court) => (
                      <SelectItem key={court.value} value={court.value}>
                        {court.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Daire
                </label>
                <Select 
                  value={filters.department} 
                  onValueChange={(value) => updateFilter('department', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Tarih Aralığı
                </label>
                <Select 
                  value={filters.dateRange} 
                  onValueChange={(value) => updateFilter('dateRange', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Hukuk Dalı
                </label>
                <Select 
                  value={filters.lawField} 
                  onValueChange={(value) => updateFilter('lawField', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {lawFields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Karar Türü
                </label>
                <Select 
                  value={filters.decisionType} 
                  onValueChange={(value) => updateFilter('decisionType', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {decisionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter Actions */}
            {hasActiveFilters && (
              <div className="flex gap-2 pt-2 border-t">
                <Button size="sm" variant="outline" className="flex-1">
                  <Save className="h-3 w-3 mr-1" />
                  Kaydet
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={clearFilters}
                  className="flex-1"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Temizle
                </Button>
              </div>
            )}

            {/* Saved Filters */}
            {savedFilters.length > 0 && (
              <div className="pt-2 border-t">
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Kayıtlı Filtreler
                </label>
                <div className="space-y-1">
                  {savedFilters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-xs h-7"
                    >
                      <span>{filter.name}</span>
                      <Badge variant="outline" className="h-4 px-1 text-xs">
                        {filter.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}