import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  snapPoints?: number[]; // Array of heights as percentages [20, 50, 90]
  className?: string;
}

export function BottomSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  snapPoints = [20, 50, 90],
  className 
}: BottomSheetProps) {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(1); // Start at middle snap point
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    const velocity = info.velocity.y;
    const offset = info.offset.y;
    
    // If dragging down with significant velocity or offset, close or snap to lower point
    if (velocity > 500 || offset > 100) {
      if (currentSnapPoint === 0) {
        onClose();
      } else {
        setCurrentSnapPoint(Math.max(0, currentSnapPoint - 1));
      }
    }
    // If dragging up with significant velocity or offset, snap to higher point
    else if (velocity < -500 || offset < -100) {
      setCurrentSnapPoint(Math.min(snapPoints.length - 1, currentSnapPoint + 1));
    }
  };

  const getSheetHeight = () => {
    return `${snapPoints[currentSnapPoint]}vh`;
  };

  const handleSnapPointChange = (index: number) => {
    setCurrentSnapPoint(index);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            style={{ height: getSheetHeight() }}
            className={cn(
              "fixed bottom-0 left-0 right-0 bg-background border-t rounded-t-3xl z-50 overflow-hidden",
              "shadow-2xl",
              className
            )}
          >
            {/* Drag Handle */}
            <div className="flex justify-center py-3 bg-background/95 backdrop-blur-sm border-b">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm">
              <h2 className="text-lg font-semibold">{title}</h2>
              <div className="flex items-center gap-2">
                {/* Snap point indicators */}
                <div className="flex gap-1">
                  {snapPoints.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleSnapPointChange(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        index === currentSnapPoint 
                          ? "bg-primary" 
                          : "bg-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {children}
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center gap-2 p-2 bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentSnapPoint(0)}
                className="flex items-center gap-1"
              >
                <Minus className="h-3 w-3" />
                Küçült
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentSnapPoint(snapPoints.length - 1)}
                className="flex items-center gap-1"
              >
                Büyüt
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}