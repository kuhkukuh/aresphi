import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { propertyPhotos } from '@/infrastructure/database/schema';
import { getAdminSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { del } from '@vercel/blob';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const [photo] = await db
      .select()
      .from(propertyPhotos)
      .where(eq(propertyPhotos.id, parseInt(id)))
      .limit(1);

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    await db.delete(propertyPhotos).where(eq(propertyPhotos.id, parseInt(id)));

    try {
      await del(photo.url);
    } catch {
      console.warn('Failed to delete blob:', photo.url);
    }

    // Invalidate cached property data
    revalidateTag(CACHE_TAGS.properties, 'max');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete photo error:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
