import { db } from "@/lib/db";
import { ProductList } from "@/components/admin/product-list";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gradient">Ürün Yönetimi</h2>
          <p className="text-gray-600 mt-1">Ürünleri görüntüle, düzenle ve yönet</p>
        </div>
      </div>

      <ProductList products={products} />
    </div>
  );
}
