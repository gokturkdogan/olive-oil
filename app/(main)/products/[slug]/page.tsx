import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/money";
import { Check } from "lucide-react";
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
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Product Image */}
        <div>
          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg h-96 md:h-full flex items-center justify-center sticky top-4">
            <div className="text-center">
              <div className="text-9xl mb-4">🫒</div>
              <p className="text-gray-600">{product.title}</p>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.stock > 0 ? (
                <Badge variant="secondary">Stokta Var</Badge>
              ) : (
                <Badge variant="destructive">Tükendi</Badge>
              )}
              {product.stock < 10 && product.stock > 0 && (
                <Badge variant="outline">Son {product.stock} adet</Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
            <p className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Ürün Özellikleri</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Soğuk sıkım, birinci kalite</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>%0.5&apos;den düşük asit oranı</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Cam şişede, ışık geçirmez ambalaj</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Katkısız, %100 doğal</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Laboratuvar testli</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="font-semibold mb-2">Ürün Açıklaması</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Add to Cart */}
          <AddToCartForm productId={product.id} inStock={product.stock > 0} />
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl mb-2">🚚</div>
            <h4 className="font-semibold mb-1">Ücretsiz Kargo</h4>
            <p className="text-sm text-gray-600">
              500 TL ve üzeri siparişlerde kargo bedava
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h4 className="font-semibold mb-1">Güvenli Ödeme</h4>
            <p className="text-sm text-gray-600">
              SSL sertifikalı güvenli ödeme altyapısı
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl mb-2">↩️</div>
            <h4 className="font-semibold mb-1">Kolay İade</h4>
            <p className="text-sm text-gray-600">
              14 gün içinde ücretsiz iade hakkı
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

