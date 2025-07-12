import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  const themes = [
    { value: 'light', label: 'Açık Tema', icon: Sun },
    { value: 'dark', label: 'Koyu Tema', icon: Moon },
    { value: 'system', label: 'Sistem', icon: Monitor },
  ] as const;

  const currentIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const CurrentIcon = currentIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-9 w-9 rounded-lg hover:bg-muted transition-colors"
          aria-label="Tema değiştir"
        >
          <CurrentIcon className="h-4 w-4 transition-transform duration-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-card border border-border shadow-lg"
      >
        {themes.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="flex items-center gap-2 cursor-pointer hover:bg-muted transition-colors"
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm">{label}</span>
            {theme === value && (
              <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}