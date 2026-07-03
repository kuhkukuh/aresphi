import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { propertyPhotos } from '@/infrastructure/database/schema';
import { getAdminSession } from '@/lib/auth';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const propertyId = parseInt(id);
    const body = await request.json();
    const { url, alt } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(propertyPhotos)
      .where(eq(propertyPhotos.propertyId, propertyId));

    if (Number(count) >= 10) {
      return NextResponse.json({ error: 'Maksimal 10 foto per properti' }, { status: 400 });
    }

    const [maxOrder] = await db
      .select({ max: sql<number>`COALESCE(MAX(display_order), -1)` })
      .from(propertyPhotos)
      .where(eq(propertyPhotos.propertyId, propertyId));

    const [photo] = await db
      .insert(propertyPhotos)
      .values({
        propertyId,
        url,
        alt: alt || '',
        displayOrder: (maxOrder?.max ?? -1) + 1,
      })
      .returning();

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Add photo error:', error);
    return NextResponse.json({ error: 'Failed to add photo' }, { status: 500 });
  }
}
