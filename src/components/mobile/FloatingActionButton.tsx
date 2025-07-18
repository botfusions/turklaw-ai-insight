
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Plus, Mic, Filter, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MobileSearchDrawer } from './MobileSearchDrawer';
import { useKeyboardShortcuts } from '../accessibility/KeyboardNavigation';

interface FloatingActionButtonProps {
  onSearchClick?: () => void;
  onVoiceSearchClick?: () => void;
  onFilterClick?: () => void;
  onSearch?: (query: string, filters?: any) => void;
  className?: string;
}

export function FloatingActionButton({ 
  onSearchClick, 
  onVoiceSearchClick, 
  onFilterClick,
  onSearch,
  className 
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSearchDrawer, setShowSearchDrawer] = useState(false);

  const actions = [
    {
      icon: <Search className="h-5 w-5" />,
      label: 'Akıllı Arama',
      onClick: () => setShowSearchDrawer(true),
      color: 'bg-blue-600 hover:bg-blue-700',
      shortcut: 'ctrl+k'
    },
    {
      icon: <Mic className="h-5 w-5" />,
      label: 'Sesli Arama',
      onClick: onVoiceSearchClick,
      color: 'bg-green-600 hover:bg-green-700',
      shortcut: 'ctrl+shift+v'
    },
    {
      icon: <Filter className="h-5 w-5" />,
      label: 'Filtreler',
      onClick: onFilterClick,
      color: 'bg-purple-600 hover:bg-purple-700',
      shortcut: 'ctrl+f'
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'Ayarlar',
      onClick: () => console.log('Settings clicked'),
      color: 'bg-gray-600 hover:bg-gray-700',
      shortcut: 'ctrl+,'
    }
  ];

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+k': () => setShowSearchDrawer(true),
    'ctrl+shift+v': () => onVoiceSearchClick?.(),
    'ctrl+f': () => onFilterClick?.(),
    'escape': () => setIsExpanded(false)
  });

  const handleActionClick = (action: typeof actions[0]) => {
    action.onClick?.();
    setIsExpanded(false);
  };

  return (
    <>
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-3 mb-3"
            >
              {actions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-background px-3 py-2 rounded-full text-sm font-medium shadow-lg border">
                    <div className="flex items-center gap-2">
                      <span>{action.label}</span>
                      <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">
                        {action.shortcut}
                      </kbd>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    onClick={() => handleActionClick(action)}
                    className={cn(
                      "h-12 w-12 rounded-full shadow-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2",
                      action.color
                    )}
                    aria-label={`${action.label} (${action.shortcut})`}
                  >
                    {action.icon}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <Button
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all duration-300 focus:ring-2 focus:ring-offset-2",
            "bg-primary hover:bg-primary/90",
            isExpanded && "rotate-45"
          )}
          aria-label={isExpanded ? "Menüyü kapat" : "Hızlı eylem menüsünü aç"}
          aria-expanded={isExpanded}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </motion.div>
        </Button>

        {/* Backdrop */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/20 -z-10"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Search Drawer */}
      <MobileSearchDrawer
        isOpen={showSearchDrawer}
        onClose={() => setShowSearchDrawer(false)}
        onSearch={onSearch || ((query) => console.log('Search:', query))}
      />
    </>
  );
}
