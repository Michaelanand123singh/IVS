"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLoading } from "@/contexts/LoadingContext";

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

interface ServicesAndTestimonialsData {
  services: Service[];
  testimonials: Testimonial[];
}

// Global cache to prevent duplicate requests and enable parallel fetching
const fetchCache = {
  promise: null as Promise<ServicesAndTestimonialsData> | null,
  data: null as ServicesAndTestimonialsData | null,
  timestamp: 0,
  CACHE_DURATION: 30000, // 30 seconds cache
  loadingCount: 0, // Track how many components are using this hook
};

/**
 * Optimized hook that fetches Services and Testimonials in parallel
 * Reduces loading time from sequential (T1 + T2) to parallel (max(T1, T2))
 * Includes request deduplication to prevent multiple simultaneous requests
 */
export function useServicesAndTestimonials() {
  const { startLoading, stopLoading } = useLoading();
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didFetchRef = useRef(false);

  const fetchData = useCallback(async (): Promise<ServicesAndTestimonialsData> => {
    const now = Date.now();
    
    // Return cached data if available and fresh
    if (fetchCache.data && (now - fetchCache.timestamp) < fetchCache.CACHE_DURATION) {
      console.log('[useServicesAndTestimonials] Returning cached data');
      return fetchCache.data;
    }

    // If a fetch is already in progress, return that promise (request deduplication)
    if (fetchCache.promise) {
      console.log('[useServicesAndTestimonials] Reusing existing fetch promise (deduplication)');
      return fetchCache.promise;
    }

    console.log('[useServicesAndTestimonials] Starting parallel fetch of Services and Testimonials');
    const startTime = performance.now();

    // Fetch both APIs in parallel using Promise.all
    // This reduces total time from sequential (T1 + T2) to parallel (max(T1, T2))
    fetchCache.promise = Promise.all([
      fetch("/api/services")
        .then((res) => {
          if (!res.ok) throw new Error("Services API failed");
          return res.json();
        })
        .then((data) => {
          console.log('[useServicesAndTestimonials] Services data received, count:', data.services?.length || 0);
          return data.services || [];
        })
        .catch((err) => {
          console.error("[useServicesAndTestimonials] Services fetch error:", err);
          // Fallback to static data
          return import("@/data/services")
            .then((module) => module.services || [])
            .catch(() => []);
        }),

      fetch("/api/testimonials")
        .then((res) => {
          if (!res.ok) throw new Error("Testimonials API failed");
          return res.json();
        })
        .then((data) => {
          console.log('[useServicesAndTestimonials] Testimonials data received, count:', data.testimonials?.length || 0);
          return data.testimonials || [];
        })
        .catch((err) => {
          console.error("[useServicesAndTestimonials] Testimonials fetch error:", err);
          // Fallback to static data
          return import("@/data/testimonials")
            .then((module) => module.testimonials || [])
            .catch(() => []);
        }),
    ]).then(([servicesData, testimonialsData]) => {
      const endTime = performance.now();
      console.log(`[useServicesAndTestimonials] Both APIs fetched in parallel in ${(endTime - startTime).toFixed(2)}ms`);

      const result: ServicesAndTestimonialsData = {
        services: servicesData as Service[],
        testimonials: testimonialsData as Testimonial[],
      };

      // Cache the result
      fetchCache.data = result;
      fetchCache.timestamp = Date.now();
      fetchCache.promise = null;

      return result;
    }).catch((err) => {
      console.error("[useServicesAndTestimonials] Parallel fetch failed:", err);
      fetchCache.promise = null;
      throw err;
    });

    return fetchCache.promise;
  }, []);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    // Increment loading count - only start loading if this is the first component
    const isFirstComponent = fetchCache.loadingCount === 0;
    fetchCache.loadingCount++;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Only call startLoading once, even if multiple components use this hook
        if (isFirstComponent) {
          startLoading();
        }

        const result = await fetchData();
        setServices(result.services);
        setTestimonials(result.testimonials);
      } catch (err) {
        console.error("[useServicesAndTestimonials] Error loading data:", err);
        setError("Failed to load data");
        
        // Fallback to static data
        try {
          const [servicesModule, testimonialsModule] = await Promise.all([
            import("@/data/services").catch(() => ({ services: [] })),
            import("@/data/testimonials").catch(() => ({ testimonials: [] })),
          ]);

          // Transform static services to add id property (required by Service interface)
          const staticServices = (servicesModule.services || []).map((service, index) => ({
            ...service,
            id: `static-service-${index}`,
          }));

          setServices(staticServices);
          setTestimonials(testimonialsModule.testimonials || []);
        } catch (fallbackErr) {
          console.error("[useServicesAndTestimonials] Fallback data loading failed:", fallbackErr);
        }
      } finally {
        setLoading(false);
        
        // Only call stopLoading once, when the last component finishes
        fetchCache.loadingCount--;
        if (fetchCache.loadingCount === 0) {
          stopLoading();
        }
      }
    };

    loadData();
  }, [fetchData, startLoading, stopLoading]);

  return {
    services,
    testimonials,
    loading,
    error,
  };
}

