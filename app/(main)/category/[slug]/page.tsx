import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { SubCategorySidebar } from '@/components/subcategory-sidebar';
import { Badge } from '@/components/ui/badge';
import { Leaf, Package } from 'lucide-react';

const prisma = new PrismaClient();

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      subcategories: {
        where: { status: 'ACTIVE' },
        orderBy: { sort_order: 'asc' }
      },
      products: {
        where: { active: true },
        include: {
          category: true,
          subcategory: true
        }
      }
    }
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50/50 to-white py-16 md:py-20 px-4 border-b border-gray-100">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-green-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-100 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <Badge className="mb-6 bg-green-50 text-green-800 border border-green-200 px-4 py-2">
            <Leaf className="w-4 h-4 mr-2" />
            {category.name}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            {category.name} <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Koleksiyonu</span>
          </h1>
          
          {category.description && (
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              {category.description}
            </p>
          )}
          
          <p className="text-sm text-gray-500">
            {category.products.length} ürün bulundu
          </p>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex gap-8">
          {/* Ana İçerik */}
          <div className="flex-1">
            {/* Ürünler Grid */}
            {category.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.products.map((product, index) => (
                  <div 
                    key={product.id}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2 text-lg font-medium">Bu kategoride henüz ürün bulunmuyor</p>
                <p className="text-sm text-gray-400">
                  Yakında yeni ürünler eklenecektir
                </p>
              </div>
            )}
          </div>

          {/* Sub Kategori Sidebar */}
          {category.subcategories.length > 0 && (
            <div className="w-64">
              <SubCategorySidebar 
                subcategories={category.subcategories}
                categorySlug={category.slug}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
