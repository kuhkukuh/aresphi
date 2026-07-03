import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { properties, propertyPhotos } from '@/infrastructure/database/schema';
import { getAdminSession } from '@/lib/auth';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allProperties = await db
    .select()
    .from(properties)
    .orderBy(asc(properties.displayOrder));

  const propertiesWithPhotos = await Promise.all(
    allProperties.map(async (property) => {
      const photos = await db
        .select()
        .from(propertyPhotos)
        .where(eq(propertyPhotos.propertyId, property.id))
        .orderBy(asc(propertyPhotos.displayOrder));
      return { ...property, photos };
    })
  );

  return NextResponse.json(propertiesWithPhotos);
}

export async function POST(request: Request) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, location, latitude, longitude, price, propertyType, landArea, buildingArea, description, showInShowcase } = body;

    if (!name || !location || !price) {
      return NextResponse.json(
        { error: 'Name, location, and price are required' },
        { status: 400 }
      );
    }

    const [property] = await db
      .insert(properties)
      .values({
        name,
        location,
        latitude: latitude || null,
        longitude: longitude || null,
        price,
        propertyType: propertyType || 'rumah',
        landArea: landArea || null,
        buildingArea: buildingArea || null,
        description: description || null,
        showInShowcase: showInShowcase || false,
      })
      .returning();

    return NextResponse.json({ ...property, photos: [] }, { status: 201 });
  } catch (error) {
    console.error('Create property error:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
