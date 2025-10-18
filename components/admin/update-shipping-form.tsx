"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClearShippingDialog } from "./clear-shipping-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateOrderShipping } from "@/actions/admin";
import { Truck, Package } from "lucide-react";

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
  const [showClearDialog, setShowClearDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const hasChanges = 
    shippingProvider !== initialProvider || 
    trackingCode !== initialCode;

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

  const handleClearClick = () => {
    setShowClearDialog(true);
  };

  const handleClearConfirm = () => {
    setShippingProvider("");
    setTrackingCode("");
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="shippingProvider" className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" />
          Kargo Şirketi
        </Label>
        <Input
          id="shippingProvider"
          value={shippingProvider}
          onChange={(e) => setShippingProvider(e.target.value)}
          placeholder="Örn: Aras Kargo, Yurtiçi Kargo, MNG Kargo"
          className="mt-1.5"
        />
        <p className="text-xs text-gray-500 mt-1">
          Kargo şirketinin tam adını girin
        </p>
      </div>

      <div>
        <Label htmlFor="trackingCode" className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          Takip Kodu
        </Label>
        <Input
          id="trackingCode"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          placeholder="Takip numarası"
          className="mt-1.5 font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">
          Kargo takip numarasını girin
        </p>
      </div>

      <div className="flex gap-2 pt-2">
        <Button 
          type="submit" 
          disabled={loading || !hasChanges}
          className="bg-olive-gradient"
        >
          {loading ? "Kaydediliyor..." : "Kargo Bilgilerini Güncelle"}
        </Button>
        
        {(shippingProvider || trackingCode) && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClearClick}
            disabled={loading}
          >
            Temizle
          </Button>
        )}
      </div>

      {!hasChanges && (shippingProvider || trackingCode) && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          Kayıtlı bilgiler görüntüleniyor
        </p>
      )}
    </form>

    {/* Clear Confirmation Dialog */}
    <ClearShippingDialog
      open={showClearDialog}
      onOpenChange={setShowClearDialog}
      onConfirm={handleClearConfirm}
      shippingProvider={shippingProvider}
      trackingCode={trackingCode}
      loading={loading}
    />
    </>
  );
}
