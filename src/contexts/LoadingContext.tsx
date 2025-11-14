"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
  useEffect,
  useMemo,
} from "react";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

// Default: NOT loading (safer if provider absent)
const defaultContextValue: LoadingContextType = {
  isLoading: false,
  setLoading: () => {},
  startLoading: () => {},
  stopLoading: () => {},
};

const LoadingContext = createContext<LoadingContextType>(defaultContextValue);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false); // start false (safer)
  const loadingCountRef = useRef<number>(0);

  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debug helper (remove or toggle in production)
  const debug = false;
  const debugLog = useCallback((...args: unknown[]) => {
    if (debug) console.log("[LoadingProvider]", ...args);
  }, [debug]);

  useEffect(() => {
    // global safety: force-hide after 20s if something goes wrong
    if (!isLoading) {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
      return;
    }
    // start safety timer
    safetyTimeoutRef.current = setTimeout(() => {
      console.warn("[LoadingProvider] safety timeout — forcing hide");
      loadingCountRef.current = 0;
      setIsLoading(false);
      safetyTimeoutRef.current = null;
    }, 20000); // 20s
    return () => {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
    };
  }, [isLoading]);

  const startLoading = useCallback(() => {
    console.log('[Loader] startLoading — current count:', loadingCountRef.current);
    
    // cancel any pending hide
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    loadingCountRef.current = loadingCountRef.current + 1;
    console.log('[Loader] startLoading — new count:', loadingCountRef.current);
    debugLog("startLoading -> count:", loadingCountRef.current);
    if (loadingCountRef.current === 1) {
      console.log('[Loader] startLoading — setting isLoading to true');
      setIsLoading(true);
    }
  }, [debugLog]);

  const stopLoading = useCallback(() => {
    console.log('[Loader] stopLoading — current count:', loadingCountRef.current);
    
    // decrement safely
    loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
    console.log('[Loader] stopLoading — new count:', loadingCountRef.current);
    debugLog("stopLoading -> count:", loadingCountRef.current);

    if (loadingCountRef.current === 0) {
      console.log('[Loader] stopLoading — count reached 0, scheduling hide');
      // small delay for smooth transition
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        console.log('[Loader] stopLoading — hiding loader now');
        setIsLoading(false);
        hideTimeoutRef.current = null;
      }, 250);
    }
  }, [debugLog]);

  const setLoading = useCallback(
    (loading: boolean) => {
      if (loading) startLoading();
      else stopLoading();
    },
    [startLoading, stopLoading]
  );

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      loadingCountRef.current = 0;
    };
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      setLoading,
      startLoading,
      stopLoading,
    }),
    [isLoading, setLoading, startLoading, stopLoading]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  return useContext(LoadingContext);
}
