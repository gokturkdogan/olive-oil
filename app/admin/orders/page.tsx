import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/money";
import Link from "next/link";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  FULFILLED: "bg-green-100 text-green-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "Ödeme Bekleniyor",
  PAID: "Sipariş Alındı",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  FAILED: "Başarısız",
  CANCELLED: "İptal Edildi",
  FULFILLED: "Tamamlandı",
};

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { created_at: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Sipariş Yönetimi</h2>
        <p className="text-gray-600">Tüm siparişleri görüntüle ve yönet</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Henüz sipariş yok.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Link href={`/admin/orders/${order.id}`} key={order.id}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">
                          Sipariş #{order.id.slice(0, 8)}
                        </h3>
                        <Badge
                          className={statusColors[order.status]}
                          variant="outline"
                        >
                          {statusLabels[order.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4 grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Müşteri</p>
                      <p className="font-medium">{order.shipping_name}</p>
                      <p className="text-gray-600">{order.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Ürünler</p>
                      <p className="font-medium">
                        {order.items.length} ürün (
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                        adet)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

