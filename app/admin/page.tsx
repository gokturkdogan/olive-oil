import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/money";
import { Package, ShoppingCart, Tag, Users, Clock, TruckIcon, CheckCircle, XCircle } from "lucide-react";

export default async function AdminDashboard() {
  const now = new Date();
  
  // Tarih aralıkları
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  // Get statistics
  const [
    productCount, 
    orderCount, 
    couponCount, 
    userCount, 
    totalRevenue,
    weekRevenue,
    monthRevenue,
    yearRevenue,
    pendingOrders,
    activeOrders,
    completedOrders,
    failedOrders,
  ] = await Promise.all([
    db.product.count(),
    db.order.count({ 
      where: { 
        status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const }
      } 
    }),
    db.coupon.count(),
    db.user.count(),
    // Tüm zamanlar - Ödeme alınmış tüm siparişler
    db.order.aggregate({
      where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const } },
      _sum: { total: true },
    }),
    // Bu hafta
    db.order.aggregate({
      where: { 
        status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const },
        created_at: { gte: weekStart },
      },
      _sum: { total: true },
    }),
    // Bu ay
    db.order.aggregate({
      where: { 
        status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const },
        created_at: { gte: monthStart },
      },
      _sum: { total: true },
    }),
    // Bu yıl
    db.order.aggregate({
      where: { 
        status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const },
        created_at: { gte: yearStart },
      },
      _sum: { total: true },
    }),
    // Bekleyen siparişler (PENDING, PAID)
    db.order.count({
      where: { status: { in: ["PENDING", "PAID"] as const } }
    }),
    // Aktif siparişler (PROCESSING, SHIPPED)
    db.order.count({
      where: { status: { in: ["PROCESSING", "SHIPPED"] as const } }
    }),
    // Tamamlanan (DELIVERED)
    db.order.count({
      where: { status: "DELIVERED" }
    }),
    // İptal/Başarısız (CANCELLED, FAILED)
    db.order.count({
      where: { status: { in: ["CANCELLED", "FAILED"] as const } }
    }),
  ]);

  const stats = [
    {
      title: "Toplam Ürün",
      value: productCount,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Başarılı Siparişler",
      value: orderCount,
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Aktif Kuponlar",
      value: couponCount,
      icon: Tag,
      color: "text-purple-600",
    },
    {
      title: "Kayıtlı Kullanıcı",
      value: userCount,
      icon: Users,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Genel Bakış</h2>
        <p className="text-gray-600">E-ticaret platformunuzun özet bilgileri</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-10 w-10 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Cards */}
      <div>
        <h3 className="text-xl font-bold mb-4">Gelir Raporları</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Haftalık Gelir */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-gray-700">Bu Hafta</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {formatPrice(weekRevenue._sum.total || 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">Son 7 günlük gelir</p>
            </CardContent>
          </Card>

          {/* Aylık Gelir */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-gray-700">Bu Ay</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {formatPrice(monthRevenue._sum.total || 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {new Date().toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
              </p>
            </CardContent>
          </Card>

          {/* Yıllık Gelir */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-gray-700">Bu Yıl</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">
                {formatPrice(yearRevenue._sum.total || 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {new Date().getFullYear()} yılı geliri
              </p>
            </CardContent>
          </Card>

          {/* Toplam Gelir */}
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-white hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-gray-700">Tüm Zamanlar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {formatPrice(totalRevenue._sum.total || 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">Toplam gelir</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div>
        <h3 className="text-xl font-bold mb-4">Sipariş Durumu</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Bekleyen Siparişler */}
          <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="h-10 w-10 text-yellow-600" />
                <div className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1 rounded-full font-bold">
                  {pendingOrders}
                </div>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Bekleyen</h4>
              <p className="text-xs text-gray-600">
                Ödeme bekleniyor veya sipariş alındı
              </p>
            </CardContent>
          </Card>

          {/* Aktif Siparişler */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <TruckIcon className="h-10 w-10 text-blue-600" />
                <div className="bg-blue-100 text-blue-800 text-lg px-3 py-1 rounded-full font-bold">
                  {activeOrders}
                </div>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Aktif</h4>
              <p className="text-xs text-gray-600">
                Hazırlanıyor veya kargoda
              </p>
            </CardContent>
          </Card>

          {/* Tamamlanan Siparişler */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
                <div className="bg-green-100 text-green-800 text-lg px-3 py-1 rounded-full font-bold">
                  {completedOrders}
                </div>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">Tamamlandı</h4>
              <p className="text-xs text-gray-600">
                Başarıyla teslim edildi
              </p>
            </CardContent>
          </Card>

          {/* İptal/Başarısız */}
          <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <XCircle className="h-10 w-10 text-red-600" />
                <div className="bg-red-100 text-red-800 text-lg px-3 py-1 rounded-full font-bold">
                  {failedOrders}
                </div>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">İptal/Başarısız</h4>
              <p className="text-xs text-gray-600">
                İptal edildi veya başarısız oldu
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

