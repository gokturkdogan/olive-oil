import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/money";
import { Check, Truck, Shield, RefreshCw, Sparkles, Award, Leaf } from "lucide-react";
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-[1fr,1.2fr] gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Product Image - Left */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500"></div>
            
            <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 rounded-2xl border-2 border-gray-200 hover:border-green-400 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
                <Badge className="bg-green-700 text-white shadow-lg border-0 text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
                {product.stock > 0 ? (
                  <Badge className="bg-emerald-600 text-white shadow-lg border-0 text-xs">
                    Stokta
                  </Badge>
                ) : (
                  <Badge className="bg-red-600 text-white shadow-lg border-0 text-xs">
                    Tükendi
                  </Badge>
                )}
              </div>

              <div className="relative h-[350px] flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="text-8xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    🫒
                  </div>
                  {product.stock < 10 && product.stock > 0 && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-xs">
                      Son {product.stock} adet!
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick Info Icons */}
              <div className="border-t border-gray-200 p-3 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-around text-xs">
                  <div className="flex items-center gap-1 text-green-700">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Hızlı Kargo</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-700">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Güvenli</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-700">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>14 Gün İade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info - Right */}
          <div className="space-y-4">
            {/* Title & Price */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-2 mb-3">
                <p className="text-3xl font-black text-green-700">
                  {formatPrice(product.price)}
                </p>
                <Badge className="bg-green-100 text-green-800 border border-green-300 text-xs">
                  KDV Dahil
                </Badge>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Features - Compact */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="h-4 w-4 text-green-700" />
                  <h3 className="font-semibold text-sm text-gray-900">Özellikler</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="bg-green-100 p-1 rounded flex-shrink-0">
                      <Check className="h-3 w-3 text-green-700" />
                    </div>
                    <span className="text-gray-700">Soğuk sıkım</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="bg-green-100 p-1 rounded flex-shrink-0">
                      <Check className="h-3 w-3 text-green-700" />
                    </div>
                    <span className="text-gray-700">Düşük asit</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="bg-green-100 p-1 rounded flex-shrink-0">
                      <Check className="h-3 w-3 text-green-700" />
                    </div>
                    <span className="text-gray-700">Cam şişe</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="bg-green-100 p-1 rounded flex-shrink-0">
                      <Check className="h-3 w-3 text-green-700" />
                    </div>
                    <span className="text-gray-700">%100 doğal</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs col-span-2">
                    <div className="bg-green-100 p-1 rounded flex-shrink-0">
                      <Check className="h-3 w-3 text-green-700" />
                    </div>
                    <span className="text-gray-700">Laboratuvar testli</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add to Cart */}
            <AddToCartForm productId={product.id} inStock={product.stock > 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

