
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Trash2, Star } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface FilterOptions {
  court: string;
  department: string;
  dateRange: any;
  caseType: string[];
  keywords: string;
  relevanceThreshold: number;
}

interface SavedFilter {
  id: string;
  name: string;
  filters: FilterOptions;
  createdAt: string;
  isFavorite?: boolean;
}

interface SavedFiltersProps {
  currentFilters: FilterOptions;
  onLoadFilters: (filters: FilterOptions) => void;
}

export function SavedFilters({ currentFilters, onLoadFilters }: SavedFiltersProps) {
  const [savedFilters, setSavedFilters] = useLocalStorage<SavedFilter[]>('saved-filters', []);
  const [filterName, setFilterName] = useState('');
  const [isNaming, setIsNaming] = useState(false);

  const saveCurrentFilters = () => {
    if (!filterName.trim()) return;

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName.trim(),
      filters: currentFilters,
      createdAt: new Date().toISOString(),
    };

    setSavedFilters([...savedFilters, newFilter]);
    setFilterName('');
    setIsNaming(false);
  };

  const loadFilter = (filter: SavedFilter) => {
    onLoadFilters(filter.filters);
  };

  const deleteFilter = (filterId: string) => {
    setSavedFilters(savedFilters.filter(f => f.id !== filterId));
  };

  const toggleFavorite = (filterId: string) => {
    setSavedFilters(savedFilters.map(f => 
      f.id === filterId ? { ...f, isFavorite: !f.isFavorite } : f
    ));
  };

  const hasActiveFilters = Object.values(currentFilters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
    return false;
  });

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Kaydedilmiş Filtreler</Label>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNaming(true)}
            className="text-xs"
            disabled={isNaming}
          >
            <Save className="h-3 w-3 mr-1" />
            Kaydet
          </Button>
        )}
      </div>

      {isNaming && (
        <div className="flex gap-2">
          <Input
            placeholder="Filtre adı..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveCurrentFilters();
              if (e.key === 'Escape') {
                setIsNaming(false);
                setFilterName('');
              }
            }}
            autoFocus
          />
          <Button size="sm" onClick={saveCurrentFilters} disabled={!filterName.trim()}>
            Kaydet
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => {
              setIsNaming(false);
              setFilterName('');
            }}
          >
            İptal
          </Button>
        </div>
      )}

      {savedFilters.length > 0 && (
        <div className="space-y-2">
          {savedFilters
            .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0))
            .map((filter) => (
            <div
              key={filter.id}
              className="flex items-center justify-between p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {filter.isFavorite && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                  <button
                    onClick={() => loadFilter(filter)}
                    className="text-sm font-medium text-left hover:text-primary transition-colors"
                  >
                    {filter.name}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(filter.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleFavorite(filter.id)}
                >
                  <Star className={`h-3 w-3 ${filter.isFavorite ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:text-destructive"
                  onClick={() => deleteFilter(filter.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {savedFilters.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Henüz kaydedilmiş filtre yok
        </p>
      )}
    </div>
  );
}
