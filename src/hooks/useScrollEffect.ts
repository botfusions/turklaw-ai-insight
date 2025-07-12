import { useState, useEffect } from 'react';

interface ScrollEffectOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollEffect(options: ScrollEffectOptions = {}) {
  const { threshold = 50 } = options;
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Scroll pozisyonu güncelle
      setScrollY(currentScrollY);
      
      // Eşik değeri kontrolü
      setScrolled(currentScrollY > threshold);
      
      // Scroll yönü kontrolü
      if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      
      lastScrollY = currentScrollY;
    };

    // Throttle scroll event
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    // İlk render'da pozisyonu kontrol et
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [threshold]);

  return {
    scrolled,
    scrollY,
    scrollDirection,
    isAtTop: scrollY === 0,
  };
}