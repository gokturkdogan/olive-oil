import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

interface SubCategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { slug } = await params;
  const subcategory = await prisma.subCategory.findUnique({
    where: { slug },
    include: {
      category: true,
      products: {
        where: { active: true },
        include: {
          category: true,
          subcategory: true
        }
      }
    }
  });

  if (!subcategory) {
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
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-green-600 transition-colors">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link href={`/category/${subcategory.category.slug}`} className="hover:text-green-600 transition-colors">
              {subcategory.category.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{subcategory.name}</span>
          </nav>

          <Badge className="mb-6 bg-green-50 text-green-800 border border-green-200 px-4 py-2">
            <Leaf className="w-4 h-4 mr-2" />
            {subcategory.name}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            {subcategory.name} <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Ürünleri</span>
          </h1>
          
          {subcategory.description && (
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              {subcategory.description}
            </p>
          )}
          
          <p className="text-sm text-gray-500 mb-6">
            {subcategory.products.length} ürün bulundu
          </p>

          {/* Geri Dön Butonu */}
          <Link
            href={`/category/${subcategory.category.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-white hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            {subcategory.category.name} Kategorisine Dön
          </Link>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Ürünler Grid */}
        {subcategory.products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subcategory.products.map((product, index) => (
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
            <p className="text-gray-500 mb-2 text-lg font-medium">Bu sub kategoride henüz ürün bulunmuyor</p>
            <p className="text-sm text-gray-400 mb-6">
              Yakında yeni ürünler eklenecektir
            </p>
            <Link
              href={`/category/${subcategory.category.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Ana Kategoriye Dön
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
