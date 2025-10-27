import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/money";
import { Package, ShoppingCart, Tag, Users, Clock, TruckIcon, CheckCircle, XCircle, TrendingUp, BarChart3, Shield, Trash2, AlertTriangle } from "lucide-react";
import { PendingCleanupSection } from "@/components/admin/pending-cleanup-section";

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
    cancelledOrders,
    manualRefundOrders,
    oldPendingOrders,
  ] = await Promise.all([
    db.product.count(),
    db.order.count({ 
      where: { 
        status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] as const }
      } 
    }),
    db.coupon.count(),
    db.user.count(),
    // Tüm zamanlar - Ödeme alınmış tüm siparişler
    db.order.aggregate({
      where: { status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] as const } },
      _sum: { total: true },
    }),
    // Bu hafta
    db.order.aggregate({
      where: { 
        status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] as const },
        created_at: { gte: weekStart },
      },
      _sum: { total: true },
    }),
    // Bu ay
    db.order.aggregate({
      where: { 
        status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] as const },
        created_at: { gte: monthStart },
      },
      _sum: { total: true },
    }),
    // Bu yıl
    db.order.aggregate({
      where: { 
        status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] as const },
        created_at: { gte: yearStart },
      },
      _sum: { total: true },
    }),
    // Bekleyen siparişler (PENDING, CONFIRMED)
    db.order.count({
      where: { status: { in: ["PENDING", "CONFIRMED"] as const } }
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
    // Sadece CANCELLED siparişler
    db.order.count({
      where: { status: "CANCELLED" }
    }),
    // Manuel iade gereken siparişler (CANCELLED + refund_status = MANUAL_REQUIRED)
    db.order.count({
      where: { 
        status: "CANCELLED",
        refund_status: "MANUAL_REQUIRED"
      }
    }),
    // 30 dakikadan eski PENDING order'lar
    db.order.count({
      where: { 
        status: "PENDING",
        created_at: {
          lt: new Date(Date.now() - 30 * 60 * 1000) // 30 dakika önce
        }
      }
    }),
  ]);

  const stats = [
    {
      title: "Toplam Ürün",
      value: productCount,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
    },
    {
      title: "Ödemesi Alınan Siparişler",
      value: orderCount,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      borderColor: "border-green-200",
    },
    {
      title: "Aktif Kuponlar",
      value: couponCount,
      icon: Tag,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
    },
    {
      title: "Kayıtlı Kullanıcı",
      value: userCount,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 py-8 md:py-12 px-4">
        {/* Animated Background Blobs */}
        <div className="absolute top-5 right-5 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-5 left-5 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">Admin Panel</span>
            </div>
            
            {/* Icon */}
            <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/30">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white leading-tight">
              Genel Bakış
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base text-white/90 font-medium max-w-2xl mx-auto">
              E-ticaret platformunuzun özet bilgileri
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.title} className={`border-2 ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 ${stat.bgColor}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-semibold">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue Cards */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Gelir Raporları</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Haftalık Gelir */}
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-xl hover:border-blue-300 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-gray-700 font-semibold">Bu Hafta</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatPrice(weekRevenue._sum.total || 0)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Son 7 günlük gelir</p>
                </CardContent>
              </Card>

              {/* Aylık Gelir */}
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-gray-700 font-semibold">Bu Ay</CardTitle>
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
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-xl hover:border-purple-300 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-gray-700 font-semibold">Bu Yıl</CardTitle>
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
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-gray-700 font-semibold">Tüm Zamanlar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    {formatPrice(totalRevenue._sum.total || 0)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Toplam gelir</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Order Status Breakdown */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Sipariş Durumu</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Bekleyen Siparişler */}
              <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white hover:shadow-xl hover:border-yellow-300 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-3 rounded-xl border border-yellow-200">
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-lg px-3 py-1 rounded-full font-bold">
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
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-xl hover:border-blue-300 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-xl border border-blue-200">
                      <TruckIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg px-3 py-1 rounded-full font-bold">
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
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl border border-green-200">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg px-3 py-1 rounded-full font-bold">
                      {completedOrders}
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">Tamamlandı</h4>
                  <p className="text-xs text-gray-600">
                    Başarıyla teslim edildi
                  </p>
                </CardContent>
              </Card>

              {/* İptal Edilen */}
              <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white hover:shadow-xl hover:border-red-300 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-r from-red-100 to-rose-100 p-3 rounded-xl border border-red-200">
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-lg px-3 py-1 rounded-full font-bold">
                      {cancelledOrders}
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">İptal Edilen</h4>
                  <p className="text-xs text-gray-600">
                    Kullanıcı tarafından iptal edildi
                  </p>
                </CardContent>
              </Card>

              {/* Manuel İade Gereken */}
              {manualRefundOrders > 0 && (
                <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:shadow-xl hover:border-orange-300 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-3 rounded-xl border border-orange-200">
                        <AlertTriangle className="h-8 w-8 text-orange-600" />
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg px-3 py-1 rounded-full font-bold">
                        {manualRefundOrders}
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Manuel İade</h4>
                    <p className="text-xs text-gray-600">
                      Otomatik iade yapılamadı
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* PENDING Order Cleanup Section */}
          <PendingCleanupSection oldPendingOrders={oldPendingOrders} />
        </div>
      </div>
    </div>
  );
}