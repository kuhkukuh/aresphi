import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/database';
import { testimonials } from '@/infrastructure/database/schema';
import { getAdminSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

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
    const { quote, name, title, displayOrder } = body;

    const [updated] = await db
      .update(testimonials)
      .set({
        ...(quote !== undefined && { quote }),
        ...(name !== undefined && { name }),
        ...(title !== undefined && { title }),
        ...(displayOrder !== undefined && { displayOrder }),
      })
      .where(eq(testimonials.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update testimonial error:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
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
      .delete(testimonials)
      .where(eq(testimonials.id, parseInt(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
