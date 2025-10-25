"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusConfirmationDialog } from "./status-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/actions/admin";
import { OrderStatus } from "@prisma/client";
import { ChevronRight, ChevronLeft } from "lucide-react";

const statusFlow = {
  PENDING: { 
    prev: null, 
    next: null, 
    label: "Ödeme Bekleniyor", 
    color: "bg-yellow-100 text-yellow-800" 
  },
  PAID: { 
    prev: null, 
    next: "PROCESSING", 
    label: "Sipariş Alındı", 
    color: "bg-green-100 text-green-800" 
  },
  PROCESSING: { 
    prev: "PAID", 
    next: "SHIPPED", 
    label: "Hazırlanıyor", 
    color: "bg-blue-100 text-blue-800" 
  },
  SHIPPED: { 
    prev: "PROCESSING", 
    next: "DELIVERED", 
    label: "Kargoda", 
    color: "bg-purple-100 text-purple-800" 
  },
  DELIVERED: { 
    prev: "SHIPPED", 
    next: null, 
    label: "Teslim Edildi", 
    color: "bg-green-100 text-green-800" 
  },
  FAILED: { 
    prev: null, 
    next: null, 
    label: "Başarısız", 
    color: "bg-red-100 text-red-800" 
  },
  CANCELLED: { 
    prev: null, 
    next: null, 
    label: "İptal Edildi", 
    color: "bg-gray-100 text-gray-800" 
  },
  FULFILLED: { 
    prev: null, 
    next: null, 
    label: "Tamamlandı", 
    color: "bg-green-100 text-green-800" 
  },
} as const;

// All possible statuses for manual selection
const allStatuses: { value: OrderStatus; label: string; color: string }[] = [
  { value: "PAID", label: "Sipariş Alındı", color: "bg-green-100 text-green-800" },
  { value: "PROCESSING", label: "Hazırlanıyor", color: "bg-blue-100 text-blue-800" },
  { value: "SHIPPED", label: "Kargoda", color: "bg-purple-100 text-purple-800" },
  { value: "DELIVERED", label: "Teslim Edildi", color: "bg-green-100 text-green-800" },
  { value: "CANCELLED", label: "İptal Edildi", color: "bg-gray-100 text-gray-800" },
];

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    newStatus: OrderStatus | null;
  }>({
    open: false,
    newStatus: null,
  });
  const { toast } = useToast();
  const router = useRouter();

  const currentFlow = statusFlow[currentStatus as keyof typeof statusFlow];
  const prevStatus = currentFlow?.prev;
  const nextStatus = currentFlow?.next;

  const handleStatusClick = (newStatus: OrderStatus) => {
    setConfirmDialog({
      open: true,
      newStatus,
    });
  };

  const handleConfirmStatusChange = async () => {
    if (!confirmDialog.newStatus) return;

    setLoading(true);

    const result = await updateOrderStatus(orderId, confirmDialog.newStatus);

    if (result.success) {
      toast({
        title: "Başarılı! ✓",
        description: "Sipariş durumu güncellendi",
        variant: "success",
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
    setConfirmDialog({ open: false, newStatus: null });
  };

  // Don't show updater for terminal states
  if (currentStatus === "FAILED") {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-800 font-medium">Bu sipariş başarısız durumda.</p>
      </div>
    );
  }

  const newStatusLabel = confirmDialog.newStatus 
    ? statusFlow[confirmDialog.newStatus as keyof typeof statusFlow]?.label || ""
    : "";
  const newStatusColor = confirmDialog.newStatus
    ? statusFlow[confirmDialog.newStatus as keyof typeof statusFlow]?.color || ""
    : "";

  return (
    <>
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600 mb-2">Mevcut Durum</p>
        <Badge className={`${currentFlow?.color} text-base px-4 py-2`} variant="outline">
          {currentFlow?.label || currentStatus}
        </Badge>
      </div>

      {/* Status Timeline */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Sipariş Durumu Akışı</p>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant={currentStatus === "PAID" ? "default" : "outline"}
            className={currentStatus === "PAID" ? statusFlow.PAID.color : "opacity-50"}
          >
            Sipariş Alındı
          </Badge>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Badge
            variant={currentStatus === "PROCESSING" ? "default" : "outline"}
            className={currentStatus === "PROCESSING" ? statusFlow.PROCESSING.color : "opacity-50"}
          >
            Hazırlanıyor
          </Badge>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Badge
            variant={currentStatus === "SHIPPED" ? "default" : "outline"}
            className={currentStatus === "SHIPPED" ? statusFlow.SHIPPED.color : "opacity-50"}
          >
            Kargoda
          </Badge>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Badge
            variant={currentStatus === "DELIVERED" ? "default" : "outline"}
            className={currentStatus === "DELIVERED" ? statusFlow.DELIVERED.color : "opacity-50"}
          >
            Teslim Edildi
          </Badge>
        </div>
      </div>

      {/* Forward/Backward Navigation */}
      {(prevStatus || nextStatus) && (
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-3">Durum Değiştir</p>
          <div className="flex gap-3 flex-wrap">
            {prevStatus && (
              <Button
                variant="outline"
                onClick={() => handleStatusClick(prevStatus as OrderStatus)}
                disabled={loading}
                className="flex items-center gap-2 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-800 transition-all duration-300"
              >
                <ChevronLeft className="h-4 w-4" />
                {statusFlow[prevStatus as keyof typeof statusFlow].label}
              </Button>
            )}
            {nextStatus && (
              <Button
                onClick={() => handleStatusClick(nextStatus as OrderStatus)}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold"
              >
                {statusFlow[nextStatus as keyof typeof statusFlow].label}
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Manual Status Selection */}
      {currentStatus !== "CANCELLED" && (
        <div className="pt-4 border-t space-y-3">
          <p className="text-sm font-medium">Durumu Manuel Değiştir</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {allStatuses.map((status) => (
              <Button
                key={status.value}
                variant={currentStatus === status.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusClick(status.value)}
                disabled={loading || currentStatus === status.value}
                className={`${
                  currentStatus === status.value 
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40" 
                    : "border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700 hover:text-green-800"
                } transition-all duration-300 font-semibold`}
              >
                {status.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {currentStatus !== "CANCELLED" && (
        <div className="pt-4 border-t space-y-2">
          <p className="text-sm font-medium">Hızlı İşlemler</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusClick("CANCELLED")}
            disabled={loading}
            className="border-2 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-700 hover:text-red-800 transition-all duration-300 font-semibold"
          >
            Siparişi İptal Et
          </Button>
        </div>
      )}
    </div>

    {/* Status Confirmation Dialog */}
    <StatusConfirmationDialog
      open={confirmDialog.open}
      onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      onConfirm={handleConfirmStatusChange}
      currentStatus={currentFlow?.label || currentStatus}
      newStatus={newStatusLabel}
      statusColor={newStatusColor}
      loading={loading}
    />
    </>
  );
}
