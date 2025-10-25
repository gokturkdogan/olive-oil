import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/products";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/money";
import { Check, Truck, Shield, RefreshCw, Award, Leaf, Package, Zap } from "lucide-react";
import { AddToCartForm } from "@/components/add-to-cart-form";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 py-8 md:py-12 px-4">
        {/* Animated Background Blobs */}
        <div className="absolute top-5 right-5 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-5 left-5 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
              <Package className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">Ürün Detayı</span>
            </div>
            
            {/* Icon */}
            <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/30">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white leading-tight">
              {product.title}
            </h1>
            
            {/* Price */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <p className="text-2xl sm:text-3xl font-black text-white">
                {formatPrice(product.price)}
              </p>
              <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30 text-xs font-semibold">
                KDV Dahil
              </Badge>
            </div>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base text-white/90 font-medium max-w-2xl mx-auto">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[1fr,1fr] gap-6 lg:gap-8">
            {/* Product Image - Left */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500"></div>
              
              <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 rounded-2xl border-2 border-green-200 hover:border-green-400 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
                  <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg border-0 text-xs font-semibold">
                    <Award className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                  {product.stock > 0 ? (
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg border-0 text-xs font-semibold">
                      <Check className="w-3 h-3 mr-1" />
                      Stokta
                    </Badge>
                  ) : (
                    <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg border-0 text-xs font-semibold">
                      Tükendi
                    </Badge>
                  )}
                </div>

                <div className="relative h-[400px] flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="text-8xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      🫒
                    </div>
                    {product.stock < 10 && product.stock > 0 && (
                      <Badge variant="outline" className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-300 text-xs font-semibold">
                        <Zap className="w-3 h-3 mr-1" />
                        Son {product.stock} adet!
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Quick Info Icons */}
                <div className="border-t border-green-200 p-4 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center justify-around text-xs">
                    <div className="flex items-center gap-1 text-green-700 font-semibold">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Hızlı Kargo</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-700 font-semibold">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Güvenli</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-700 font-semibold">
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>14 Gün İade</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart - Right */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-8">
                  <AddToCartForm productId={product.id} inStock={product.stock > 0} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}