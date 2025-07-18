import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Plus, Mic, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onSearchClick?: () => void;
  onVoiceSearchClick?: () => void;
  onFilterClick?: () => void;
  className?: string;
}

export function FloatingActionButton({ 
  onSearchClick, 
  onVoiceSearchClick, 
  onFilterClick, 
  className 
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      icon: <Search className="h-5 w-5" />,
      label: 'Ara',
      onClick: onSearchClick,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: <Mic className="h-5 w-5" />,
      label: 'Sesli Arama',
      onClick: onVoiceSearchClick,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      icon: <Filter className="h-5 w-5" />,
      label: 'Filtrele',
      onClick: onFilterClick,
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  const handleActionClick = (action: typeof actions[0]) => {
    action.onClick?.();
    setIsExpanded(false);
  };

  return (
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
                <span className="bg-background px-3 py-1 rounded-full text-sm font-medium shadow-lg border">
                  {action.label}
                </span>
                <Button
                  size="icon"
                  onClick={() => handleActionClick(action)}
                  className={cn(
                    "h-12 w-12 rounded-full shadow-lg transition-all duration-200",
                    action.color
                  )}
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
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
          "bg-primary hover:bg-primary/90",
          isExpanded && "rotate-45"
        )}
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
          />
        )}
      </AnimatePresence>
    </div>
  );
}