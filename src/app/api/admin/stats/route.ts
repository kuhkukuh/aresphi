import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { stats } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';
import { getAdminSession } from '@/lib/auth';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET() {
  const isAuthenticated = await getAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allStats = await db.select().from(stats).orderBy(stats.displayOrder);
    return NextResponse.json(allStats);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const isAuthenticated = await getAdminSession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { stats: updatedStats } = body;

    if (!Array.isArray(updatedStats)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Update each stat
    for (const stat of updatedStats) {
      await db
        .update(stats)
        .set({ value: stat.value, label: stat.label, suffix: stat.suffix })
        .where(eq(stats.key, stat.key));
    }

    // Invalidate cached stats data
    revalidateTag(CACHE_TAGS.stats, 'max');

    // Fetch and return updated stats
    const allStats = await db.select().from(stats).orderBy(stats.displayOrder);
    return NextResponse.json(allStats);
  } catch (error) {
    console.error('Failed to update stats:', error);
    return NextResponse.json(
      { error: 'Failed to update stats' },
      { status: 500 }
    );
  }
}
