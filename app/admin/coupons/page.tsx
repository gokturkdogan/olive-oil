import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/money";

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Kupon Yönetimi</h2>
          <p className="text-gray-600">İndirim kuponlarını yönet</p>
        </div>
        <Button>Yeni Kupon Ekle</Button>
      </div>

      {coupons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Henüz kupon eklenmemiş.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {coupons.map((coupon) => {
            const isExpired = new Date() > coupon.ends_at;
            const isActive = coupon.active && !isExpired;

            return (
              <Card key={coupon.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-xl">
                          {coupon.code}
                        </h3>
                        {isActive ? (
                          <Badge variant="secondary">Aktif</Badge>
                        ) : (
                          <Badge variant="outline">
                            {isExpired ? "Süresi Dolmuş" : "Pasif"}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">İndirim:</span>{" "}
                          {coupon.type === "PERCENTAGE"
                            ? `%${coupon.value}`
                            : formatPrice(coupon.value)}
                        </p>
                        {coupon.min_order_amount && (
                          <p>
                            <span className="font-medium">Min. Tutar:</span>{" "}
                            {formatPrice(coupon.min_order_amount)}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Kullanım:</span>{" "}
                          {coupon.used_count}
                          {coupon.usage_limit &&
                            ` / ${coupon.usage_limit}`}
                        </p>
                        <p>
                          <span className="font-medium">Başlangıç:</span>{" "}
                          {new Date(coupon.starts_at).toLocaleDateString("tr-TR")}
                        </p>
                        <p>
                          <span className="font-medium">Bitiş:</span>{" "}
                          {new Date(coupon.ends_at).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <Button variant="outline" size="sm">
                        Düzenle
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

