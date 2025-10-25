import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/money";
import Link from "next/link";
import { ShoppingCart, Package, Clock, CheckCircle, Truck, XCircle, AlertCircle } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-lg",
  PAID: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg",
  PROCESSING: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg",
  SHIPPED: "bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0 shadow-lg",
  DELIVERED: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg",
  FAILED: "bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-lg",
  CANCELLED: "bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0 shadow-lg",
  FULFILLED: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg",
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

const statusIcons: Record<string, any> = {
  PENDING: Clock,
  PAID: CheckCircle,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  FAILED: XCircle,
  CANCELLED: XCircle,
  FULFILLED: CheckCircle,
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 py-8 md:py-12 px-4 -mx-4 mb-8">
        {/* Animated Background Blobs */}
        <div className="absolute top-5 right-5 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-5 left-5 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
              <ShoppingCart className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">Sipariş Yönetimi</span>
            </div>
            
            {/* Icon */}
            <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/30">
              <Package className="h-7 w-7 text-white" />
            </div>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white leading-tight">
              Sipariş Yönetimi
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base text-white/90 font-medium max-w-2xl mx-auto">
              Tüm siparişleri görüntüle ve yönet
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {orders.length === 0 ? (
            <Card className="border-2 border-dashed border-green-200 shadow-lg shadow-green-500/10 bg-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
              <CardContent className="py-16 text-center">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200">
                  <ShoppingCart className="h-10 w-10 text-green-600" />
                </div>
                <p className="text-lg font-bold text-gray-800 mb-2">Henüz sipariş yok</p>
                <p className="text-gray-600">Müşteriler sipariş verdiğinde burada görünecek</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => {
                const StatusIcon = statusIcons[order.status];
                return (
                  <Link href={`/admin/orders/${order.id}`} key={order.id}>
                    <Card className="hover:shadow-xl transition-all duration-300 border-2 border-green-200 shadow-lg shadow-green-500/10 bg-white hover:shadow-2xl hover:border-green-300 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-700 transition-colors">
                                Sipariş #{order.id.slice(0, 8)}
                              </h3>
                              <Badge className={statusColors[order.status]}>
                                <StatusIcon className="w-3 h-3 mr-1" />
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
                            <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1 font-semibold">Müşteri</p>
                            <p className="font-medium text-gray-800">{order.shipping_name}</p>
                            <p className="text-gray-600">{order.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1 font-semibold">Ürünler</p>
                            <p className="font-medium text-gray-800">
                              {order.items.length} ürün (
                              {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                              adet)
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}