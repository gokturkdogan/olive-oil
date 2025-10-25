import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { status: 'ACTIVE' },
      include: {
        subcategories: {
          where: { status: 'ACTIVE' },
          orderBy: { sort_order: 'asc' }
        }
      },
      orderBy: { sort_order: 'asc' }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json(
      { error: 'Kategoriler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
