"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useLoading } from "./LoadingContext";

interface HeroData {
  headings: Array<{
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    isActive: boolean;
    displayOrder: number;
  }>;
  backgroundImages: string[];
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  items?: string[];
  learnMore?: {
    detailedDescription: string;
    features: string[];
    benefits: string[];
    useCases: string[];
  };
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

interface PageDataContextType {
  hero: HeroData | null;
  services: Service[];
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
}

const defaultContextValue: PageDataContextType = {
  hero: null,
  services: [],
  testimonials: [],
  loading: true,
  error: null,
};

const PageDataContext = createContext<PageDataContextType>(defaultContextValue);

interface PageDataResponse {
  hero: HeroData | null;
  services: Service[];
  testimonials: Testimonial[];
}

// Global cache to prevent duplicate requests
const fetchCache = {
  promise: null as Promise<PageDataResponse> | null,
  data: null as PageDataResponse | null,
  timestamp: 0,
  CACHE_DURATION: 30000, // 30 seconds
};

export function PageDataProvider({ children }: { children: ReactNode }) {
  const { startLoading, stopLoading } = useLoading();
  const [data, setData] = useState<PageDataContextType>(defaultContextValue);
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    const loadData = async () => {
      const now = Date.now();
      
      // Return cached data if available and fresh
      if (fetchCache.data && (now - fetchCache.timestamp) < fetchCache.CACHE_DURATION) {
        console.log('[PageDataProvider] Using cached data');
        setData({
          hero: fetchCache.data.hero || null,
          services: fetchCache.data.services || [],
          testimonials: fetchCache.data.testimonials || [],
          loading: false,
          error: null,
        });
        return;
      }

      // If a fetch is already in progress, wait for it
      if (fetchCache.promise) {
        console.log('[PageDataProvider] Waiting for existing fetch');
        try {
          const result = await fetchCache.promise;
          setData({
            hero: result.hero || null,
            services: result.services || [],
            testimonials: result.testimonials || [],
            loading: false,
            error: null,
          });
        } catch {
          setData(prev => ({ ...prev, loading: false, error: "Failed to load data" }));
        }
        return;
      }

      try {
        setData(prev => ({ ...prev, loading: true }));
        startLoading();

        console.log('[PageDataProvider] Fetching all data from unified /api/page-data endpoint');
        const startTime = performance.now();

        // Single API call that fetches all data in parallel on the server
        fetchCache.promise = fetch("/api/page-data")
          .then(async (res) => {
            if (!res.ok) throw new Error("Page data API failed");
            return res.json();
          })
          .then((result) => {
            const endTime = performance.now();
            console.log(`[PageDataProvider] All data fetched in ${(endTime - startTime).toFixed(2)}ms`);

            // Cache the result
            fetchCache.data = result;
            fetchCache.timestamp = Date.now();
            fetchCache.promise = null;

            return result;
          })
          .catch((err) => {
            console.error("[PageDataProvider] Fetch error:", err);
            fetchCache.promise = null;
            throw err;
          });

        const result = await fetchCache.promise;
        setData({
          hero: result.hero || null,
          services: result.services || [],
          testimonials: result.testimonials || [],
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("[PageDataProvider] Error loading page data:", err);
        setData(prev => ({ ...prev, loading: false, error: "Failed to load page data" }));
      } finally {
        stopLoading();
      }
    };

    loadData();
  }, [startLoading, stopLoading]);

  return (
    <PageDataContext.Provider value={data}>
      {children}
    </PageDataContext.Provider>
  );
}

export function usePageData() {
  return useContext(PageDataContext);
}

