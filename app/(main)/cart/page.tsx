import Link from "next/link";
import { auth } from "@/auth";
import { getCart } from "@/actions/cart";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/money";
import { calculateShippingFee, getRemainingForFreeShipping } from "@/lib/shipping";
import { CartItem } from "@/components/cart-item";
import { ShoppingBag, ArrowRight, Leaf, Package, Truck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CompactProductCard } from "@/components/compact-product-card";

async function getShippingThreshold() {
  const settings = await db.shippingSettings.findFirst();
  return settings?.free_shipping_threshold || 200000; // Default 2000 TL
}

export default async function CartPage() {
  const session = await auth();
  const cart = await getCart();
  
  // Get user's loyalty tier
  let loyaltyTier = "STANDARD";
  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { loyalty_tier: true },
    });
    loyaltyTier = user?.loyalty_tier || "STANDARD";
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 inline-block shadow-lg">
              <ShoppingBag className="h-24 w-24 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Sepetiniz <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Boş</span>
          </h1>
          <p className="text-gray-600 mb-8 text-base leading-relaxed">
            Premium zeytinyağı ürünlerimizi keşfetmeye başlayın
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Leaf className="mr-2 h-5 w-5" />
              Ürünleri Keşfet
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate shipping based on loyalty tier (async now)
  const shippingCost = await calculateShippingFee(subtotal, loyaltyTier as any);
  const remainingForFreeShipping = await getRemainingForFreeShipping(subtotal, loyaltyTier as any);
  const total = subtotal + shippingCost;
  
  // Get threshold directly from DB
  const threshold = await getShippingThreshold();
  
  // Determine free shipping reason
  let freeShippingReason = "";
  if (shippingCost === 0 && subtotal > 0) {
    if (loyaltyTier === "PLATINUM" || loyaltyTier === "DIAMOND") {
      freeShippingReason = "VIP üyeliğiniz sayesinde";
    } else if (subtotal >= threshold) {
      freeShippingReason = `${formatPrice(threshold)} sepet tutarı limitini aştığınız için`;
    }
  }

  // Get recommended products (excluding items already in cart)
  const cartProductIds = cart.items.map(item => item.product_id);
  const recommendedProducts = await db.product.findMany({
    where: {
      is_recommended: true,
      active: true,
      id: {
        notIn: cartProductIds,
      },
    },
    take: 2,
    orderBy: { created_at: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-x-hidden">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3 md:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
                Sepet<span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">im</span>
              </h1>
              <p className="text-sm md:text-base text-gray-600 flex items-center gap-2">
                <Package className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
                <span>{totalItems} ürün</span>
              </p>
            </div>
            {shippingCost === 0 && subtotal > 0 && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-3 py-1.5 md:px-4 md:py-2 text-sm">
                <Truck className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                <span className="text-xs md:text-sm">Ücretsiz Kargo</span>
              </Badge>
            )}
          </div>
        </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-2 sm:space-y-3 md:space-y-4">
          {cart.items.map((item, index) => (
            <div
              key={item.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CartItem item={item} />
            </div>
          ))}

          {/* Recommended Products */}
          {recommendedProducts.length > 0 && (
            <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-0.5 md:h-1 w-8 md:w-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
                <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-1.5 md:gap-2">
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                  İlginizi Çekebilecekler
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                {recommendedProducts.map((product) => (
                  <div key={product.id}>
                    <CompactProductCard
                      product={{
                        ...product,
                        images: product.images,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 lg:top-24">
            <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                  Sipariş Özeti
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 md:pt-6 space-y-4 md:space-y-6">
                {/* Price Breakdown */}
                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm md:text-base text-gray-600">Ara Toplam</span>
                    <span className="text-sm md:text-base font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-600" />
                      <span className="text-sm md:text-base text-gray-600">Kargo</span>
                    </div>
                    {shippingCost === 0 ? (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 text-xs md:text-sm">
                        Ücretsiz
                      </Badge>
                    ) : (
                      <span className="text-sm md:text-base font-semibold text-gray-900">{formatPrice(shippingCost)}</span>
                    )}
                  </div>
                  
                  {/* Free shipping progress */}
                  {remainingForFreeShipping !== null && remainingForFreeShipping > 0 && (
                    <div className="p-2 md:p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-[10px] md:text-xs text-amber-900 font-medium">
                        ✨ {formatPrice(remainingForFreeShipping)} daha ekleyin, ücretsiz kargo kazanın!
                      </p>
                    </div>
                  )}
                  
                  {shippingCost === 0 && subtotal > 0 && (
                    <div className="p-2 md:p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                      <p className="text-[10px] md:text-xs text-green-900 font-medium flex items-center gap-1.5">
                        <Truck className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        {freeShippingReason && `${freeShippingReason} `}Ücretsiz kargo kazandınız! 🎉
                      </p>
                    </div>
                  )}
                  
                  <div className="border-t-2 border-gray-200 pt-3 md:pt-4 flex justify-between items-center">
                    <span className="text-base md:text-lg font-bold text-gray-900">Toplam</span>
                    <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 md:space-y-3">
                  <Link href="/checkout" className="block">
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group text-sm md:text-base"
                    >
                      Ödemeye Geç
                      <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <Link href="/products" className="block">
                    <Button variant="outline" className="w-full border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 text-sm md:text-base">
                      <Leaf className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                      Alışverişe Devam Et
                    </Button>
                  </Link>
                </div>

                {/* Info */}
                <div className="pt-3 md:pt-4 border-t border-gray-200 grid grid-cols-3 gap-2 md:gap-4 text-center">
                  <div className="text-[10px] md:text-xs">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1 md:mb-1.5">
                      <span className="text-green-700 text-xs md:text-sm">✓</span>
                    </div>
                    <p className="text-gray-600">Güvenli</p>
                  </div>
                  <div className="text-[10px] md:text-xs">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-1 md:mb-1.5">
                      <Truck className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-700" />
                    </div>
                    <p className="text-gray-600">Hızlı</p>
                  </div>
                  <div className="text-[10px] md:text-xs">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-1 md:mb-1.5">
                      <Leaf className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-700" />
                    </div>
                    <p className="text-gray-600">Doğal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}

