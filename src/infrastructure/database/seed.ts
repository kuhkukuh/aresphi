import { db } from './index';
import { stats } from './schema';

const defaultStats = [
  { key: 'properties_sold', value: 150, suffix: '+', label: 'Properti Terjual', displayOrder: 1 },
  { key: 'happy_clients', value: 200, suffix: '+', label: 'Klien Puas', displayOrder: 2 },
  { key: 'years_experience', value: 5, suffix: '+', label: 'Tahun Pengalaman', displayOrder: 3 },
  { key: 'success_rate', value: 98, suffix: '%', label: 'Keberhasilan', displayOrder: 4 },
];

async function seed() {
  console.log('Seeding stats...');
  await db.insert(stats).values(defaultStats).onConflictDoNothing();
  console.log('Stats seeded successfully');
}

seed();
