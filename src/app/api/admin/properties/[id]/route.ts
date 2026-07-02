import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { properties, propertyPhotos } from '@/infrastructure/database/schema';
import { getAdminSession } from '@/lib/auth';
import { eq, asc } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, location, price, status, showInShowcase, displayOrder } = body;

    const [updated] = await db
      .update(properties)
      .set({
        ...(name !== undefined && { name }),
        ...(location !== undefined && { location }),
        ...(price !== undefined && { price }),
        ...(status !== undefined && { status }),
        ...(showInShowcase !== undefined && { showInShowcase }),
        ...(displayOrder !== undefined && { displayOrder }),
        updatedAt: new Date(),
      })
      .where(eq(properties.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const photos = await db
      .select()
      .from(propertyPhotos)
      .where(eq(propertyPhotos.propertyId, updated.id))
      .orderBy(asc(propertyPhotos.displayOrder));

    return NextResponse.json({ ...updated, photos });
  } catch (error) {
    console.error('Update property error:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

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

    const [deleted] = await db
      .delete(properties)
      .where(eq(properties.id, parseInt(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete property error:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
