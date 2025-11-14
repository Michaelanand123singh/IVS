"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLoading } from "@/contexts/LoadingContext";

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
  learnMore?: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

interface PageData {
  hero: HeroData | null;
  services: Service[];
  testimonials: Testimonial[];
}

// Global cache to prevent duplicate requests
const fetchCache = {
  promise: null as Promise<PageData> | null,
  data: null as PageData | null,
  timestamp: 0,
  CACHE_DURATION: 30000, // 30 seconds cache
};

/**
 * Optimized hook that fetches all page data from a single unified endpoint
 * This reduces:
 * - Network round trips: 3 API calls → 1 API call
 * - Loading time: Sequential (T1 + T2 + T3) → Parallel (max(T1, T2, T3))
 * - Server load: Single database connection instead of three
 */
export function usePageDataOptimized(): {
  hero: HeroData | null;
  services: Service[];
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
} {
  const { startLoading, stopLoading } = useLoading();
  const [data, setData] = useState<PageData>({
    hero: null,
    services: [],
    testimonials: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didFetchRef = useRef(false);

  const fetchAllData = useCallback(async (): Promise<PageData> => {
    const now = Date.now();
    
    // Return cached data if available and fresh
    if (fetchCache.data && (now - fetchCache.timestamp) < fetchCache.CACHE_DURATION) {
      console.log('[usePageDataOptimized] Returning cached data');
      return fetchCache.data;
    }

    // If a fetch is already in progress, return that promise (request deduplication)
    if (fetchCache.promise) {
      console.log('[usePageDataOptimized] Reusing existing fetch promise (deduplication)');
      return fetchCache.promise;
    }

    console.log('[usePageDataOptimized] Fetching all data from unified /api/page-data endpoint');
    const startTime = performance.now();

    // Single API call that fetches all data in parallel on the server
    fetchCache.promise = fetch("/api/page-data")
      .then(async (res) => {
        if (!res.ok) throw new Error("Page data API failed");
        const data = await res.json();
        const endTime = performance.now();
        console.log(`[usePageDataOptimized] All data fetched in ${(endTime - startTime).toFixed(2)}ms`);
        return data;
      })
      .then((result) => {
        const pageData: PageData = {
          hero: result.hero || null,
          services: result.services || [],
          testimonials: result.testimonials || [],
        };

        // Cache the result
        fetchCache.data = pageData;
        fetchCache.timestamp = Date.now();
        fetchCache.promise = null;

        return pageData;
      })
      .catch((err) => {
        console.error("[usePageDataOptimized] Fetch error:", err);
        fetchCache.promise = null;
        throw err;
      });

    return fetchCache.promise;
  }, []);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        startLoading();

        const result = await fetchAllData();
        setData(result);
      } catch (err) {
        console.error("[usePageDataOptimized] Error loading page data:", err);
        setError("Failed to load page data");
      } finally {
        setLoading(false);
        stopLoading();
      }
    };

    loadData();
  }, [fetchAllData, startLoading, stopLoading]);

  return {
    hero: data.hero,
    services: data.services,
    testimonials: data.testimonials,
    loading,
    error,
  };
}

