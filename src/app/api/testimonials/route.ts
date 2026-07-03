import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { testimonials } from '@/infrastructure/database/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  const allTestimonials = await db
    .select()
    .from(testimonials)
    .orderBy(asc(testimonials.displayOrder));

  return NextResponse.json(allTestimonials);
}
