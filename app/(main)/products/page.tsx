import Link from "next/link";
import { getProducts } from "@/actions/products";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/money";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Ürünlerimiz</h1>
        <p className="text-gray-600">
          Premium kalitede sızma zeytinyağı ürünlerimizi keşfedin
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Henüz ürün bulunmamaktadır.</p>
          <p className="text-sm text-gray-400">
            Yakında yeni ürünler eklenecektir.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link href={`/products/${product.slug}`} key={product.id}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <div className="bg-gradient-to-br from-green-100 to-green-50 h-64 flex items-center justify-center rounded-t-lg">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🫒</div>
                    <p className="text-sm text-gray-600">{product.title}</p>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{product.title}</h3>
                    {product.stock > 0 ? (
                      <Badge variant="secondary">Stokta</Badge>
                    ) : (
                      <Badge variant="destructive">Tükendi</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled={product.stock === 0}>
                    {product.stock > 0 ? "Sepete Ekle" : "Stokta Yok"}
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

