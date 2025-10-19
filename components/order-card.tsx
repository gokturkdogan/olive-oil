"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/money";
import { Package, Calendar, ChevronDown, ChevronUp, MapPin, CreditCard, Truck } from "lucide-react";

interface OrderCardProps {
  order: {
    id: string;
    status: string;
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
    items: Array<{
      id: string;
      title_snapshot: string;
      quantity: number;
      unit_price_snapshot: number;
      line_total: number;
    }>;
  };
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
}

export function OrderCard({ order, statusColors, statusLabels }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
              <Badge className={statusColors[order.status]} variant="outline">
                {statusLabels[order.status]}
              </Badge>
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
                      <div className="text-2xl">🫒</div>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}

