import 'dotenv/config';
import { db } from './index';
import { stats, properties, propertyPhotos, heroPhotos } from './schema';

const defaultStats = [
  { key: 'properties_sold', value: 150, suffix: '+', label: 'Properti Terjual', displayOrder: 1 },
  { key: 'happy_clients', value: 200, suffix: '+', label: 'Klien Puas', displayOrder: 2 },
  { key: 'years_experience', value: 5, suffix: '+', label: 'Tahun Pengalaman', displayOrder: 3 },
  { key: 'success_rate', value: 98, suffix: '%', label: 'Keberhasilan', displayOrder: 4 },
];

const defaultHeroPhotos = [
  { position: 1, url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', alt: 'Modern home exterior' },
  { position: 2, url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', alt: 'Luxury interior' },
  { position: 3, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', alt: 'Contemporary living space' },
];

async function seed() {
  console.log('Seeding stats...');
  await db.insert(stats).values(defaultStats).onConflictDoNothing();
  console.log('Stats seeded successfully');

  console.log('Seeding hero photos...');
  const existingHero = await db.select().from(heroPhotos);
  if (existingHero.length === 0) {
    await db.insert(heroPhotos).values(defaultHeroPhotos);
    console.log('Hero photos seeded successfully');
  } else {
    console.log('Hero photos already exist, skipping');
  }

  console.log('Seeding sample properties...');
  const existingProps = await db.select().from(properties);
  if (existingProps.length === 0) {
    const [prop1] = await db.insert(properties).values({
      name: 'Rumah Modern Pondok Indah',
      location: 'Jakarta Selatan',
      price: 'Rp 2.5 M',
      status: 'available',
      showInShowcase: true,
      displayOrder: 0,
    }).returning();

    await db.insert(propertyPhotos).values({
      propertyId: prop1.id,
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    });

    const [prop2] = await db.insert(properties).values({
      name: 'Apartemen Mewah Sudirman',
      location: 'Jakarta Pusat',
      price: 'Rp 35 jt/bln',
      status: 'available',
      showInShowcase: true,
      displayOrder: 1,
    }).returning();

    await db.insert(propertyPhotos).values({
      propertyId: prop2.id,
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    });

    const [prop3] = await db.insert(properties).values({
      name: 'Villa Eksklusif BSD',
      location: 'Tangerang',
      price: 'Rp 4.5 M',
      status: 'available',
      showInShowcase: true,
      displayOrder: 2,
    }).returning();

    await db.insert(propertyPhotos).values({
      propertyId: prop3.id,
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    });

    const [prop4] = await db.insert(properties).values({
      name: 'Cluster Premium Bandung',
      location: 'Bandung',
      price: 'Rp 1.8 M',
      status: 'available',
      showInShowcase: true,
      displayOrder: 3,
    }).returning();

    await db.insert(propertyPhotos).values({
      propertyId: prop4.id,
      url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80',
    });

    console.log('Sample properties seeded successfully');
  } else {
    console.log('Properties already exist, skipping');
  }

  console.log('Seed complete!');
}

seed().catch(console.error);
