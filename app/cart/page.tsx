import Link from "next/link";
import { getCart } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/money";
import { CartItem } from "@/components/cart-item";
import { ShoppingBag } from "lucide-react";

export default async function CartPage() {
  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-2">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-6">
            Henüz sepetinize ürün eklemediniz.
          </p>
          <Link href="/products">
            <Button size="lg">Alışverişe Başla</Button>
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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Sepetim</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-xl font-semibold">Sipariş Özeti</h2>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span className="text-green-600">Ücretsiz</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Toplam</span>
                  <span className="text-primary">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <Link href="/checkout" className="block">
                <Button size="lg" className="w-full">
                  Ödemeye Geç
                </Button>
              </Link>

              <Link href="/products">
                <Button variant="outline" className="w-full">
                  Alışverişe Devam Et
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

