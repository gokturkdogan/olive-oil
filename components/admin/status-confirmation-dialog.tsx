"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight } from "lucide-react";

interface StatusConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  currentStatus: string;
  newStatus: string;
  statusColor: string;
  loading?: boolean;
}

export function StatusConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  currentStatus,
  newStatus,
  statusColor,
  loading = false,
}: StatusConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const isCancellation = newStatus === "İptal Edildi";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`${isCancellation ? 'bg-red-100' : 'bg-blue-100'} p-2 rounded-full`}>
              <AlertCircle className={`h-6 w-6 ${isCancellation ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
            <DialogTitle className="text-xl">Durum Değişikliği</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className={`${isCancellation ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
            <p className={`text-sm font-medium ${isCancellation ? 'text-red-900' : 'text-blue-900'} mb-3`}>
              Sipariş durumunu değiştirmek üzeresiniz
            </p>
            
            <div className="flex items-center justify-center gap-3 my-4">
              <Badge variant="outline" className="text-sm px-3 py-1">
                {currentStatus}
              </Badge>
              <ArrowRight className={`h-5 w-5 ${isCancellation ? 'text-red-600' : 'text-blue-600'}`} />
              <Badge className={`${statusColor} text-sm px-3 py-1 border-0`}>
                {newStatus}
              </Badge>
            </div>

            {isCancellation && (
              <p className="text-sm text-red-700 mt-3 font-medium">
                ⚠️ Bu işlem sipariş sürecini sonlandıracaktır.
              </p>
            )}
          </div>

          <p className="text-sm text-gray-600 text-center">
            Bu değişikliği yapmak istediğinize emin misiniz?
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
            className={isCancellation ? "bg-red-600 hover:bg-red-700" : "bg-olive-gradient"}
          >
            {loading ? "Güncelleniyor..." : "Evet, Değiştir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

