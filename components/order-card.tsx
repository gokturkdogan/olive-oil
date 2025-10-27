"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/money";
import { Package, Calendar, ChevronDown, ChevronUp, MapPin, CreditCard, Truck, XCircle, AlertTriangle, CheckCircle, Clock, RefreshCw, Phone, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cancelOrder } from "@/actions/orders";

interface OrderCardProps {
  order: {
    id: string;
    status: string;
    payment_status?: string | null;
    payment_provider?: string | null;
    created_at: Date;
    total: number;
    subtotal: number;
    discount_total: number;
    shipping_fee: number;
    shipping_name: string;
    shipping_address_line1: string;
    shipping_address_line2: string | null;
    city: string;
    district: string;
    postal_code: string;
    country: string;
    tracking_code: string | null;
    shipping_provider: string | null;
    coupon_code: string | null;
    refund_status: string | null;
    items: Array<{
      id: string;
      title_snapshot: string;
      quantity: number;
      unit_price_snapshot: number;
      line_total: number;
      image_url: string | null;
    }>;
  };
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
}

export function OrderCard({ order, statusColors, statusLabels }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [paymentMethodInfo, setPaymentMethodInfo] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch payment method info if bank transfer
  useEffect(() => {
    if (
      isExpanded &&
      order.payment_provider === "BANK_TRANSFER" &&
      order.payment_status === "PENDING"
    ) {
      // Fetch active bank transfer payment method
      fetch("/api/payment-methods?type=BANK_TRANSFER")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.paymentMethods?.length > 0) {
            setPaymentMethodInfo(data.paymentMethods[0]);
          }
        })
        .catch((err) => console.error("Payment method fetch error:", err));
    }
  }, [isExpanded, order.payment_provider, order.payment_status]);

  // Payment status colors and labels
  const paymentStatusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  const paymentStatusLabels: Record<string, string> = {
    PENDING: "Ödeme Bekleniyor",
    PAID: "Ödendi",
    FAILED: "Ödeme Başarısız",
    CANCELLED: "İptal Edildi",
  };

  // Check if order can be cancelled
  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED" || order.status === "PROCESSING";

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    
    try {
      const result = await cancelOrder(order.id);
      
      if (result.success) {
        toast({
          title: "Başarılı! ✓",
          description: result.message || "Sipariş başarıyla iptal edildi",
          variant: result.requiresManualRefund ? "default" : "success",
        });
        
        // Refresh the page to show updated status
        router.refresh();
      } else {
        toast({
          title: "Hata",
          description: result.error || "Sipariş iptal edilemedi",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      toast({
        title: "Hata",
        description: "Sipariş iptal edilemedi",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
      setShowCancelDialog(false);
    }
  };

  return (
    <Card className="border-2 border-gray-200 hover:border-green-300 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
      <CardContent className="p-0">
        {/* Header - Always Visible */}
        <div 
          className="cursor-pointer p-4 md:p-5 hover:bg-gray-50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2.5 rounded-xl">
                <Package className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-base text-gray-900">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-xs text-gray-600">
                  {new Date(order.created_at).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Order Status Badge */}
              <Badge className={statusColors[order.status]} variant="outline">
                {statusLabels[order.status]}
              </Badge>
              {/* Payment Status Badge */}
              {order.payment_status && (
                <Badge className={paymentStatusColors[order.payment_status] || "bg-gray-100 text-gray-800"} variant="outline">
                  {paymentStatusLabels[order.payment_status] || order.payment_status}
                </Badge>
              )}
              <button className="p-1.5 hover:bg-white rounded-lg transition-all">
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-green-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-green-600" />
                )}
              </button>
            </div>
          </div>

          {/* Summary Row */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {order.items.length} ürün
            </p>
            <p className="text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {formatPrice(order.total)}
            </p>
          </div>
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="bg-gray-50 p-4 md:p-5 space-y-4 animate-fadeInUp">
            {/* Products */}
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3">Siparişiniz:</p>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title_snapshot}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">
                          {item.title_snapshot}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.quantity} adet
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-sm text-green-700">
                      {formatPrice(item.line_total)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Details */}
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3">Fiyat Detayları:</p>
              <div className="space-y-2">
                {/* Subtotal */}
                <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-200">
                  <span className="text-sm text-gray-700">Ürünler Toplamı</span>
                  <span className="font-bold text-sm text-gray-900">{formatPrice(order.subtotal)}</span>
                </div>

                {/* Discount */}
                {order.discount_total > 0 && (
                  <div className="flex items-center justify-between bg-green-50 rounded-xl p-3 border border-green-200">
                    <span className="text-sm text-green-800">Sadakat İndirimi</span>
                    <span className="font-bold text-sm text-green-700">-{formatPrice(order.discount_total)}</span>
                  </div>
                )}

                {/* Shipping */}
                <div className={`flex items-center justify-between rounded-xl p-3 border ${
                  order.shipping_fee === 0 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Truck className={`h-3.5 w-3.5 ${order.shipping_fee === 0 ? 'text-green-600' : 'text-gray-600'}`} />
                    <span className={`text-sm ${order.shipping_fee === 0 ? 'text-green-800' : 'text-gray-700'}`}>
                      Kargo Ücreti
                    </span>
                  </div>
                  <span className={`font-bold text-sm ${order.shipping_fee === 0 ? 'text-green-700' : 'text-gray-900'}`}>
                    {order.shipping_fee === 0 ? 'Ücretsiz' : formatPrice(order.shipping_fee)}
                  </span>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 shadow-md">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-sm font-semibold">Ödediğiniz Tutar</span>
                    <span className="text-2xl font-black">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
              <div className="flex items-start gap-2.5 mb-3">
                <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 mb-1">Teslimat Adresi</p>
                  <p className="font-bold text-sm text-gray-900">{order.shipping_name}</p>
                  <p className="text-xs text-gray-700 mt-1">
                    {order.shipping_address_line1}, {order.district}, {order.city}
                  </p>
                </div>
              </div>

              {order.tracking_code && (
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4 text-green-600" />
                    <p className="text-xs text-gray-600">Kargo Takip</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{order.shipping_provider}</p>
                  <p className="font-mono bg-gray-100 px-3 py-2 rounded-lg text-xs text-gray-700">
                    {order.tracking_code}
                  </p>
                </div>
              )}
            </div>

            {/* Bank Transfer Payment Info */}
            {order.payment_provider === "BANK_TRANSFER" && order.payment_status === "PENDING" && paymentMethodInfo && (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border-2 border-yellow-300 shadow-lg">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-gradient-to-r from-yellow-600 to-amber-600 p-2.5 rounded-xl shadow-lg">
                    <Info className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-yellow-900 mb-1">Ödeme Yapmanız Gerekiyor</h3>
                    <p className="text-sm text-yellow-800">
                      Siparişiniz onaylanması için aşağıdaki bilgilerle havaleyi yapmanız gerekmektedir.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-yellow-200 space-y-3">
                  {paymentMethodInfo.payment_info && typeof paymentMethodInfo.payment_info === 'object' && Array.isArray(paymentMethodInfo.payment_info) && paymentMethodInfo.payment_info.map((info: any, index: number) => (
                    <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                      <span className="text-sm text-gray-600 font-semibold">{info.label}:</span>
                      <span className="text-sm font-bold text-gray-900 font-mono">{info.value}</span>
                    </div>
                  ))}
                  
                  <div className="mt-4 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <p className="text-xs text-yellow-800 font-semibold flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Ödemeyi yaptıktan sonra siparişiniz onaylanacak ve kargoya verilecektir.
                    </p>
                  </div>
                </div>
              </div>
            )}

        {/* Refund Information for Cancelled Orders */}
        {order.status === "CANCELLED" && (
          <div className={`rounded-xl p-4 border-2 mb-4 ${
            order.refund_status === "MANUAL_REQUIRED" 
              ? "bg-orange-50 border-orange-200" 
              : "bg-blue-50 border-blue-200"
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl ${
                order.refund_status === "MANUAL_REQUIRED"
                  ? "bg-gradient-to-r from-orange-100 to-amber-100" 
                  : "bg-gradient-to-r from-blue-100 to-indigo-100"
              }`}>
                <CreditCard className={`h-5 w-5 ${
                  order.refund_status === "MANUAL_REQUIRED" ? "text-orange-600" : "text-blue-600"
                }`} />
              </div>
              <div>
                <h4 className={`text-sm font-semibold mb-2 ${
                  order.refund_status === "MANUAL_REQUIRED" ? "text-orange-800" : "text-blue-800"
                }`}>
                  Para İadesi Bilgisi
                </h4>
                <div className={`space-y-2 text-xs ${
                  order.refund_status === "MANUAL_REQUIRED" ? "text-orange-700" : "text-blue-700"
                }`}>
                  {order.refund_status === "MANUAL_REQUIRED" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                        <p>İade işlemi sırasında teknik sorun oluştu.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <p>Paranız <strong>1-3 iş günü</strong> içinde hesabınıza iade edilecektir.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-3 w-3 flex-shrink-0" />
                        <p>İade işlemi manuel olarak gerçekleştirilecektir.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <p>Sorularınız için müşteri hizmetlerimizle iletişime geçebilirsiniz.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 flex-shrink-0" />
                        <p>Para iadeniz ödeme yaptığınız kartınıza gönderilmiştir.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <p>Bankanıza göre <strong>1-3 iş günü</strong> içinde hesabınıza yansıyabilir.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-3 w-3 flex-shrink-0" />
                        <p>İade işlemi otomatik olarak gerçekleştirilmiştir.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <p>Sorularınız için müşteri hizmetlerimizle iletişime geçebilirsiniz.</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Order Button */}
        {canCancel && (
          <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800 mb-1">Siparişi İptal Et</p>
                <p className="text-xs text-red-700">
                  Bu sipariş henüz kargoya verilmedi. İptal edebilirsiniz.
                </p>
              </div>
            </div>
                
                <Button
                  onClick={() => setShowCancelDialog(true)}
                  disabled={isCancelling}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 font-semibold"
                >
                  {isCancelling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      İptal Ediliyor...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Siparişi İptal Et
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border-2 border-red-200 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-red-100 to-rose-100 p-2 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Siparişi İptal Et</h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                Bu siparişi iptal etmek istediğinizden emin misiniz? 
                {order.payment_status === "PAID" && " Ödeme yapılmışsa, paranız iade edilecektir."}
              </p>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowCancelDialog(false)}
                  variant="outline"
                  className="flex-1 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-800 transition-all duration-300"
                >
                  Vazgeç
                </Button>
                <Button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 font-semibold"
                >
                  {isCancelling ? "İptal Ediliyor..." : "Evet, İptal Et"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

