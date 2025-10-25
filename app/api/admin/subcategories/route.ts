import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const subcategories = await prisma.subCategory.findMany({
      include: {
        category: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        sort_order: 'asc'
      }
    });

    return NextResponse.json(subcategories);
  } catch (error) {
    console.error('Sub kategoriler yüklenirken hata:', error);
    return NextResponse.json(
      { error: 'Sub kategoriler yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, slug, description, image, sort_order, status, category_id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Alt kategori ID gerekli' },
        { status: 400 }
      );
    }

    // Slug oluşturma
    const generatedSlug = slug || name.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const subcategory = await prisma.subCategory.update({
      where: { id },
      data: {
        name,
        slug: generatedSlug,
        description,
        image,
        sort_order: sort_order || 0,
        status: status || 'ACTIVE',
        category_id
      }
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error('Alt kategori güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Alt kategori güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subcategoryId = searchParams.get('id');

    if (!subcategoryId) {
      return NextResponse.json(
        { error: 'Alt kategori ID gerekli' },
        { status: 400 }
      );
    }

    // Alt kategorinin ürünleri var mı kontrol et
    const products = await prisma.product.findMany({
      where: { subcategory_id: subcategoryId }
    });

    if (products.length > 0) {
      return NextResponse.json(
        { error: 'Bu alt kategoride ürünler var. Önce ürünleri silin veya başka kategoriye taşıyın.' },
        { status: 400 }
      );
    }

    await prisma.subCategory.delete({
      where: { id: subcategoryId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Alt kategori silinirken hata:', error);
    return NextResponse.json(
      { error: 'Alt kategori silinemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, slug, description, image, sort_order, category_id } = body;

    // Slug oluşturma
    const generatedSlug = slug || name.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const subcategory = await prisma.subCategory.create({
      data: {
        name,
        slug: generatedSlug,
        description,
        image,
        sort_order: sort_order || 0,
        category_id
      }
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error('Sub kategori oluşturulurken hata:', error);
    return NextResponse.json(
      { error: 'Sub kategori oluşturulamadı' },
      { status: 500 }
    );
  }
}
