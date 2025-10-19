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
    <Card className="border-2 border-primary/15 shadow-md hover:border-primary/40 hover:shadow-2xl transition-all duration-300 overflow-hidden backdrop-blur-sm bg-white/95">
      <CardContent className="p-5 md:p-6">
        {/* Header - Always Visible */}
        <div 
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-3">
                <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
                  <Package className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Sipariş #{order.id.slice(0, 8).toUpperCase()}
                </h3>
                <Badge
                  className={statusColors[order.status]}
                  variant="outline"
                >
                  {statusLabels[order.status]}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                {new Date(order.created_at).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className="text-left sm:text-right flex items-center gap-3">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">Toplam Tutar</p>
                <p className="text-2xl md:text-3xl font-bold text-gradient">
                  {formatPrice(order.total)}
                </p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-primary" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-primary" />
                )}
              </button>
            </div>
          </div>

          {/* Quick View - Always Visible */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>{order.items.length} ürün</span>
            {!isExpanded && (
              <span className="text-primary ml-2 text-xs">
                • Detaylar için tıklayın
              </span>
            )}
          </div>
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="border-t border-primary/10 pt-4 mt-4 space-y-4 animate-fadeInUp">
            {/* Order Items */}
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Ürünler
              </h4>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 bg-olive-gradient-soft rounded-xl"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-white rounded-lg h-12 w-12 flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-2xl">🫒</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {item.title_snapshot}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.quantity} adet × {formatPrice(item.unit_price_snapshot)}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-sm text-primary flex-shrink-0">
                      {formatPrice(item.line_total)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Fiyat Detayları
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ara Toplam:</span>
                  <span className="font-medium">{formatPrice(order.subtotal)}</span>
                </div>
                
                {order.discount_total > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>İndirim {order.coupon_code && `(${order.coupon_code})`}:</span>
                    <span className="font-medium">-{formatPrice(order.discount_total)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo:</span>
                  <span className={`font-medium ${order.shipping_fee === 0 ? 'text-green-600' : ''}`}>
                    {order.shipping_fee === 0 ? 'Ücretsiz ✨' : formatPrice(order.shipping_fee)}
                  </span>
                </div>
                
                <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between text-base font-bold">
                  <span>Toplam:</span>
                  <span className="text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Teslimat Adresi
              </h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">{order.shipping_name}</p>
                <p>{order.shipping_address_line1}</p>
                {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                <p>
                  {order.district}, {order.city} {order.postal_code}
                </p>
                <p>{order.country}</p>
              </div>
            </div>

            {/* Tracking Info */}
            {order.tracking_code && (
              <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <p className="text-sm md:text-base font-semibold text-gray-900">
                    Kargo Takip
                  </p>
                </div>
                <p className="text-xs md:text-sm text-gray-700">
                  <span className="font-medium">{order.shipping_provider}</span>
                  <span className="mx-2">•</span>
                  <span className="font-mono bg-white px-2 py-1 rounded">
                    {order.tracking_code}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

