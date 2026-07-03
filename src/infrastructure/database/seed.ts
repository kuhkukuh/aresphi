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

// Helper to generate URL-friendly slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const defaultProperties = [
  {
    name: 'Rumah Modern Pondok Indah',
    slug: 'rumah-modern-pondok-indah',
    location: 'Jakarta Selatan',
    latitude: -6.2615,
    longitude: 106.7814,
    price: 'Rp 2.5 M',
    propertyType: 'rumah' as const,
    landArea: 250,
    buildingArea: 180,
    description: 'Rumah modern minimalis dengan desain arsitektur kontemporer di kawasan elit Pondok Indah. Dilengkapi kolam renang private dan taman luas. Fitur smart home, parkir 4 mobil, dan keamanan 24 jam.',
    showInShowcase: true,
    displayOrder: 0,
    photos: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', alt: 'Tampak depan rumah', displayOrder: 0 },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', alt: 'Interior ruang tamu', displayOrder: 1 },
      { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80', alt: 'Dapur modern', displayOrder: 2 },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', alt: 'Kamar tidur utama', displayOrder: 3 },
    ],
  },
  {
    name: 'Apartemen Mewah Sudirman',
    slug: 'apartemen-mewah-sudirman',
    location: 'Jakarta Pusat',
    latitude: -6.2088,
    longitude: 106.8456,
    price: 'Rp 35 jt/bln',
    propertyType: 'apartemen' as const,
    landArea: null,
    buildingArea: 85,
    description: 'Apartemen premium dengan pemandangan cityscape di jantung kota. Akses mudah ke CBD dan fasilitas lengkap termasuk gym, pool, dan lounge eksklusif.',
    showInShowcase: true,
    displayOrder: 1,
    photos: [
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', alt: 'Living room apartemen', displayOrder: 0 },
      { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80', alt: 'View dari jendela', displayOrder: 1 },
      { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80', alt: 'Kamar tidur', displayOrder: 2 },
    ],
  },
  {
    name: 'Villa Eksklusif BSD',
    slug: 'villa-eksklusif-bsd',
    location: 'Tangerang',
    latitude: -6.3017,
    longitude: 106.6530,
    price: 'Rp 4.5 M',
    propertyType: 'villa' as const,
    landArea: 400,
    buildingArea: 220,
    description: 'Villa mewah dengan konsep tropical modern di BSD City. Private pool, outdoor living area, dan smart home system. Cocok untuk keluarga yang menginginkan privasi dan kenyamanan.',
    showInShowcase: true,
    displayOrder: 2,
    photos: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', alt: 'Eksterior villa', displayOrder: 0 },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', alt: 'Taman dan kolam', displayOrder: 1 },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', alt: 'Ruang keluarga', displayOrder: 2 },
    ],
  },
  {
    name: 'Cluster Premium Bandung',
    slug: 'cluster-premium-bandung',
    location: 'Bandung',
    latitude: -6.9147,
    longitude: 107.6098,
    price: 'Rp 1.8 M',
    propertyType: 'rumah' as const,
    landArea: 150,
    buildingArea: 120,
    description: 'Rumah cluster modern dengan udara sejuk Bandung. Desain Scandinavian dengan garden area yang asri. Lokasi strategis dekat dengan pusat perbelanjaan dan sekolah internasional.',
    showInShowcase: true,
    displayOrder: 3,
    photos: [
      { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80', alt: 'Facade rumah', displayOrder: 0 },
      { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80', alt: 'Interior', displayOrder: 1 },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', alt: 'Taman belakang', displayOrder: 2 },
    ],
  },
  {
    name: 'Ruko Strategis Kelapa Gading',
    slug: 'ruko-strategis-kelapa-gading',
    location: 'Jakarta Utara',
    latitude: -6.1568,
    longitude: 106.9058,
    price: 'Rp 3.2 M',
    propertyType: 'ruko' as const,
    landArea: 120,
    buildingArea: 300,
    description: 'Ruko 3 lantai di lokasi prime Kelapa Gading. Cocok untuk bisnis retail atau kantor. Parkir luas, akses mudah, dan lingkungan komersial yang berkembang.',
    showInShowcase: false,
    displayOrder: 4,
    photos: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', alt: 'Tampak depan ruko', displayOrder: 0 },
      { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80', alt: 'Interior', displayOrder: 1 },
    ],
  },
  {
    name: 'Villa Puncak Resort',
    slug: 'villa-puncak-resort',
    location: 'Puncak, Bogor',
    latitude: -6.7071,
    longitude: 106.9934,
    price: 'Rp 3.8 M',
    propertyType: 'villa' as const,
    landArea: 800,
    buildingArea: 350,
    description: 'Villa resort mewah dengan pemandangan pegunungan di Puncak. 5 kamar tidur, private jacuzzi, dan gazebo outdoor. Ideal untuk liburan keluarga atau investasi rental.',
    showInShowcase: false,
    displayOrder: 5,
    photos: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', alt: 'Villa dengan view gunung', displayOrder: 0 },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', alt: 'Taman', displayOrder: 1 },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', alt: 'Ruang keluarga', displayOrder: 2 },
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
        slug: prop.slug,
        location: prop.location,
        latitude: prop.latitude,
        longitude: prop.longitude,
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
