"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/actions/admin";
import { OrderStatus } from "@prisma/client";

const statusFlow = {
  PENDING: { next: null, label: "Ödeme Bekleniyor", color: "bg-yellow-100 text-yellow-800" },
  PAID: { next: "PROCESSING", label: "Sipariş Alındı", color: "bg-green-100 text-green-800" },
  PROCESSING: { next: "SHIPPED", label: "Hazırlanıyor", color: "bg-blue-100 text-blue-800" },
  SHIPPED: { next: "DELIVERED", label: "Kargoda", color: "bg-purple-100 text-purple-800" },
  DELIVERED: { next: null, label: "Teslim Edildi", color: "bg-green-100 text-green-800" },
  FAILED: { next: null, label: "Başarısız", color: "bg-red-100 text-red-800" },
  CANCELLED: { next: null, label: "İptal Edildi", color: "bg-gray-100 text-gray-800" },
  FULFILLED: { next: null, label: "Tamamlandı", color: "bg-green-100 text-green-800" },
} as const;

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const currentFlow = statusFlow[currentStatus as keyof typeof statusFlow];
  const nextStatus = currentFlow?.next;

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    setLoading(true);

    const result = await updateOrderStatus(orderId, newStatus);

    if (result.success) {
      toast({
        title: "Başarılı",
        description: "Sipariş durumu güncellendi",
      });
      router.refresh();
    } else {
      toast({
        title: "Hata",
        description: result.error || "Bir hata oluştu",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">Mevcut Durum</p>
        <Badge className={currentFlow?.color} variant="outline">
          {currentFlow?.label || currentStatus}
        </Badge>
      </div>

      {/* Status Timeline */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Sipariş Durumu Akışı</p>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant={currentStatus === "PAID" ? "default" : "outline"}
            className={currentStatus === "PAID" ? statusFlow.PAID.color : ""}
          >
            Sipariş Alındı
          </Badge>
          <span className="text-gray-400">→</span>
          <Badge
            variant={currentStatus === "PROCESSING" ? "default" : "outline"}
            className={currentStatus === "PROCESSING" ? statusFlow.PROCESSING.color : ""}
          >
            Hazırlanıyor
          </Badge>
          <span className="text-gray-400">→</span>
          <Badge
            variant={currentStatus === "SHIPPED" ? "default" : "outline"}
            className={currentStatus === "SHIPPED" ? statusFlow.SHIPPED.color : ""}
          >
            Kargoda
          </Badge>
          <span className="text-gray-400">→</span>
          <Badge
            variant={currentStatus === "DELIVERED" ? "default" : "outline"}
            className={currentStatus === "DELIVERED" ? statusFlow.DELIVERED.color : ""}
          >
            Teslim Edildi
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      {nextStatus && (
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600 mb-2">Sonraki Adım</p>
          <Button
            onClick={() => handleUpdateStatus(nextStatus as OrderStatus)}
            disabled={loading}
          >
            {loading ? "Güncelleniyor..." : `${statusFlow[nextStatus as keyof typeof statusFlow].label} Durumuna Geçir`}
          </Button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="pt-4 border-t space-y-2">
        <p className="text-sm text-gray-600 mb-2">Hızlı İşlemler</p>
        <div className="flex gap-2 flex-wrap">
          {currentStatus !== "CANCELLED" && currentStatus !== "FAILED" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleUpdateStatus("CANCELLED")}
              disabled={loading}
            >
              Siparişi İptal Et
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

