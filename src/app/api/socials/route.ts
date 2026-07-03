import { db } from '@/infrastructure/database';
import { socials } from '@/infrastructure/database/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await db.select().from(socials).orderBy(desc(socials.id)).limit(1);
    
    if (result.length === 0) {
      return NextResponse.json({
        phone: null,
        email: null,
        addressLine1: null,
        addressLine2: null,
        instagram: null,
        linkedin: null,
      });
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching socials:', error);
    return NextResponse.json({ error: 'Failed to fetch socials' }, { status: 500 });
  }
}
