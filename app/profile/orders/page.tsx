import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/money";
import { Package } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
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

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orders = await db.order.findMany({
    where: { user_id: session.user.id },
    orderBy: { created_at: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Siparişlerim</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-4">Henüz siparişiniz yok.</p>
              <Link href="/products">
                <Button>Alışverişe Başla</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
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
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(order.total)}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-4 space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded h-10 w-10 flex items-center justify-center">
                            <span className="text-lg">🫒</span>
                          </div>
                          <div>
                            <p className="font-medium">{item.title_snapshot}</p>
                            <p className="text-gray-600">
                              {item.quantity} adet
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          {formatPrice(item.line_total)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  {order.tracking_code && (
                    <div className="border-t mt-4 pt-4">
                      <p className="text-sm text-gray-600 mb-1">Kargo Takip</p>
                      <p className="font-medium">
                        {order.shipping_provider} - {order.tracking_code}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

