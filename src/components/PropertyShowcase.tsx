import { db } from '@/infrastructure/database';
import { properties, propertyPhotos } from '@/infrastructure/database/schema';
import { eq, asc, sql } from 'drizzle-orm';
import PropertyShowcaseClient from './PropertyShowcaseClient';

export type Property = {
  id: string;
  name: string;
  slug: string;
  location: string;
  price: string;
  image: string;
};

const defaultProperties: Property[] = [
  {
    id: "1",
    name: "Rumah Modern Pondok Indah",
    slug: "rumah-modern-pondok-indah",
    location: "Jakarta Selatan",
    price: "Rp 2.5 M",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  },
  {
    id: "2",
    name: "Apartemen Mewah Sudirman",
    slug: "apartemen-mewah-sudirman",
    location: "Jakarta Pusat",
    price: "Rp 35 jt/bln",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  },
  {
    id: "3",
    name: "Villa Eksklusif BSD",
    slug: "villa-eksklusif-bsd",
    location: "Tangerang",
    price: "Rp 4.5 M",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  },
  {
    id: "4",
    name: "Cluster Premium Bandung",
    slug: "cluster-premium-bandung",
    location: "Bandung",
    price: "Rp 1.8 M",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80",
  },
];

async function getShowcaseProperties(): Promise<Property[]> {
  try {
    const showcaseProperties = await db
      .select()
      .from(properties)
      .where(sql`${properties.showInShowcase} = true`)
      .orderBy(asc(properties.displayOrder));

    if (showcaseProperties.length === 0) {
      return defaultProperties;
    }

    const withPhotos = await Promise.all(
      showcaseProperties.map(async (prop) => {
        const photos = await db
          .select()
          .from(propertyPhotos)
          .where(eq(propertyPhotos.propertyId, prop.id))
          .orderBy(asc(propertyPhotos.displayOrder));
        return {
          id: String(prop.id),
          name: prop.name,
          slug: prop.slug,
          location: prop.location,
          price: prop.price,
          image: photos[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
        };
      })
    );

    return withPhotos;
  } catch {
    return defaultProperties;
  }
}

export default async function PropertyShowcase() {
  const properties = await getShowcaseProperties();
  return <PropertyShowcaseClient properties={properties} />;
}
