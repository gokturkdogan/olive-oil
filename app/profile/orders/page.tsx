import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/money";
import { Package, ShoppingBag, Calendar, Truck, CheckCircle } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-olive-gradient-soft to-white">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-olive-gradient-soft py-12 md:py-16 lg:py-20 px-4 border-b border-primary/10">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-52 h-52 md:w-80 md:h-80 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="bg-white/90 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl border-2 border-primary/20">
            <ShoppingBag className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-gray-900 leading-tight">
            Siparişlerim
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Sipariş geçmişinizi ve durumlarını takip edin
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
          {orders.length === 0 ? (
            <Card className="border-2 border-primary/20 shadow-xl">
              <CardContent className="py-12 md:py-16 text-center">
                <div className="bg-primary/10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                </div>
                <p className="text-lg md:text-xl text-gray-700 mb-2 font-semibold">Henüz siparişiniz yok</p>
                <p className="text-sm md:text-base text-gray-500 mb-6">
                  Hemen alışverişe başlayın ve ilk siparişinizi verin
                </p>
                <Link href="/products">
                  <Button className="bg-olive-gradient hover:opacity-90 shadow-lg hover:shadow-xl transition-all">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Alışverişe Başla
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="border-2 border-primary/15 shadow-md hover:border-primary/40 hover:shadow-2xl transition-all duration-300 overflow-hidden backdrop-blur-sm bg-white/95">
                  <CardContent className="p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 md:gap-4 mb-4 md:mb-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-3">
                          <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
                            <Package className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                            Sipariş #{order.id.slice(0, 8).toUpperCase()}
                          </h3>
                          <Badge
                            className={statusColors[order.status]}
                            variant="outline"
                          >
                            {statusLabels[order.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                          {new Date(order.created_at).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs md:text-sm text-gray-600 mb-1">Toplam Tutar</p>
                        <p className="text-2xl md:text-3xl font-bold text-gradient">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-primary/10 pt-4 space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 p-3 bg-olive-gradient-soft rounded-xl hover:bg-primary/10 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="bg-white rounded-lg h-12 w-12 md:h-14 md:w-14 flex items-center justify-center flex-shrink-0 shadow-md">
                              <span className="text-2xl md:text-3xl">🫒</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm md:text-base text-gray-900 truncate">{item.title_snapshot}</p>
                              <p className="text-xs md:text-sm text-gray-600">
                                {item.quantity} adet × {formatPrice(item.unit_price_snapshot)}
                              </p>
                            </div>
                          </div>
                          <p className="font-bold text-sm md:text-base text-primary flex-shrink-0">
                            {formatPrice(item.line_total)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Info */}
                    {order.tracking_code && (
                      <div className="border-t border-primary/10 mt-4 md:mt-6 pt-4">
                        <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-xl border border-primary/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Truck className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                            <p className="text-sm md:text-base font-semibold text-gray-900">Kargo Bilgileri</p>
                          </div>
                          <p className="text-xs md:text-sm text-gray-700">
                            <span className="font-medium">{order.shipping_provider}</span> 
                            <span className="mx-2">•</span>
                            <span className="font-mono">{order.tracking_code}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

