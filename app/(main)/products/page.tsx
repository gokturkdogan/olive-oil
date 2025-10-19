import { getProducts } from "@/actions/products";
import { ProductCard } from "@/components/product-card";

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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

