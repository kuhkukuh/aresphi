import { unstable_cache } from 'next/cache';

/**
 * Cache tags for on-demand revalidation
 * Use these tags with revalidateTag() when data changes
 */
export const CACHE_TAGS = {
  properties: 'properties',
  propertyDetail: (slug: string) => `property-${slug}`,
  hero: 'hero',
  stats: 'stats',
  testimonials: 'testimonials',
  socials: 'socials',
} as const;

/**
 * Cache durations (in seconds)
 * These are fallback times - primary invalidation is on-demand
 */
export const CACHE_DURATION = {
  /** Long cache for static content - invalidated on-demand */
  static: 86400 * 7, // 7 days
  /** Medium cache for semi-static content */
  medium: 3600, // 1 hour
} as const;

/**
 * Wrapper for caching database queries with tags
 * Enables on-demand revalidation via revalidateTag()
 */
export function cacheQuery<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  keys: string[],
  tags: string[]
): T {
  return unstable_cache(fn, keys, { tags }) as T;
}
