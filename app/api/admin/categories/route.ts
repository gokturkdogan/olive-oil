import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
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

    const subcategories = await prisma.subCategory.findMany({
      include: {
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

    return NextResponse.json({
      categories,
      subcategories
    });
  } catch (error) {
    console.error('Kategoriler yüklenirken hata:', error);
    return NextResponse.json(
      { error: 'Kategoriler yüklenemedi' },
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
    const { id, name, slug, description, image, sort_order, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Kategori ID gerekli' },
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

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug: generatedSlug,
        description,
        image,
        sort_order: sort_order || 0,
        status: status || 'ACTIVE'
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Kategori güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Kategori güncellenemedi' },
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
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Kategori ID gerekli' },
        { status: 400 }
      );
    }

    // Kategorinin alt kategorileri var mı kontrol et
    const subcategories = await prisma.subCategory.findMany({
      where: { category_id: categoryId }
    });

    if (subcategories.length > 0) {
      return NextResponse.json(
        { error: 'Bu kategorinin alt kategorileri var. Önce alt kategorileri silin.' },
        { status: 400 }
      );
    }

    // Kategorinin ürünleri var mı kontrol et
    const products = await prisma.product.findMany({
      where: { category_id: categoryId }
    });

    if (products.length > 0) {
      return NextResponse.json(
        { error: 'Bu kategoride ürünler var. Önce ürünleri silin veya başka kategoriye taşıyın.' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Kategori silinirken hata:', error);
    return NextResponse.json(
      { error: 'Kategori silinemedi' },
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
    const { name, slug, description, image, sort_order } = body;

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

    const category = await prisma.category.create({
      data: {
        name,
        slug: generatedSlug,
        description,
        image,
        sort_order: sort_order || 0
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Kategori oluşturulurken hata:', error);
    return NextResponse.json(
      { error: 'Kategori oluşturulamadı' },
      { status: 500 }
    );
  }
}
