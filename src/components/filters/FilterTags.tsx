
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterTagsProps {
  filters: string[];
  onRemove: (filter: string) => void;
}

export function FilterTags({ filters, onRemove }: FilterTagsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Aktif Filtreler:</span>
      {filters.map((filter, index) => (
        <Badge key={index} variant="secondary" className="gap-1">
          {filter}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs hover:bg-transparent"
            onClick={() => onRemove(filter)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  );
}
