"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle, Package, Truck } from "lucide-react";

interface ClearShippingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  shippingProvider?: string;
  trackingCode?: string;
  loading?: boolean;
}

export function ClearShippingDialog({
  open,
  onOpenChange,
  onConfirm,
  shippingProvider,
  trackingCode,
  loading = false,
}: ClearShippingDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-amber-100 p-2 rounded-full">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <DialogTitle className="text-xl">Kargo Bilgilerini Temizle</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-900 mb-3">
              Aşağıdaki kargo bilgileri silinecek:
            </p>
            
            <div className="space-y-2">
              {shippingProvider && (
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-amber-700" />
                  <span className="text-amber-800">
                    <span className="font-medium">Kargo Şirketi:</span> {shippingProvider}
                  </span>
                </div>
              )}
              {trackingCode && (
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-amber-700" />
                  <span className="text-amber-800">
                    <span className="font-medium">Takip Kodu:</span> {trackingCode}
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 text-center">
            Bu bilgileri temizlemek istediğinize emin misiniz?
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            İptal
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {loading ? "Temizleniyor..." : "Evet, Temizle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

