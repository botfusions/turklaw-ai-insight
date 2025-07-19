
import { useCallback, useEffect, useRef } from 'react';

export interface RequestHandle {
  cancel: () => void;
  isCanceled: () => boolean;
  promise: Promise<any>;
}

export const useMemorySafeRequest = () => {
  const requestsRef = useRef<Map<string, AbortController>>(new Map());
  const pendingPromisesRef = useRef<Set<Promise<any>>>(new Set());
  const isDev = import.meta.env.DEV;

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      if (isDev) console.log('MemorySafeRequest: Aborting all pending requests');
      
      // Abort all requests
      requestsRef.current.forEach((controller, id) => {
        if (!controller.signal.aborted) {
          controller.abort();
          if (isDev) console.log(`MemorySafeRequest: Aborted request ${id}`);
        }
      });
      requestsRef.current.clear();
      
      // Clear pending promises
      pendingPromisesRef.current.clear();
    };
  }, [isDev]);

  const createRequest = useCallback(<T>(
    requestFn: (signal: AbortSignal) => Promise<T>,
    id?: string
  ): RequestHandle => {
    const requestId = id || `request_${Date.now()}_${Math.random()}`;
    
    // Cancel existing request with same ID
    if (requestsRef.current.has(requestId)) {
      requestsRef.current.get(requestId)?.abort();
    }

    const controller = new AbortController();
    requestsRef.current.set(requestId, controller);

    const promise = requestFn(controller.signal)
      .finally(() => {
        // Auto-cleanup after completion
        requestsRef.current.delete(requestId);
        pendingPromisesRef.current.delete(promise);
        if (isDev) console.log(`MemorySafeRequest: Completed request ${requestId}`);
      });

    pendingPromisesRef.current.add(promise);
    
    if (isDev) console.log(`MemorySafeRequest: Created request ${requestId}`);

    return {
      cancel: () => {
        if (requestsRef.current.has(requestId)) {
          requestsRef.current.get(requestId)?.abort();
          requestsRef.current.delete(requestId);
          if (isDev) console.log(`MemorySafeRequest: Manually canceled request ${requestId}`);
        }
      },
      isCanceled: () => controller.signal.aborted,
      promise
    };
  }, [isDev]);

  const cancelAll = useCallback(() => {
    requestsRef.current.forEach((controller) => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    });
    requestsRef.current.clear();
    pendingPromisesRef.current.clear();
    if (isDev) console.log('MemorySafeRequest: Manually canceled all requests');
  }, [isDev]);

  const getActiveCount = useCallback(() => ({
    requests: requestsRef.current.size,
    promises: pendingPromisesRef.current.size
  }), []);

  return {
    createRequest,
    cancelAll,
    getActiveCount
  };
};
