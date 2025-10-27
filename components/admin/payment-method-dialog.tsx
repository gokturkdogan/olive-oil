"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createPaymentMethod, updatePaymentMethod } from "@/actions/admin";
import { useToast } from "@/hooks/use-toast";
import { X, Plus } from "lucide-react";

interface PaymentInfoItem {
  label: string;
  value: string;
}

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  method?: {
    id: string;
    title: string;
    description: string;
    type?: string;
    payment_info?: any;
    active: boolean;
  } | null;
}

export function PaymentMethodDialog({ open, onOpenChange, method }: PaymentMethodDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"IYZICO" | "BANK_TRANSFER">("IYZICO");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoItem[]>([]);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (method) {
      setTitle(method.title);
      setDescription(method.description);
      
      // Parse payment_info - could be array of strings or array of objects
      if (method.payment_info && Array.isArray(method.payment_info)) {
        if (method.payment_info.length > 0 && typeof method.payment_info[0] === 'string') {
          // Old format (array of strings)
          setPaymentInfo([]);
        } else {
          // New format (array of {label, value})
          setPaymentInfo(method.payment_info as PaymentInfoItem[]);
        }
      } else {
        setPaymentInfo([]);
      }
      
      setType(method.type as "IYZICO" | "BANK_TRANSFER" || "IYZICO");
      setActive(method.active);
    } else {
      resetForm();
    }
  }, [method]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("IYZICO");
    setPaymentInfo([]);
    setActive(true);
  };

  const handleAddPaymentInfo = () => {
    setPaymentInfo([...paymentInfo, { label: "", value: "" }]);
  };

  const handleRemovePaymentInfo = (index: number) => {
    setPaymentInfo(paymentInfo.filter((_, i) => i !== index));
  };

  const handlePaymentInfoLabelChange = (index: number, label: string) => {
    const newPaymentInfo = [...paymentInfo];
    newPaymentInfo[index].label = label;
    setPaymentInfo(newPaymentInfo);
  };

  const handlePaymentInfoValueChange = (index: number, value: string) => {
    const newPaymentInfo = [...paymentInfo];
    newPaymentInfo[index].value = value;
    setPaymentInfo(newPaymentInfo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Filter out empty items
    const filteredPaymentInfo = paymentInfo.filter(item => item.label.trim() !== "" && item.value.trim() !== "");

    const data = {
      title,
      description,
      type,
      payment_info: filteredPaymentInfo.length > 0 ? filteredPaymentInfo : undefined,
      active,
    };

    const result = method 
      ? await updatePaymentMethod(method.id, data)
      : await createPaymentMethod(data);

    if (result.success) {
      toast({
        title: "Başarılı",
        description: method ? "Ödeme yöntemi güncellendi" : "Ödeme yöntemi oluşturuldu",
      });
      onOpenChange(false);
      resetForm();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {method ? "Ödeme Yöntemi Düzenle" : "Yeni Ödeme Yöntemi Ekle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-green-700 font-semibold">Başlık *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Havale/EFT"
              className="border-green-200 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-green-700 font-semibold">Açıklama *</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ödeme yöntemi hakkında bilgi verin"
              className="w-full min-h-[100px] px-3 py-2 text-sm border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Payment Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-green-700 font-semibold">Ödeme Tipi *</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as "IYZICO" | "BANK_TRANSFER")}
              className="w-full px-3 py-2 text-sm border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="IYZICO">Kredi Kartı (Iyzico)</option>
              <option value="BANK_TRANSFER">Havale/EFT</option>
            </select>
            <p className="text-xs text-gray-500">
              {type === "IYZICO" 
                ? "Müşteriler ödemeyi kredi kartı ile yapacak" 
                : "Müşteriler ödemeyi havale/EFT ile yapacak"}
            </p>
          </div>

          {/* Payment Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-green-700 font-semibold">Ödeme Bilgileri (Opsiyonel)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPaymentInfo}
                className="border-green-500 text-green-700 hover:bg-green-50 hover:border-green-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Bilgi Ekle
              </Button>
            </div>
            {paymentInfo.length > 0 && (
              <div className="space-y-3">
                {paymentInfo.map((info, index) => (
                  <div key={index} className="space-y-2 border-2 border-green-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-green-700 mb-1 block">Başlık</label>
                        <Input
                          value={info.label}
                          onChange={(e) => handlePaymentInfoLabelChange(index, e.target.value)}
                          placeholder="Örn: Banka Adı"
                          className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePaymentInfo(index)}
                        className="mt-6 hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-green-700 mb-1 block">Değer</label>
                      <Input
                        value={info.value}
                        onChange={(e) => handlePaymentInfoValueChange(index, e.target.value)}
                        placeholder="Örn: Garanti Bankası"
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {paymentInfo.length === 0 && (
              <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                Banka adı, IBAN, alıcı adı gibi bilgiler ekleyebilirsiniz. Her bilgi için başlık ve değer girin.
              </div>
            )}
          </div>

          {/* Active */}
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-5 h-5 text-green-600 border-green-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
            />
            <Label htmlFor="active" className="text-green-700 font-semibold cursor-pointer">Aktif</Label>
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              className="border-gray-300 hover:bg-gray-50"
            >
              İptal
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
            >
              {loading ? "Kaydediliyor..." : method ? "Güncelle" : "Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

