
import { useCallback, useEffect, useRef } from 'react';

export interface EventListenerHandle {
  remove: () => void;
  isActive: () => boolean;
}

export const useMemorySafeEventListener = () => {
  const listenersRef = useRef<Map<string, () => void>>(new Map());
  const isDev = import.meta.env.DEV;

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      if (isDev) console.log('MemorySafeEventListener: Cleaning up all event listeners');
      listenersRef.current.forEach((cleanup, id) => {
        cleanup();
        if (isDev) console.log(`MemorySafeEventListener: Removed listener ${id}`);
      });
      listenersRef.current.clear();
    };
  }, [isDev]);

  const addEventListener = useCallback(<K extends keyof WindowEventMap>(
    target: Window | Document | HTMLElement,
    type: K,
    listener: (event: WindowEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
    id?: string
  ): EventListenerHandle => {
    const listenerId = id || `${type}_${Date.now()}_${Math.random()}`;
    
    // Remove existing listener with same ID
    if (listenersRef.current.has(listenerId)) {
      listenersRef.current.get(listenerId)?.();
    }

    // Add the event listener
    target.addEventListener(type, listener as EventListener, options);
    
    // Store cleanup function
    const cleanup = () => {
      target.removeEventListener(type, listener as EventListener, options);
      listenersRef.current.delete(listenerId);
    };
    
    listenersRef.current.set(listenerId, cleanup);
    
    if (isDev) console.log(`MemorySafeEventListener: Added ${type} listener ${listenerId}`);

    return {
      remove: cleanup,
      isActive: () => listenersRef.current.has(listenerId)
    };
  }, [isDev]);

  const removeAll = useCallback(() => {
    listenersRef.current.forEach((cleanup) => cleanup());
    listenersRef.current.clear();
    if (isDev) console.log('MemorySafeEventListener: Manually removed all listeners');
  }, [isDev]);

  const getActiveCount = useCallback(() => listenersRef.current.size, []);

  return {
    addEventListener,
    removeAll,
    getActiveCount
  };
};
