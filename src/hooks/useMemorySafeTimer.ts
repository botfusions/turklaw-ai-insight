
import { useCallback, useEffect, useRef } from 'react';

export interface TimerHandle {
  clear: () => void;
  isActive: () => boolean;
  restart: (newDelay?: number) => void;
}

export const useMemorySafeTimer = () => {
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Clear all timers and intervals on unmount
  useEffect(() => {
    return () => {
      console.log('MemorySafeTimer: Cleaning up all timers and intervals');
      
      // Clear all timeouts
      timersRef.current.forEach((timer, id) => {
        clearTimeout(timer);
        console.log(`MemorySafeTimer: Cleared timeout ${id}`);
      });
      timersRef.current.clear();

      // Clear all intervals
      intervalsRef.current.forEach((interval, id) => {
        clearInterval(interval);
        console.log(`MemorySafeTimer: Cleared interval ${id}`);
      });
      intervalsRef.current.clear();
    };
  }, []);

  const createTimeout = useCallback((
    callback: () => void,
    delay: number,
    id?: string
  ): TimerHandle => {
    const timerId = id || `timeout_${Date.now()}_${Math.random()}`;
    
    // Clear existing timer with same ID
    if (timersRef.current.has(timerId)) {
      clearTimeout(timersRef.current.get(timerId)!);
    }

    const timer = setTimeout(() => {
      // Auto-cleanup after execution
      timersRef.current.delete(timerId);
      callback();
    }, delay);

    timersRef.current.set(timerId, timer);
    
    console.log(`MemorySafeTimer: Created timeout ${timerId} with ${delay}ms delay`);

    return {
      clear: () => {
        if (timersRef.current.has(timerId)) {
          clearTimeout(timersRef.current.get(timerId)!);
          timersRef.current.delete(timerId);
          console.log(`MemorySafeTimer: Manually cleared timeout ${timerId}`);
        }
      },
      isActive: () => timersRef.current.has(timerId),
      restart: (newDelay?: number) => {
        if (timersRef.current.has(timerId)) {
          clearTimeout(timersRef.current.get(timerId)!);
        }
        const timer = setTimeout(() => {
          timersRef.current.delete(timerId);
          callback();
        }, newDelay ?? delay);
        timersRef.current.set(timerId, timer);
      }
    };
  }, []);

  const createInterval = useCallback((
    callback: () => void,
    delay: number,
    id?: string
  ): TimerHandle => {
    const intervalId = id || `interval_${Date.now()}_${Math.random()}`;
    
    // Clear existing interval with same ID
    if (intervalsRef.current.has(intervalId)) {
      clearInterval(intervalsRef.current.get(intervalId)!);
    }

    const interval = setInterval(callback, delay);
    intervalsRef.current.set(intervalId, interval);
    
    console.log(`MemorySafeTimer: Created interval ${intervalId} with ${delay}ms delay`);

    return {
      clear: () => {
        if (intervalsRef.current.has(intervalId)) {
          clearInterval(intervalsRef.current.get(intervalId)!);
          intervalsRef.current.delete(intervalId);
          console.log(`MemorySafeTimer: Manually cleared interval ${intervalId}`);
        }
      },
      isActive: () => intervalsRef.current.has(intervalId),
      restart: (newDelay?: number) => {
        if (intervalsRef.current.has(intervalId)) {
          clearInterval(intervalsRef.current.get(intervalId)!);
        }
        const interval = setInterval(callback, newDelay ?? delay);
        intervalsRef.current.set(intervalId, interval);
      }
    };
  }, []);

  const clearAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    
    intervalsRef.current.forEach((interval) => clearInterval(interval));
    intervalsRef.current.clear();
    
    console.log('MemorySafeTimer: Manually cleared all timers and intervals');
  }, []);

  const getActiveCount = useCallback(() => ({
    timeouts: timersRef.current.size,
    intervals: intervalsRef.current.size,
    total: timersRef.current.size + intervalsRef.current.size
  }), []);

  return {
    createTimeout,
    createInterval,
    clearAll,
    getActiveCount
  };
};
