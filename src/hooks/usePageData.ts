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

interface PageData {
  hero: HeroData | null;
  services: Service[];
  testimonials: Testimonial[];
}

interface UsePageDataReturn {
  hero: HeroData | null;
  services: Service[];
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Global cache to prevent duplicate requests
const fetchCache = {
  promise: null as Promise<PageData> | null,
  data: null as PageData | null,
  timestamp: 0,
  CACHE_DURATION: 30000, // 30 seconds cache
};

/**
 * Optimized hook that fetches all page data in parallel
 * Reduces loading time from sequential (T1 + T2 + T3) to parallel (max(T1, T2, T3))
 */
export function usePageData(): UsePageDataReturn {
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
      console.log('[usePageData] Returning cached data');
      return fetchCache.data;
    }

    // If a fetch is already in progress, return that promise
    if (fetchCache.promise) {
      console.log('[usePageData] Reusing existing fetch promise');
      return fetchCache.promise;
    }

    console.log('[usePageData] Starting parallel fetch of all APIs');
    const startTime = performance.now();

    // Fetch all three APIs in parallel using Promise.all
    // This reduces total time from sequential (T1 + T2 + T3) to parallel (max(T1, T2, T3))
    fetchCache.promise = Promise.all([
      fetch("/api/hero")
        .then((res) => {
          if (!res.ok) throw new Error("Hero API failed");
          return res.json();
        })
        .then((data) => {
          console.log('[usePageData] Hero data received');
          return data.hero || null;
        })
        .catch((err) => {
          console.error("[usePageData] Hero fetch error:", err);
          return null; // Return null on error, will use fallback
        }),

      fetch("/api/services")
        .then((res) => {
          if (!res.ok) throw new Error("Services API failed");
          return res.json();
        })
        .then((data) => {
          console.log('[usePageData] Services data received, count:', data.services?.length || 0);
          return data.services || [];
        })
        .catch((err) => {
          console.error("[usePageData] Services fetch error:", err);
          return []; // Return empty array on error
        }),

      fetch("/api/testimonials")
        .then((res) => {
          if (!res.ok) throw new Error("Testimonials API failed");
          return res.json();
        })
        .then((data) => {
          console.log('[usePageData] Testimonials data received, count:', data.testimonials?.length || 0);
          return data.testimonials || [];
        })
        .catch((err) => {
          console.error("[usePageData] Testimonials fetch error:", err);
          return []; // Return empty array on error
        }),
    ]).then(([hero, services, testimonials]) => {
      const endTime = performance.now();
      console.log(`[usePageData] All data fetched in parallel in ${(endTime - startTime).toFixed(2)}ms`);

      const result: PageData = {
        hero: hero as HeroData | null,
        services: services as Service[],
        testimonials: testimonials as Testimonial[],
      };

      // Cache the result
      fetchCache.data = result;
      fetchCache.timestamp = Date.now();
      fetchCache.promise = null;

      return result;
    }).catch((err) => {
      console.error("[usePageData] Parallel fetch failed:", err);
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
        console.error("[usePageData] Error loading page data:", err);
        setError("Failed to load page data");
        
        // Fallback to static data
        try {
          const [servicesModule, testimonialsModule] = await Promise.all([
            import("@/data/services").catch(() => null),
            import("@/data/testimonials").catch(() => null),
          ]);

          // Transform static services to add id property (required by Service interface)
          const staticServices = (servicesModule?.services || []).map((service, index) => ({
            ...service,
            id: `static-service-${index}`,
          }));

          setData({
            hero: null, // Hero will use its own fallback
            services: staticServices,
            testimonials: testimonialsModule?.testimonials || [],
          });
        } catch (fallbackErr) {
          console.error("[usePageData] Fallback data loading failed:", fallbackErr);
        }
      } finally {
        setLoading(false);
        stopLoading();
      }
    };

    loadData();
  }, [fetchAllData, startLoading, stopLoading]);

  const refetch = useCallback(async () => {
    // Clear cache to force fresh fetch
    fetchCache.data = null;
    fetchCache.timestamp = 0;
    fetchCache.promise = null;

    try {
      setLoading(true);
      setError(null);
      startLoading();

      const result = await fetchAllData();
      setData(result);
    } catch (err) {
      console.error("[usePageData] Refetch error:", err);
      setError("Failed to refetch page data");
    } finally {
      setLoading(false);
      stopLoading();
    }
  }, [fetchAllData, startLoading, stopLoading]);

  return {
    hero: data.hero,
    services: data.services,
    testimonials: data.testimonials,
    loading,
    error,
    refetch,
  };
}

