import { getProducts } from "@/actions/products";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Package } from "lucide-react";

export default async function ProductsPage() {
  const products = await getProducts();

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
            Premium Koleksiyon
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Ürün <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Koleksiyonumuz</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Farklı hacim seçenekleriyle ihtiyacınıza özel zeytinyağı çeşitleri
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2 text-lg font-medium">Henüz ürün bulunmamaktadır</p>
            <p className="text-sm text-gray-400">
              Yakında yeni ürünler eklenecektir
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {products.map((product, index) => (
              <div 
                key={product.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

