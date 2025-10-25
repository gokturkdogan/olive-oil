"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createAddress } from "@/actions/addresses";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function AddAddressDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      addressLine1: formData.get("addressLine1") as string,
      addressLine2: formData.get("addressLine2") as string,
      city: formData.get("city") as string,
      district: formData.get("district") as string,
      postalCode: formData.get("postalCode") as string,
      isDefault: formData.get("isDefault") === "on",
    };

    const result = await createAddress(data);

    if (result.success) {
      toast({
        title: "Başarılı! ✓",
        description: "Adres eklendi",
        variant: "success",
      });
      setOpen(false);
      router.refresh();
      (e.target as HTMLFormElement).reset();
    } else {
      toast({
        title: "Hata",
        description: result.error || "Adres eklenemedi",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold px-6 py-3">
          <Plus className="h-5 w-5 mr-2" />
          Yeni Adres Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-green-200 shadow-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">Yeni Adres Ekle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Adres Başlığı</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ev, İş, vb."
              required
              className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
            />
          </div>

          <div>
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Ad Soyad</Label>
            <Input
              id="name"
              name="name"
              placeholder="Alıcı adı"
              required
              className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Telefon</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+90 555 123 4567"
              required
              className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
            />
          </div>

          <div>
            <Label htmlFor="addressLine1" className="text-sm font-semibold text-gray-700">Adres</Label>
            <Input
              id="addressLine1"
              name="addressLine1"
              placeholder="Sokak, No, Daire"
              required
              className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
            />
          </div>

          <div>
            <Label htmlFor="addressLine2" className="text-sm font-semibold text-gray-700">Adres Devamı (Opsiyonel)</Label>
            <Input
              id="addressLine2"
              name="addressLine2"
              placeholder="Apartman, Kat, vb."
              className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="text-sm font-semibold text-gray-700">Şehir</Label>
              <Input
                id="city"
                name="city"
                placeholder="İstanbul"
                required
                className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
              />
            </div>
            <div>
              <Label htmlFor="district" className="text-sm font-semibold text-gray-700">İlçe</Label>
              <Input
                id="district"
                name="district"
                placeholder="Kadıköy"
                required
                className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="postalCode" className="text-sm font-semibold text-gray-700">Posta Kodu</Label>
            <Input
              id="postalCode"
              name="postalCode"
              placeholder="34000"
              required
              className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
            />
          </div>

          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-200">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              className="h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-500"
            />
            <Label htmlFor="isDefault" className="font-semibold text-gray-700 cursor-pointer">
              Varsayılan adres olarak ayarla
            </Label>
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
            >
              İptal
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold"
            >
              {loading ? "Ekleniyor..." : "Adres Ekle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

