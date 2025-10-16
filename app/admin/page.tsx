import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/money";
import { Package, ShoppingCart, Tag, Users } from "lucide-react";

export default async function AdminDashboard() {
  // Get statistics
  const [productCount, orderCount, couponCount, userCount, totalRevenue] =
    await Promise.all([
      db.product.count(),
      db.order.count({ where: { status: "PAID" } }),
      db.coupon.count(),
      db.user.count(),
      db.order.aggregate({
        where: { status: "PAID" },
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

      {/* Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Toplam Gelir</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">
            {formatPrice(totalRevenue._sum.total || 0)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Tamamlanan siparişlerden elde edilen toplam gelir
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

