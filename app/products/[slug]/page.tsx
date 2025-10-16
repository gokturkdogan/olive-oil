import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/products";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/money";
import { Check, Truck, Shield, RotateCcw, Sparkles, Package, Award } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-olive-gradient-soft to-white">
      {/* Product Detail */}
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-12 max-w-7xl mx-auto">
          {/* Product Image */}
          <div>
            <div className="bg-olive-gradient-soft rounded-2xl md:rounded-3xl h-80 sm:h-96 md:h-[500px] lg:h-[600px] flex items-center justify-center sticky top-20 md:top-24 overflow-hidden shadow-xl border-2 border-primary/10">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
              <div className="text-center relative z-10">
                <div className="text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] mb-4 animate-float">🫒</div>
                <p className="text-sm md:text-base font-semibold text-gray-700 px-4">{product.title}</p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-5 md:space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
                {product.stock > 0 ? (
                  <Badge className="bg-primary text-white shadow-lg px-3 md:px-4 py-1 md:py-1.5">
                    <Sparkles className="w-3 h-3 mr-1 inline" />
                    Stokta Var
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="shadow-lg px-3 md:px-4 py-1 md:py-1.5">
                    Tükendi
                  </Badge>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <Badge variant="outline" className="border-primary/30 text-primary px-3 md:px-4 py-1 md:py-1.5">
                    Son {product.stock} adet
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-gray-900 leading-tight">{product.title}</h1>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient mb-2">
                {formatPrice(product.price)}
              </p>
            </div>

            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="pt-5 md:pt-6 pb-5 md:pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Award className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-base md:text-lg">Ürün Özellikleri</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="bg-primary/10 p-1 rounded-full flex-shrink-0">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-gray-700">Soğuk sıkım, birinci kalite</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="bg-primary/10 p-1 rounded-full flex-shrink-0">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-gray-700">%0.5&apos;den düşük asit oranı</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="bg-primary/10 p-1 rounded-full flex-shrink-0">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-gray-700">Cam şişede, ışık geçirmez ambalaj</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="bg-primary/10 p-1 rounded-full flex-shrink-0">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-gray-700">Katkısız, %100 doğal</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="bg-primary/10 p-1 rounded-full flex-shrink-0">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-gray-700">Laboratuvar testli</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-white/80 backdrop-blur rounded-2xl p-5 md:p-6 shadow-lg border border-primary/10">
              <h3 className="font-bold text-base md:text-lg mb-3 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Ürün Açıklaması
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Add to Cart */}
            <AddToCartForm productId={product.id} inStock={product.stock > 0} />
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-10 md:mt-16 lg:mt-20 max-w-7xl mx-auto">
          <Card className="border-2 border-transparent hover:border-primary/30 hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-5 md:pt-6 pb-5 md:pb-6 text-center">
              <div className="bg-primary/10 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Truck className="h-7 w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <h4 className="font-bold text-sm md:text-base mb-1 md:mb-2">Ücretsiz Kargo</h4>
              <p className="text-xs md:text-sm text-gray-600">
                500 TL ve üzeri siparişlerde kargo bedava
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-transparent hover:border-primary/30 hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-5 md:pt-6 pb-5 md:pb-6 text-center">
              <div className="bg-primary/10 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Shield className="h-7 w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <h4 className="font-bold text-sm md:text-base mb-1 md:mb-2">Güvenli Ödeme</h4>
              <p className="text-xs md:text-sm text-gray-600">
                SSL sertifikalı güvenli ödeme altyapısı
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-transparent hover:border-primary/30 hover:shadow-xl transition-all duration-300 sm:col-span-1">
            <CardContent className="pt-5 md:pt-6 pb-5 md:pb-6 text-center">
              <div className="bg-primary/10 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <RotateCcw className="h-7 w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <h4 className="font-bold text-sm md:text-base mb-1 md:mb-2">Kolay İade</h4>
              <p className="text-xs md:text-sm text-gray-600">
                14 gün içinde ücretsiz iade hakkı
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

