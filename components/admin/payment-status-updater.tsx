"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updatePaymentStatus } from "@/actions/admin";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface PaymentStatusUpdaterProps {
  orderId: string;
  currentPaymentStatus: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
}

const paymentStatusFlow = {
  PENDING: { 
    label: "Ödeme Bekleniyor", 
    color: "bg-yellow-100 text-yellow-800" 
  },
  PAID: { 
    label: "Ödendi", 
    color: "bg-green-100 text-green-800" 
  },
  FAILED: { 
    label: "Ödeme Başarısız", 
    color: "bg-red-100 text-red-800" 
  },
  CANCELLED: { 
    label: "İptal Edildi", 
    color: "bg-gray-100 text-gray-800" 
  },
};

const allPaymentStatuses: { value: "PENDING" | "PAID" | "FAILED" | "CANCELLED"; label: string; color: string }[] = [
  { value: "PENDING", label: "Ödeme Bekleniyor", color: "bg-yellow-100 text-yellow-800" },
  { value: "PAID", label: "Ödendi", color: "bg-green-100 text-green-800" },
  { value: "FAILED", label: "Ödeme Başarısız", color: "bg-red-100 text-red-800" },
  { value: "CANCELLED", label: "İptal Edildi", color: "bg-gray-100 text-gray-800" },
];

export function PaymentStatusUpdater({ orderId, currentPaymentStatus }: PaymentStatusUpdaterProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const currentFlow = paymentStatusFlow[currentPaymentStatus as keyof typeof paymentStatusFlow];

  const handlePaymentStatusChange = async (newStatus: "PENDING" | "PAID" | "FAILED" | "CANCELLED") => {
    setLoading(true);

    const result = await updatePaymentStatus(orderId, newStatus);

    if (result.success) {
      toast({
        title: "Başarılı",
        description: "Ödeme durumu güncellendi",
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
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600 mb-2">Mevcut Ödeme Durumu</p>
        <Badge className={`${currentFlow?.color} text-base px-4 py-2`} variant="outline">
          {currentFlow?.label || currentPaymentStatus}
        </Badge>
      </div>

      {/* Payment Status Buttons */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Ödeme Durumunu Değiştir</p>
        <div className="grid grid-cols-2 gap-2">
          {allPaymentStatuses.map((status) => (
            <Button
              key={status.value}
              variant={currentPaymentStatus === status.value ? "default" : "outline"}
              size="sm"
              onClick={() => handlePaymentStatusChange(status.value)}
              disabled={loading || currentPaymentStatus === status.value}
              className={`${
                currentPaymentStatus === status.value 
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40" 
                  : "border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700 hover:text-green-800"
              } transition-all duration-300 font-semibold`}
            >
              {status.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

