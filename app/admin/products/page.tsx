import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/money";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Ürün Yönetimi</h2>
          <p className="text-gray-600">Ürünleri görüntüle ve düzenle</p>
        </div>
        <Button>Yeni Ürün Ekle</Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Henüz ürün eklenmemiş.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-100 to-green-50 rounded h-16 w-16 flex items-center justify-center">
                      <span className="text-2xl">🫒</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          {product.title}
                        </h3>
                        {product.active ? (
                          <Badge variant="secondary">Aktif</Badge>
                        ) : (
                          <Badge variant="outline">Pasif</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Slug: {product.slug}
                      </p>
                      <p className="text-sm text-gray-600">
                        Stok: {product.stock} adet
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary mb-2">
                      {formatPrice(product.price)}
                    </p>
                    <Button variant="outline" size="sm">
                      Düzenle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

