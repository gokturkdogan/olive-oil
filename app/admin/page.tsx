import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/money";
import { Package, ShoppingCart, Tag, Users } from "lucide-react";

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
  ] = await Promise.all([
    db.product.count(),
    db.order.count({ where: { status: "PAID" } }),
    db.coupon.count(),
    db.user.count(),
    // Tüm zamanlar
    db.order.aggregate({
      where: { status: "PAID" },
      _sum: { total: true },
    }),
    // Bu hafta
    db.order.aggregate({
      where: { 
        status: "PAID",
        created_at: { gte: weekStart },
      },
      _sum: { total: true },
    }),
    // Bu ay
    db.order.aggregate({
      where: { 
        status: "PAID",
        created_at: { gte: monthStart },
      },
      _sum: { total: true },
    }),
    // Bu yıl
    db.order.aggregate({
      where: { 
        status: "PAID",
        created_at: { gte: yearStart },
      },
      _sum: { total: true },
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
      title: "Tamamlanan Siparişler",
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
    </div>
  );
}

