import 'dotenv/config';
import { db } from './index';
import { stats, properties, propertyPhotos, heroPhotos, testimonials, socials } from './schema';

// ============================================
// SEED DATA - Based on Aresphi Property Design
// ============================================

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

const defaultProperties = [
  {
    name: 'Rumah Modern Pondok Indah',
    location: 'Jakarta Selatan',
    price: 'Rp 2.5 M',
    propertyType: 'rumah' as const,
    landArea: 250,
    buildingArea: 180,
    description: 'Rumah modern minimalis dengan desain arsitektur kontemporer di kawasan elit Pondok Indah. Dilengkapi kolam renang private dan taman luas.',
    showInShowcase: true,
    displayOrder: 0,
    photos: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', alt: 'Tampak depan', displayOrder: 0 },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', alt: 'Interior', displayOrder: 1 },
    ],
  },
  {
    name: 'Apartemen Mewah Sudirman',
    location: 'Jakarta Pusat',
    price: 'Rp 35 jt/bln',
    propertyType: 'apartemen' as const,
    landArea: null,
    buildingArea: 85,
    description: 'Apartemen premium dengan pemandangan cityscape di jantung kota. Akses mudah ke CBD dan fasilitas lengkap.',
    showInShowcase: true,
    displayOrder: 1,
    photos: [
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', alt: 'Living room', displayOrder: 0 },
    ],
  },
  {
    name: 'Villa Eksklusif BSD',
    location: 'Tangerang',
    price: 'Rp 4.5 M',
    propertyType: 'villa' as const,
    landArea: 400,
    buildingArea: 220,
    description: 'Villa mewah dengan konsep tropical modern di BSD City. Private pool, outdoor living area, dan smart home system.',
    showInShowcase: true,
    displayOrder: 2,
    photos: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', alt: 'Exterior', displayOrder: 0 },
    ],
  },
  {
    name: 'Cluster Premium Bandung',
    location: 'Bandung',
    price: 'Rp 1.8 M',
    propertyType: 'rumah' as const,
    landArea: 150,
    buildingArea: 120,
    description: 'Rumah cluster modern dengan udara sejuk Bandung. Desain Scandinavian dengan garden area yang asri.',
    showInShowcase: true,
    displayOrder: 3,
    photos: [
      { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80', alt: 'Facade', displayOrder: 0 },
    ],
  },
];

const defaultTestimonials = [
  {
    quote: 'We believe a home isn\'t just a transaction —\nit\'s a life-changing experience.',
    name: 'Ahmad Wijaya',
    title: 'FOUNDING PARTNER',
    displayOrder: 0,
  },
  {
    quote: 'Komitmen kami adalah memberikan layanan terbaik\ndengan integritas dan transparansi penuh.',
    name: 'Siti Rahayu',
    title: 'SENIOR PROPERTY ADVISOR',
    displayOrder: 1,
  },
];

const defaultSocials = {
  phone: '+62 812 3456 7890',
  email: 'info@aresphi.com',
  addressLine1: 'Jl. Sudirman No. 123',
  addressLine2: 'Jakarta Selatan, 12190',
  instagram: 'https://instagram.com/aresphi',
  linkedin: 'https://linkedin.com/company/aresphi',
};

// ============================================
// SEED FUNCTIONS
// ============================================

async function seedStats() {
  console.log('Seeding stats...');
  for (const stat of defaultStats) {
    await db.insert(stats).values(stat).onConflictDoNothing();
  }
  console.log('✓ Stats seeded');
}

async function seedHeroPhotos() {
  console.log('Seeding hero photos...');
  const existing = await db.select().from(heroPhotos);
  if (existing.length === 0) {
    await db.insert(heroPhotos).values(defaultHeroPhotos);
    console.log('✓ Hero photos seeded');
  } else {
    console.log('✓ Hero photos already exist, skipping');
  }
}

async function seedProperties() {
  console.log('Seeding properties...');
  const existing = await db.select().from(properties);
  if (existing.length === 0) {
    for (const prop of defaultProperties) {
      const [inserted] = await db.insert(properties).values({
        name: prop.name,
        location: prop.location,
        price: prop.price,
        propertyType: prop.propertyType,
        landArea: prop.landArea,
        buildingArea: prop.buildingArea,
        description: prop.description,
        showInShowcase: prop.showInShowcase,
        displayOrder: prop.displayOrder,
      }).returning();

      // Insert photos for this property
      for (const photo of prop.photos) {
        await db.insert(propertyPhotos).values({
          propertyId: inserted.id,
          url: photo.url,
          alt: photo.alt,
          displayOrder: photo.displayOrder,
        });
      }
    }
    console.log('✓ Properties seeded');
  } else {
    console.log('✓ Properties already exist, skipping');
  }
}

async function seedTestimonials() {
  console.log('Seeding testimonials...');
  const existing = await db.select().from(testimonials);
  if (existing.length === 0) {
    await db.insert(testimonials).values(defaultTestimonials);
    console.log('✓ Testimonials seeded');
  } else {
    console.log('✓ Testimonials already exist, skipping');
  }
}

async function seedSocials() {
  console.log('Seeding socials...');
  const existing = await db.select().from(socials);
  if (existing.length === 0) {
    await db.insert(socials).values(defaultSocials);
    console.log('✓ Socials seeded');
  } else {
    console.log('✓ Socials already exist, skipping');
  }
}

async function seed() {
  console.log('\n🌱 Starting seed...\n');
  
  await seedStats();
  await seedHeroPhotos();
  await seedProperties();
  await seedTestimonials();
  await seedSocials();
  
  console.log('\n✅ Seed complete!\n');
}

seed().catch(console.error);
