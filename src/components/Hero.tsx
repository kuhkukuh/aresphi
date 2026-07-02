import { db } from '@/infrastructure/database';
import { heroPhotos } from '@/infrastructure/database/schema';
import { asc } from 'drizzle-orm';
import HeroClient from './HeroClient';

export type HeroPhoto = {
  id: string;
  src: string;
  alt: string;
};

const defaultHeroPhotos: [HeroPhoto, HeroPhoto, HeroPhoto] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    alt: "Modern home exterior",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    alt: "Luxury interior",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    alt: "Contemporary living space",
  },
];

async function getHeroPhotos(): Promise<[HeroPhoto, HeroPhoto, HeroPhoto]> {
  try {
    const photos = await db.select().from(heroPhotos).orderBy(asc(heroPhotos.position));
    
    if (photos.length === 3) {
      return [
        { id: String(photos[0].id), src: photos[0].url, alt: photos[0].alt },
        { id: String(photos[1].id), src: photos[1].url, alt: photos[1].alt },
        { id: String(photos[2].id), src: photos[2].url, alt: photos[2].alt },
      ];
    }
    return defaultHeroPhotos;
  } catch {
    return defaultHeroPhotos;
  }
}

export default async function Hero() {
  const photos = await getHeroPhotos();
  return <HeroClient photos={photos} />;
}
