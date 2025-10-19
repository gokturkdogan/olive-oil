import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/money";
import { UpdateShippingForm } from "@/components/admin/update-shipping-form";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";
import { LOYALTY_LABELS, LOYALTY_COLORS } from "@/lib/loyalty";
import { Star, Award, Gem, Crown } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  FULFILLED: "bg-green-100 text-green-800",
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

// Helper function to get tier icon component
function getTierIcon(tier: keyof typeof LOYALTY_LABELS, className?: string) {
  const iconProps = { className: className || "h-4 w-4" };
  switch (tier) {
    case "DIAMOND":
      return <Crown {...iconProps} />;
    case "PLATINUM":
      return <Gem {...iconProps} />;
    case "GOLD":
      return <Award {...iconProps} />;
    default:
      return <Star {...iconProps} />;
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Sipariş Detayı</h2>
          <p className="text-gray-600">#{order.id}</p>
        </div>
        <Badge
          className={statusColors[order.status]}
          variant="outline"
        >
          {statusLabels[order.status]}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Info */}
        <Card>
          <CardHeader>
            <CardTitle>Sipariş Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Sipariş Tarihi:</span>
              <span className="font-medium">
                {new Date(order.created_at).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ara Toplam:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount_total > 0 && (
              <div className="flex justify-between text-green-600">
                <span>İndirim:</span>
                <span>-{formatPrice(order.discount_total)}</span>
              </div>
            )}
            {order.coupon_code && (
              <div className="flex justify-between">
                <span className="text-gray-600">Kupon:</span>
                <span className="font-medium">{order.coupon_code}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Kargo:</span>
              <span>
                {order.shipping_fee === 0
                  ? "Ücretsiz"
                  : formatPrice(order.shipping_fee)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Toplam:</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Müşteri Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="text-gray-600">Ad Soyad</p>
              <p className="font-medium">{order.shipping_name}</p>
            </div>
            <div>
              <p className="text-gray-600">E-posta</p>
              <p className="font-medium">{order.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Telefon</p>
              <p className="font-medium">{order.shipping_phone}</p>
            </div>
            {order.user && (
              <div>
                <p className="text-gray-600 mb-1">Müşteri Seviyesi</p>
                <Badge className={`${LOYALTY_COLORS[order.user.loyalty_tier as keyof typeof LOYALTY_LABELS]} flex items-center gap-2 w-fit`}>
                  {getTierIcon(order.user.loyalty_tier as keyof typeof LOYALTY_LABELS, "h-4 w-4")}
                  {LOYALTY_LABELS[order.user.loyalty_tier as keyof typeof LOYALTY_LABELS]}
                </Badge>
              </div>
            )}
            <div>
              <p className="text-gray-600">Teslimat Adresi</p>
              <p className="font-medium">
                {order.shipping_address_line1}
                {order.shipping_address_line2 && `, ${order.shipping_address_line2}`}
                <br />
                {order.district}, {order.city} {order.postal_code}
                <br />
                {order.country}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Sipariş Ürünleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-100 to-green-50 rounded h-12 w-12 flex items-center justify-center">
                    <span className="text-xl">🫒</span>
                  </div>
                  <div>
                    <p className="font-medium">{item.title_snapshot}</p>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.unit_price_snapshot)} x {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">{formatPrice(item.line_total)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout for Status and Shipping */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Status Management */}
        {order.status !== "FAILED" && (
          <Card>
            <CardHeader>
              <CardTitle>Sipariş Durumu Yönetimi</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusUpdater orderId={id} currentStatus={order.status} />
            </CardContent>
          </Card>
        )}

        {/* Shipping Info - Available for all active orders */}
        {order.status !== "FAILED" && order.status !== "CANCELLED" && order.status !== "PENDING" && (
          <Card>
            <CardHeader>
              <CardTitle>Kargo Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateShippingForm
                orderId={id}
                shippingProvider={order.shipping_provider || ""}
                trackingCode={order.tracking_code || ""}
              />
              
              {/* Show current shipping info if exists */}
              {(order.shipping_provider || order.tracking_code) && (
                <div className="mt-6 pt-6 border-t space-y-3">
                  <p className="text-sm font-medium text-gray-700">Mevcut Kargo Bilgileri</p>
                  <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                    {order.shipping_provider && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Kargo Şirketi:</span>
                        <span className="text-sm font-medium">{order.shipping_provider}</span>
                      </div>
                    )}
                    {order.tracking_code && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Takip Kodu:</span>
                        <span className="text-sm font-medium font-mono bg-white px-2 py-1 rounded">
                          {order.tracking_code}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

