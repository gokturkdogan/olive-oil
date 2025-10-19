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
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-olive-gradient opacity-10 rounded-full blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-full p-8 inline-block">
              <ShoppingBag className="h-20 w-20 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 text-gradient">Sepetiniz Boş</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Premium zeytinyağı ürünlerimizi keşfetmeye hazır mısınız?
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-olive-gradient hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl group">
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
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Sepetim</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>{totalItems} ürün</span>
            </p>
          </div>
          {shippingCost === 0 && subtotal > 0 && (
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-green-100 text-green-700 border-green-300">
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
          <Card className="sticky top-24 border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Sipariş Özeti
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Ara Toplam</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Kargo</span>
                  </div>
                  {shippingCost === 0 ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                      Ücretsiz
                    </Badge>
                  ) : (
                    <span className="font-medium">{formatPrice(shippingCost)}</span>
                  )}
                </div>
                
                {/* Free shipping progress */}
                {remainingForFreeShipping !== null && remainingForFreeShipping > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg animate-fadeInUp">
                    <p className="text-xs text-amber-800 font-medium">
                      ✨ Ücretsiz kargo için sadece {formatPrice(remainingForFreeShipping)} daha ekleyin!
                    </p>
                  </div>
                )}
                
                {shippingCost === 0 && subtotal > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg animate-fadeInUp">
                    <p className="text-xs text-green-800 font-medium flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      🎉 Ücretsiz kargo kazandınız!
                    </p>
                  </div>
                )}
                
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold">Toplam</span>
                  <span className="text-2xl font-bold text-gradient">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link href="/checkout" className="block">
                  <Button 
                    size="lg" 
                    className="w-full bg-olive-gradient hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg group"
                  >
                    Ödemeye Geç
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/products" className="block">
                  <Button variant="outline" className="w-full hover:bg-primary/5 transition-all duration-300">
                    <Leaf className="mr-2 h-4 w-4" />
                    Alışverişe Devam Et
                  </Button>
                </Link>
              </div>

              {/* Info */}
              <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  ✓ Güvenli ödeme
                </p>
                <p className="flex items-center gap-2">
                  ✓ Hızlı teslimat
                </p>
                <p className="flex items-center gap-2">
                  ✓ 100% doğal ürünler
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

