import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/order-card";
import { Package, ShoppingBag } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "Sipariş Alındı",
  CONFIRMED: "Onaylandı",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  FAILED: "Başarısız",
  CANCELLED: "İptal Edildi",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orders = await db.order.findMany({
    where: { user_id: session.user.id },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      status: true,
      payment_status: true,
      payment_provider: true,
      created_at: true,
      total: true,
      subtotal: true,
      discount_total: true,
      shipping_fee: true,
      shipping_name: true,
      shipping_address_line1: true,
      shipping_address_line2: true,
      city: true,
      district: true,
      postal_code: true,
      country: true,
      tracking_code: true,
      shipping_provider: true,
      coupon_code: true,
      refund_status: true,
      items: {
        select: {
          id: true,
          title_snapshot: true,
          quantity: true,
          unit_price_snapshot: true,
          line_total: true,
          image_url: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Banner - Modern & Dynamic */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50/50 to-white py-12 md:py-16 px-4 mb-8">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-gradient-to-br from-green-300/20 to-emerald-300/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-gradient-to-tr from-emerald-300/15 to-lime-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          {/* Icon */}
          <div className="mb-6 inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur-lg opacity-40"></div>
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-2xl shadow-xl">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Siparişlerim
          </h1>
          
          {/* Stats - Beautiful */}
          {orders.length > 0 && (
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-5 py-2.5 shadow-xl border-2 border-green-200">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-white font-black text-sm">{orders.length}</span>
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {orders.length === 1 ? 'sipariş' : 'sipariş'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto">

        {/* Content */}
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="relative mb-6 inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-10 shadow-lg">
                <Package className="h-16 w-16 text-green-600 mx-auto" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Henüz Siparişiniz Yok</h2>
            <p className="text-sm text-gray-600 mb-6">
              Premium zeytinyağı ürünlerimizi keşfetmeye başlayın
            </p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Alışverişe Başla
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <OrderCard
                  order={order}
                  statusColors={statusColors}
                  statusLabels={statusLabels}
                />
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

