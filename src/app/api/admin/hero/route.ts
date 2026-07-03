import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { heroPhotos } from '@/infrastructure/database/schema';
import { getAdminSession } from '@/lib/auth';
import { asc } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET() {
  const photos = await db
    .select()
    .from(heroPhotos)
    .orderBy(asc(heroPhotos.position));

  const result = [1, 2, 3].map((pos) => {
    const photo = photos.find((p) => p.position === pos);
    return photo
      ? { id: String(photo.id), src: photo.url, alt: photo.alt }
      : null;
  });

  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { position, url, alt } = body;

    if (!position || !url) {
      return NextResponse.json(
        { error: 'Position and URL are required' },
        { status: 400 }
      );
    }

    if (![1, 2, 3].includes(position)) {
      return NextResponse.json(
        { error: 'Position must be 1, 2, or 3' },
        { status: 400 }
      );
    }

    const [photo] = await db
      .insert(heroPhotos)
      .values({ position, url, alt: alt || '' })
      .onConflictDoUpdate({
        target: heroPhotos.position,
        set: { url, alt: alt || '' },
      })
      .returning();

    // Invalidate cached hero data
    revalidateTag(CACHE_TAGS.hero, 'max');

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Update hero photo error:', error);
    return NextResponse.json({ error: 'Failed to update hero photo' }, { status: 500 });
  }
}
