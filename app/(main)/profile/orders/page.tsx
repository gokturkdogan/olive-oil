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
                <OrderCard
                  key={order.id}
                  order={order}
                  statusColors={statusColors}
                  statusLabels={statusLabels}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

