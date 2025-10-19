import Link from "next/link";
import { auth } from "@/auth";
import { getCart } from "@/actions/cart";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/money";
import { calculateShippingFee, getRemainingForFreeShipping } from "@/lib/shipping";
import { CartItem } from "@/components/cart-item";
import { ShoppingBag, ArrowRight, Leaf, Package, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  
  // Calculate shipping based on loyalty tier
  const shippingCost = calculateShippingFee(subtotal, loyaltyTier as any);
  const remainingForFreeShipping = getRemainingForFreeShipping(subtotal, loyaltyTier as any);
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Sepet<span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">im</span>
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Package className="h-4 w-4 text-green-600" />
                <span>{totalItems} ürün</span>
              </p>
            </div>
            {shippingCost === 0 && subtotal > 0 && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-4 py-2">
                <Truck className="h-4 w-4 mr-2" />
                Ücretsiz Kargo
              </Badge>
            )}
          </div>
        </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item, index) => (
            <div
              key={item.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CartItem item={item} />
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white pb-6">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Sipariş Özeti
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Price Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Truck className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">Kargo</span>
                    </div>
                    {shippingCost === 0 ? (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                        Ücretsiz
                      </Badge>
                    ) : (
                      <span className="font-semibold text-gray-900">{formatPrice(shippingCost)}</span>
                    )}
                  </div>
                  
                  {/* Free shipping progress */}
                  {remainingForFreeShipping !== null && remainingForFreeShipping > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-xs text-amber-900 font-medium">
                        ✨ Ücretsiz kargo için {formatPrice(remainingForFreeShipping)} daha!
                      </p>
                    </div>
                  )}
                  
                  {shippingCost === 0 && subtotal > 0 && (
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                      <p className="text-xs text-green-900 font-medium flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5" />
                        Ücretsiz kargo kazandınız! 🎉
                      </p>
                    </div>
                  )}
                  
                  <div className="border-t-2 border-gray-200 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Toplam</span>
                    <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Link href="/checkout" className="block">
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      Ödemeye Geç
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <Link href="/products" className="block">
                    <Button variant="outline" className="w-full border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300">
                      <Leaf className="mr-2 h-4 w-4" />
                      Alışverişe Devam Et
                    </Button>
                  </Link>
                </div>

                {/* Info */}
                <div className="pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
                  <div className="text-xs">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1.5">
                      <span className="text-green-700 text-sm">✓</span>
                    </div>
                    <p className="text-gray-600">Güvenli</p>
                  </div>
                  <div className="text-xs">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-1.5">
                      <Truck className="h-4 w-4 text-blue-700" />
                    </div>
                    <p className="text-gray-600">Hızlı</p>
                  </div>
                  <div className="text-xs">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-1.5">
                      <Leaf className="h-4 w-4 text-emerald-700" />
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
  );
}

