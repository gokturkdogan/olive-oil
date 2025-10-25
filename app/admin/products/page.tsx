import { db } from "@/lib/db";
import { ProductList } from "@/components/admin/product-list";
import { Package, Plus, BarChart3 } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        }
      },
      subcategory: {
        select: {
          id: true,
          name: true,
          slug: true,
        }
      }
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 py-8 md:py-12 px-4 -mx-4 mb-8">
        {/* Animated Background Blobs */}
        <div className="absolute top-5 right-5 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-5 left-5 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
              <Package className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">Ürün Yönetimi</span>
            </div>
            
            {/* Icon */}
            <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/30">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white leading-tight">
              Ürün Yönetimi
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base text-white/90 font-medium max-w-2xl mx-auto">
              Ürünleri görüntüle, düzenle ve yönet
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <ProductList products={products} />
        </div>
      </div>
    </div>
  );
}