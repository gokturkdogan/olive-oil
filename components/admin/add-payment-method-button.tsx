"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentMethodDialog } from "./payment-method-dialog";
import { Plus } from "lucide-react";

export function AddPaymentMethodButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Yeni Ödeme Yöntemi Ekle
      </Button>

      <PaymentMethodDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        method={null}
      />
    </>
  );
}

