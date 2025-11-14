/**
 * Shared fetch utility for page data with request deduplication and parallel fetching
 * This ensures that multiple components can request the same data without duplicate API calls
 */

interface CacheEntry<T> {
  promise: Promise<T> | null;
  data: T | null;
  timestamp: number;
}

interface FetchCache {
  [key: string]: CacheEntry<unknown>;
}

const cache: FetchCache = {};
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Fetches data from an API endpoint with caching and request deduplication
 * If multiple components request the same endpoint simultaneously, they share the same promise
 */
export async function fetchWithCache<T>(
  endpoint: string,
  fallback: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const cacheKey = endpoint;

  // Return cached data if available and fresh
  if (cache[cacheKey]?.data && (now - cache[cacheKey].timestamp) < CACHE_DURATION) {
    console.log(`[fetchWithCache] Returning cached data for ${endpoint}`);
    return cache[cacheKey].data as T;
  }

  // If a fetch is already in progress, return that promise (request deduplication)
  if (cache[cacheKey]?.promise) {
    console.log(`[fetchWithCache] Reusing existing fetch promise for ${endpoint} (deduplication)`);
    return cache[cacheKey].promise as Promise<T>;
  }

  console.log(`[fetchWithCache] Starting fetch for ${endpoint}`);
  const startTime = performance.now();

  // Create the fetch promise
  cache[cacheKey] = {
    promise: fetch(endpoint)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`${endpoint} API failed`);
        }
        const data = await res.json();
        const endTime = performance.now();
        console.log(`[fetchWithCache] ${endpoint} fetched in ${(endTime - startTime).toFixed(2)}ms`);
        return data;
      })
      .catch(async (err) => {
        console.error(`[fetchWithCache] Error fetching ${endpoint}:`, err);
        // Fallback to static data
        try {
          const fallbackData = await fallback();
          return fallbackData;
        } catch (fallbackErr) {
          console.error(`[fetchWithCache] Fallback failed for ${endpoint}:`, fallbackErr);
          throw err;
        }
      })
      .then((data) => {
        // Cache the result
        cache[cacheKey] = {
          promise: null,
          data,
          timestamp: Date.now(),
        };
        return data;
      })
      .catch((err) => {
        // Clear promise on error
        if (cache[cacheKey]) {
          cache[cacheKey].promise = null;
        }
        throw err;
      }),
    data: null,
    timestamp: 0,
  };

  return cache[cacheKey].promise as Promise<T>;
}

/**
 * Fetches multiple endpoints in parallel
 * This is the key optimization: instead of sequential fetching, all APIs are called simultaneously
 */
export async function fetchAllInParallel<T extends Record<string, unknown>>(
  endpoints: { [K in keyof T]: { url: string; fallback: () => Promise<unknown> } }
): Promise<T> {
  const startTime = performance.now();
  console.log('[fetchAllInParallel] Starting parallel fetch of', Object.keys(endpoints).length, 'endpoints');

  const promises = Object.entries(endpoints).map(([key, { url, fallback }]) =>
    fetchWithCache(url, fallback).then((data) => [key, data])
  );

  const results = await Promise.all(promises);
  const endTime = performance.now();

  const result = Object.fromEntries(results) as T;
  console.log(`[fetchAllInParallel] All endpoints fetched in parallel in ${(endTime - startTime).toFixed(2)}ms`);

  return result;
}

