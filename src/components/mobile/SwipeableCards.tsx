
import { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeableCard {
  id: string;
  content: React.ReactNode;
}

interface SwipeableCardsProps {
  cards: SwipeableCard[];
  onSwipe?: (direction: 'left' | 'right', cardId: string) => void;
  className?: string;
}

export function SwipeableCards({ cards, onSwipe, className }: SwipeableCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwipeGestureActive, setIsSwipeGestureActive] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const startX = useRef<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwipeGestureActive(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwipeGestureActive) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX.current;
    setSwipeOffset(diffX);
  }, [isSwipeGestureActive]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwipeGestureActive) return;
    
    const threshold = 100; // minimum swipe distance
    const currentCard = cards[currentIndex];
    
    if (Math.abs(swipeOffset) > threshold) {
      const direction = swipeOffset > 0 ? 'right' : 'left';
      
      if (direction === 'left' && currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        onSwipe?.(direction, currentCard.id);
      } else if (direction === 'right' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        onSwipe?.(direction, currentCard.id);
      }
    }
    
    setIsSwipeGestureActive(false);
    setSwipeOffset(0);
  }, [isSwipeGestureActive, swipeOffset, currentIndex, cards, onSwipe]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      onSwipe?.('right', cards[currentIndex].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      onSwipe?.('left', cards[currentIndex].id);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Gösterilecek kart yok
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      {/* Cards Container */}
      <div className="relative h-64 overflow-hidden rounded-lg">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            ref={index === currentIndex ? cardRef : null}
            className={cn(
              "absolute inset-0 transition-all duration-300 ease-in-out",
              index === currentIndex 
                ? "translate-x-0 opacity-100 z-10" 
                : index < currentIndex
                  ? "-translate-x-full opacity-0 z-0"
                  : "translate-x-full opacity-0 z-0"
            )}
            style={{
              transform: index === currentIndex && isSwipeGestureActive
                ? `translateX(${swipeOffset}px)`
                : undefined
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <CardContent className="p-4 h-full">
              {card.content}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Önceki
        </Button>

        {/* Indicators */}
        <div className="flex gap-2">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentIndex
                  ? "bg-primary"
                  : "bg-muted-foreground/30"
              )}
              aria-label={`Kart ${index + 1}'e git`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="flex items-center gap-1"
        >
          Sonraki
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Card Counter */}
      <div className="text-center mt-2 text-sm text-muted-foreground">
        {currentIndex + 1} / {cards.length}
      </div>
    </div>
  );
}
