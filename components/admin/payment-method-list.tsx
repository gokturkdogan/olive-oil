"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deletePaymentMethod, togglePaymentMethodActive } from "@/actions/admin";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethodDialog } from "./payment-method-dialog";
import { CreditCard, Edit, Trash2, Power } from "lucide-react";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  type?: string;
  payment_info?: Array<{ label: string; value: string }> | null;
  active: boolean;
  created_at: Date;
}

interface PaymentMethodListProps {
  methods: PaymentMethod[];
}

export function PaymentMethodList({ methods }: PaymentMethodListProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!methodToDelete) return;

    const result = await deletePaymentMethod(methodToDelete);
    if (result.success) {
      toast({
        title: "Başarılı",
        description: "Ödeme yöntemi silindi",
      });
      setDeleteDialogOpen(false);
      setMethodToDelete(null);
    } else {
      toast({
        title: "Hata",
        description: result.error || "Ödeme yöntemi silinemedi",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string) => {
    const result = await togglePaymentMethodActive(id);
    if (result.success) {
      toast({
        title: "Başarılı",
        description: "Ödeme yöntemi durumu değiştirildi",
      });
    } else {
      toast({
        title: "Hata",
        description: result.error || "Durum değiştirilemedi",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        {methods.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <p className="text-green-700 font-semibold">Henüz ödeme yöntemi eklenmemiş</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {methods.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-xl border-2 border-green-100 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-green-900">{method.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-700 border-0 px-2 py-1 text-xs">
                          {method.type === "BANK_TRANSFER" ? "Havale/EFT" : "Kredi Kartı"}
                        </Badge>
                        {method.active ? (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md px-3 py-1">
                            Aktif
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600 border-0 px-3 py-1">
                            Pasif
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{method.description}</p>
                    {method.payment_info && method.payment_info.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-semibold text-green-600 uppercase">Ödeme Bilgileri:</p>
                        {method.payment_info.map((info, index) => (
                          <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-lg border border-green-200">
                            <p className="text-xs font-semibold text-green-700">{info.label}:</p>
                            <p className="text-sm text-green-900 font-mono">{info.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleToggleActive(method.id)}
                      title={method.active ? "Pasif Yap" : "Aktif Yap"}
                      className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
                    >
                      <Power className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(method)}
                      title="Düzenle"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setMethodToDelete(method.id);
                        setDeleteDialogOpen(true);
                      }}
                      title="Sil"
                      className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PaymentMethodDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelectedMethod(null);
          }
        }}
        method={selectedMethod}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Ödeme Yöntemini Sil"
        description="Bu ödeme yöntemini silmek istediğinizden emin misiniz?"
      />
    </>
  );
}

