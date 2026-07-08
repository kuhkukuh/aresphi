import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { testimonials } from '@/infrastructure/database/schema';
import { getAdminSession } from '@/lib/auth';
import { asc } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET() {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allTestimonials = await db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.displayOrder));

  return NextResponse.json(allTestimonials);
}

export async function POST(request: Request) {
  const isAuth = await getAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { quote, name, title } = body;

    if (!quote || !name || !title) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get max display order
    const existing = await db.select().from(testimonials);
    const maxOrder = existing.reduce((max, t) => Math.max(max, t.displayOrder), 0);

    const [testimonial] = await db
      .insert(testimonials)
      .values({
        quote,
        name,
        title,
        displayOrder: maxOrder + 1,
      })
      .returning();

    // Invalidate cached testimonials data
    revalidateTag(CACHE_TAGS.testimonials, 'max');

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
