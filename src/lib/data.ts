import { db } from '@/infrastructure/database';
import { properties, propertyPhotos, heroPhotos, stats, testimonials, socials } from '@/infrastructure/database/schema';
import { eq, asc, ne, sql } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from './cache';

/**
 * Cached data access functions for ISR with on-demand revalidation
 * 
 * These functions wrap database queries with unstable_cache and tags.
 * Use revalidateTag() in admin API routes to invalidate when data changes.
 */

// =============================================================================
// Properties
// =============================================================================

/**
 * Get all property slugs for generateStaticParams
 * Cached with 'properties' tag
 */
export const getAllPropertySlugs = unstable_cache(
  async () => {
    try {
      return await db.select({ slug: properties.slug }).from(properties);
    } catch {
      return [];
    }
  },
  ['property-slugs'],
  { tags: [CACHE_TAGS.properties] }
);

/**
 * Get a single property by slug with photos
 * Cached with both 'properties' and 'property-{slug}' tags
 */
export const getPropertyBySlug = unstable_cache(
  async (slug: string) => {
    try {
      const [property] = await db
        .select()
        .from(properties)
        .where(eq(properties.slug, slug));

      if (!property) return null;

      const photos = await db
        .select()
        .from(propertyPhotos)
        .where(eq(propertyPhotos.propertyId, property.id))
        .orderBy(asc(propertyPhotos.displayOrder));

      return { ...property, photos };
    } catch {
      return null;
    }
  },
  ['property-by-slug'],
  { tags: [CACHE_TAGS.properties] }
);

/**
 * Get random properties for suggestions (excluding current property)
 * Note: Random ordering makes this inherently dynamic, but we cache for a short time
 * to reduce database load during traffic spikes
 */
export const getRandomProperties = unstable_cache(
  async (propertyId: number, limit: number = 5) => {
    try {
      const random = await db
        .select()
        .from(properties)
        .where(ne(properties.id, propertyId))
        .orderBy(sql`RANDOM()`)
        .limit(limit);

      const withPhotos = await Promise.all(
        random.map(async (prop) => {
          const [photo] = await db
            .select()
            .from(propertyPhotos)
            .where(eq(propertyPhotos.propertyId, prop.id))
            .orderBy(asc(propertyPhotos.displayOrder))
            .limit(1);
          return { ...prop, photos: photo ? [photo] : [] };
        })
      );

      return withPhotos;
    } catch {
      return [];
    }
  },
  ['random-properties'],
  { tags: [CACHE_TAGS.properties], revalidate: 300 } // 5 min fallback for suggestions
);

/**
 * Get all properties with photos (for admin)
 * NOT cached - admin needs fresh data
 */
export async function getAllPropertiesWithPhotos() {
  const allProperties = await db
    .select()
    .from(properties)
    .orderBy(asc(properties.displayOrder));

  const propertiesWithPhotos = await Promise.all(
    allProperties.map(async (property) => {
      const photos = await db
        .select()
        .from(propertyPhotos)
        .where(eq(propertyPhotos.propertyId, property.id))
        .orderBy(asc(propertyPhotos.displayOrder));
      return { ...property, photos };
    })
  );

  return propertiesWithPhotos;
}

// =============================================================================
// Hero Photos
// =============================================================================

/**
 * Get hero photos for the landing page
 */
export const getHeroPhotos = unstable_cache(
  async (): Promise<[unknown | null, unknown | null, unknown | null]> => {
    try {
      const photos = await db.select().from(heroPhotos);
      
      const photo1 = photos.find(p => p.position === 1) || null;
      const photo2 = photos.find(p => p.position === 2) || null;
      const photo3 = photos.find(p => p.position === 3) || null;
      
      return [photo1, photo2, photo3];
    } catch {
      return [null, null, null];
    }
  },
  ['hero-photos'],
  { tags: [CACHE_TAGS.hero] }
);

// =============================================================================
// Stats
// =============================================================================

/**
 * Get all stats for display
 */
export const getStats = unstable_cache(
  async () => {
    try {
      return await db.select().from(stats).orderBy(asc(stats.displayOrder));
    } catch {
      return [];
    }
  },
  ['stats'],
  { tags: [CACHE_TAGS.stats] }
);

// =============================================================================
// Testimonials
// =============================================================================

/**
 * Get all testimonials for display
 */
export const getTestimonials = unstable_cache(
  async () => {
    try {
      return await db.select().from(testimonials).orderBy(asc(testimonials.displayOrder));
    } catch {
      return [];
    }
  },
  ['testimonials'],
  { tags: [CACHE_TAGS.testimonials] }
);

// =============================================================================
// Socials
// =============================================================================

/**
 * Get social/contact info
 */
export const getSocials = unstable_cache(
  async () => {
    try {
      const [social] = await db.select().from(socials);
      return social || { phone: '', email: '' };
    } catch {
      return { phone: '', email: '' };
    }
  },
  ['socials'],
  { tags: [CACHE_TAGS.socials] }
);
