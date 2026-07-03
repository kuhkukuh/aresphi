import { db } from '@/infrastructure/database';
import { properties, propertyPhotos } from '@/infrastructure/database/schema';
import { asc, eq, inArray, sql } from 'drizzle-orm';
import PropertyFilters from './PropertyFilters';
import PropertyList from './PropertyList';
import Footer from '@/components/Footer';

export const revalidate = 60; // ISR: regenerate every 60 seconds

export type PropertyWithType = Awaited<ReturnType<typeof getProperties>>[0];

async function getProperties(filters: { types?: string[]; locations?: string[] }) {
  try {
    // Build query with optional filters
    let query = db.select().from(properties);

    // Apply type filter if provided
    if (filters.types && filters.types.length > 0) {
      query = query.where(
        inArray(properties.propertyType, filters.types as ('rumah' | 'apartemen' | 'villa' | 'ruko')[])
      ) as typeof query;
    }

    // Apply location filter if provided
    if (filters.locations && filters.locations.length > 0) {
      query = query.where(
        inArray(properties.location, filters.locations)
      ) as typeof query;
    }

    const allProperties = await query.orderBy(asc(properties.displayOrder));

    // Fetch photos for each property
    const withPhotos = await Promise.all(
      allProperties.map(async (prop) => {
        const photos = await db
          .select()
          .from(propertyPhotos)
          .where(eq(propertyPhotos.propertyId, prop.id))
          .orderBy(asc(propertyPhotos.displayOrder));
        return {
          ...prop,
          photos,
        };
      })
    );

    return withPhotos;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

async function getDistinctLocations() {
  try {
    const result = await db
      .selectDistinct({ location: properties.location })
      .from(properties)
      .orderBy(properties.location);
    return result.map(r => r.location);
  } catch {
    return [];
  }
}

export default async function PropertiPage({
  searchParams,
}: {
  searchParams: Promise<{ tipe?: string; lokasi?: string }>;
}) {
  const params = await searchParams;

  // Parse filters from URL
  const types = params.tipe?.split(',').filter(Boolean) || [];
  const locations = params.lokasi?.split(',').filter(Boolean) || [];

  const [filteredProperties, distinctLocations] = await Promise.all([
    getProperties({ types: types.length > 0 ? types : undefined, locations: locations.length > 0 ? locations : undefined }),
    getDistinctLocations(),
  ]);

  return (
    <>
      {/* Header */}
      <section className="pt-40 pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow">
            <span className="eyebrow-left"><span className="text-stone-500">—</span> Properti</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mt-8">
            <h1 className="text-4xl font-medium leading-[1.02] sm:text-5xl md:text-6xl text-stone-900" style={{ letterSpacing: '-.055em' }}>
              Koleksi<br /><span className="font-playfair italic font-normal text-stone-500/80">Properti Unggulan</span>
            </h1>
            <p className="text-stone-500 max-w-sm text-sm">Jelajahi seluruh properti pilihan kami di berbagai lokasi strategis, dari rumah tinggal hingga investasi.</p>
          </div>
        </div>
      </section>

      {/* Catalog Body */}
      <section className="px-6 md:px-12 pb-32">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <PropertyFilters
            distinctLocations={distinctLocations}
            selectedTypes={types}
            selectedLocations={locations}
          />

          {/* Property Rows */}
          <PropertyList properties={filteredProperties} />
        </div>
      </section>

      <Footer />
    </>
  );
}
