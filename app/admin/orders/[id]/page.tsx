import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/money";
import { UpdateShippingForm } from "@/components/admin/update-shipping-form";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";
import { LOYALTY_LABELS, LOYALTY_COLORS } from "@/lib/loyalty";
import { Star, Award, Gem, Crown, Package, User, MapPin, Clock, CheckCircle, Truck, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

  const StatusIcon = statusIcons[order.status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 py-8 md:py-12 px-4 -mx-4 mb-8">
        {/* Animated Background Blobs */}
        <div className="absolute top-5 right-5 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-5 left-5 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link 
              href="/admin/orders"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Siparişlere Dön</span>
            </Link>

            <div className="flex items-center justify-between">
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
                  <Package className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-semibold">Sipariş Detayı</span>
                </div>
                
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white leading-tight">
                  Sipariş #{order.id.slice(0, 8)}
                </h1>
                
                {/* Subtitle */}
                <p className="text-sm sm:text-base text-white/90 font-medium">
                  {new Date(order.created_at).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              
              {/* Status Badge */}
              <Badge className={statusColors[order.status]}>
                <StatusIcon className="w-4 h-4 mr-2" />
                {statusLabels[order.status]}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Order Info */}
            <Card className="border-2 border-green-200 shadow-lg shadow-green-500/10 bg-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
              <CardHeader className="bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  Sipariş Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-semibold">Sipariş Tarihi:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(order.created_at).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-semibold">Ara Toplam:</span>
                  <span className="font-medium text-gray-800">{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount_total > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-100 text-green-600">
                    <span className="font-semibold">İndirim:</span>
                    <span className="font-medium">-{formatPrice(order.discount_total)}</span>
                  </div>
                )}
                {order.coupon_code && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-semibold">Kupon:</span>
                    <span className="font-medium text-gray-800">{order.coupon_code}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-semibold">Kargo:</span>
                  <span className="font-medium text-gray-800">
                    {order.shipping_fee === 0
                      ? "Ücretsiz"
                      : formatPrice(order.shipping_fee)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 text-lg font-bold">
                  <span className="text-gray-800">Toplam:</span>
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card className="border-2 border-green-200 shadow-lg shadow-green-500/10 bg-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
              <CardHeader className="bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Müşteri Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="py-2 border-b border-gray-100">
                  <p className="text-gray-600 font-semibold mb-1">Ad Soyad</p>
                  <p className="font-medium text-gray-800">{order.shipping_name}</p>
                </div>
                <div className="py-2 border-b border-gray-100">
                  <p className="text-gray-600 font-semibold mb-1">E-posta</p>
                  <p className="font-medium text-gray-800">{order.email}</p>
                </div>
                <div className="py-2 border-b border-gray-100">
                  <p className="text-gray-600 font-semibold mb-1">Telefon</p>
                  <p className="font-medium text-gray-800">{order.shipping_phone}</p>
                </div>
                {order.user && (
                  <div className="py-2 border-b border-gray-100">
                    <p className="text-gray-600 font-semibold mb-2">Müşteri Seviyesi</p>
                    <Badge className={`${LOYALTY_COLORS[order.user.loyalty_tier as keyof typeof LOYALTY_LABELS]} flex items-center gap-2 w-fit`}>
                      {getTierIcon(order.user.loyalty_tier as keyof typeof LOYALTY_LABELS, "h-4 w-4")}
                      {LOYALTY_LABELS[order.user.loyalty_tier as keyof typeof LOYALTY_LABELS]}
                    </Badge>
                  </div>
                )}
                <div className="py-2">
                  <p className="text-gray-600 font-semibold mb-1">Teslimat Adresi</p>
                  <p className="font-medium text-gray-800">
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
          <Card className="border-2 border-green-200 shadow-lg shadow-green-500/10 bg-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
            <CardHeader className="bg-gradient-to-br from-green-50/50 to-emerald-50/50">
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Sipariş Ürünleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl h-12 w-12 flex items-center justify-center border-2 border-green-200">
                        <Package className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{item.title_snapshot}</p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.unit_price_snapshot)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-green-600">{formatPrice(item.line_total)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Two Column Layout for Status and Shipping */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Order Status Management */}
            {order.status !== "FAILED" && (
              <Card className="border-2 border-green-200 shadow-lg shadow-green-500/10 bg-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
                <CardHeader className="bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Sipariş Durumu Yönetimi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderStatusUpdater orderId={id} currentStatus={order.status} />
                </CardContent>
              </Card>
            )}

            {/* Shipping Info - Available for all active orders */}
            {order.status !== "FAILED" && order.status !== "CANCELLED" && order.status !== "PENDING" && (
              <Card className="border-2 border-green-200 shadow-lg shadow-green-500/10 bg-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
                <CardHeader className="bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    Kargo Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UpdateShippingForm
                    orderId={id}
                    shippingProvider={order.shipping_provider || ""}
                    trackingCode={order.tracking_code || ""}
                  />
                  
                  {/* Show current shipping info if exists */}
                  {(order.shipping_provider || order.tracking_code) && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                      <p className="text-sm font-semibold text-gray-700">Mevcut Kargo Bilgileri</p>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 space-y-2 border border-green-200">
                        {order.shipping_provider && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 font-semibold">Kargo Şirketi:</span>
                            <span className="text-sm font-medium text-gray-800">{order.shipping_provider}</span>
                          </div>
                        )}
                        {order.tracking_code && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 font-semibold">Takip Kodu:</span>
                            <span className="text-sm font-medium font-mono bg-white px-3 py-1 rounded-lg border border-green-200 text-gray-800">
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
      </div>
    </div>
  );
}