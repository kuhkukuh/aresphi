import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { socials } from '@/infrastructure/database/schema';
import { getAdminSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET() {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allSocials = await db.select().from(socials);
  return NextResponse.json(allSocials[0] || null);
}

export async function PUT(request: Request) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { phone, email, addressLine1, addressLine2, instagram, linkedin } = body;

    // Check if social record exists
    const existing = await db.select().from(socials);
    
    let result;
    if (existing.length === 0) {
      // Create new record
      [result] = await db
        .insert(socials)
        .values({
          phone: phone || null,
          email: email || null,
          addressLine1: addressLine1 || null,
          addressLine2: addressLine2 || null,
          instagram: instagram || null,
          linkedin: linkedin || null,
        })
        .returning();
    } else {
      // Update existing record
      [result] = await db
        .update(socials)
        .set({
          phone: phone || null,
          email: email || null,
          addressLine1: addressLine1 || null,
          addressLine2: addressLine2 || null,
          instagram: instagram || null,
          linkedin: linkedin || null,
        })
        .where(eq(socials.id, existing[0].id))
        .returning();
    }

    // Invalidate cached socials data
    revalidateTag(CACHE_TAGS.socials, 'max');

    return NextResponse.json(result);
  } catch (error) {
    console.error('Update socials error:', error);
    return NextResponse.json({ error: 'Failed to update socials' }, { status: 500 });
  }
}
