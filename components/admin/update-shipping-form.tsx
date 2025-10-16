"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateOrderShipping } from "@/actions/admin";

interface UpdateShippingFormProps {
  orderId: string;
  shippingProvider: string;
  trackingCode: string;
}

export function UpdateShippingForm({
  orderId,
  shippingProvider: initialProvider,
  trackingCode: initialCode,
}: UpdateShippingFormProps) {
  const [shippingProvider, setShippingProvider] = useState(initialProvider);
  const [trackingCode, setTrackingCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateOrderShipping(
      orderId,
      shippingProvider,
      trackingCode
    );

    if (result.success) {
      toast({
        title: "Başarılı",
        description: "Kargo bilgileri güncellendi",
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="shippingProvider">Kargo Şirketi</Label>
        <Input
          id="shippingProvider"
          value={shippingProvider}
          onChange={(e) => setShippingProvider(e.target.value)}
          placeholder="Örn: Aras Kargo, Yurtiçi Kargo"
          required
        />
      </div>

      <div>
        <Label htmlFor="trackingCode">Takip Kodu</Label>
        <Input
          id="trackingCode"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          placeholder="Takip numarası"
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Kaydediliyor..." : "Kargo Bilgilerini Güncelle"}
      </Button>
    </form>
  );
}

