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
    const { name, slug, location, latitude, longitude, price, propertyType, landArea, buildingArea, description, showInShowcase, displayOrder } = body;

    // If slug is being updated, check for duplicates
    if (slug !== undefined) {
      const existing = await db
        .select()
        .from(properties)
        .where(eq(properties.slug, slug));
      
      const isDuplicate = existing.some(p => p.id !== parseInt(id));
      if (isDuplicate) {
        return NextResponse.json(
          { error: 'Slug already exists. Please use a different slug.' },
          { status: 400 }
        );
      }
    }

    const [updated] = await db
      .update(properties)
      .set({
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(location !== undefined && { location }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(price !== undefined && { price }),
        ...(propertyType !== undefined && { propertyType }),
        ...(landArea !== undefined && { landArea }),
        ...(buildingArea !== undefined && { buildingArea }),
        ...(description !== undefined && { description }),
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
