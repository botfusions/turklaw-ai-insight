import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  placeholder?: string;
  loading?: boolean;
  compact?: boolean;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Mevzuat araması yapın...",
  loading = false,
  compact = false,
  className
}: SearchInputProps) => {
  const [localValue, setLocalValue] = useState(value);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (localValue.trim()) {
      onSubmit(localValue.trim());
    }
  };

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const clearInput = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className={cn(
        "relative flex items-center gap-2",
        compact ? "flex-row" : "flex-col sm:flex-row"
      )}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "pl-10 pr-10",
              compact ? "h-9" : "h-10"
            )}
            disabled={loading}
          />
          {localValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={clearInput}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={!localValue.trim() || loading}
          className={cn(
            "shrink-0",
            compact ? "h-9 px-3" : "h-10 px-4",
            compact ? "w-auto" : "w-full sm:w-auto"
          )}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
          ) : (
            "Ara"
          )}
        </Button>
      </div>
    </form>
  );
};