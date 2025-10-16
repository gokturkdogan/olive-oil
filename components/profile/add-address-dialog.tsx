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
        title: "Başarılı",
        description: "Adres eklendi",
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Adres Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Adres Ekle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Adres Başlığı</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ev, İş, vb."
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Ad Soyad</Label>
            <Input
              id="name"
              name="name"
              placeholder="Alıcı adı"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+90 555 123 4567"
              required
            />
          </div>

          <div>
            <Label htmlFor="addressLine1">Adres</Label>
            <Input
              id="addressLine1"
              name="addressLine1"
              placeholder="Sokak, No, Daire"
              required
            />
          </div>

          <div>
            <Label htmlFor="addressLine2">Adres Devamı (Opsiyonel)</Label>
            <Input
              id="addressLine2"
              name="addressLine2"
              placeholder="Apartman, Kat, vb."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Şehir</Label>
              <Input
                id="city"
                name="city"
                placeholder="İstanbul"
                required
              />
            </div>
            <div>
              <Label htmlFor="district">İlçe</Label>
              <Input
                id="district"
                name="district"
                placeholder="Kadıköy"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="postalCode">Posta Kodu</Label>
            <Input
              id="postalCode"
              name="postalCode"
              placeholder="34000"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isDefault" className="font-normal cursor-pointer">
              Varsayılan adres olarak ayarla
            </Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Ekleniyor..." : "Adres Ekle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

