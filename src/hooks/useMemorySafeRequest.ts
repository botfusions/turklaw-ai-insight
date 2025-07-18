
import { useCallback, useEffect, useRef } from 'react';

export interface RequestHandle {
  cancel: () => void;
  isCanceled: () => boolean;
  promise: Promise<any>;
}

export const useMemorySafeRequest = () => {
  const requestsRef = useRef<Map<string, AbortController>>(new Map());
  const pendingPromisesRef = useRef<Set<Promise<any>>>(new Set());

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('MemorySafeRequest: Aborting all pending requests');
      
      // Abort all requests
      requestsRef.current.forEach((controller, id) => {
        if (!controller.signal.aborted) {
          controller.abort();
          console.log(`MemorySafeRequest: Aborted request ${id}`);
        }
      });
      requestsRef.current.clear();
      
      // Clear pending promises
      pendingPromisesRef.current.clear();
    };
  }, []);

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
        console.log(`MemorySafeRequest: Completed request ${requestId}`);
      });

    pendingPromisesRef.current.add(promise);
    
    console.log(`MemorySafeRequest: Created request ${requestId}`);

    return {
      cancel: () => {
        if (requestsRef.current.has(requestId)) {
          requestsRef.current.get(requestId)?.abort();
          requestsRef.current.delete(requestId);
          console.log(`MemorySafeRequest: Manually canceled request ${requestId}`);
        }
      },
      isCanceled: () => controller.signal.aborted,
      promise
    };
  }, []);

  const cancelAll = useCallback(() => {
    requestsRef.current.forEach((controller) => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    });
    requestsRef.current.clear();
    pendingPromisesRef.current.clear();
    console.log('MemorySafeRequest: Manually canceled all requests');
  }, []);

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
