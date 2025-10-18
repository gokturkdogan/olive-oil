"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { MapPin, Trash2, Star, Edit } from "lucide-react";
import { deleteAddress, setDefaultAddress, updateAddress } from "@/actions/addresses";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface AddressCardProps {
  address: {
    id: string;
    title: string;
    name: string;
    phone: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    district: string;
    postal_code: string;
    country: string;
    is_default: boolean;
  };
}

export function AddressCard({ address }: AddressCardProps) {
  const [loading, setLoading] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    const result = await deleteAddress(address.id);

    if (result.success) {
      toast({
        title: "Başarılı",
        description: "Adres silindi",
      });
      router.refresh();
    } else {
      toast({
        title: "Hata",
        description: result.error || "Adres silinemedi",
        variant: "destructive",
      });
      setLoading(false);
    }
    setShowDeleteDialog(false);
  };

  const handleSetDefault = async () => {
    setLoading(true);
    const result = await setDefaultAddress(address.id);

    if (result.success) {
      toast({
        title: "Başarılı",
        description: "Varsayılan adres ayarlandı",
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

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

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

    const result = await updateAddress(address.id, data);

    if (result.success) {
      toast({
        title: "Başarılı",
        description: "Adres güncellendi",
      });
      setShowEditDialog(false);
      router.refresh();
    } else {
      toast({
        title: "Hata",
        description: result.error || "Adres güncellenemedi",
        variant: "destructive",
      });
    }

    setUpdating(false);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-300 border-2 border-primary/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">{address.title}</h3>
            </div>
            {address.is_default && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Varsayılan
              </Badge>
            )}
          </div>

          <div className="space-y-1 text-sm mb-4">
            <p className="font-medium">{address.name}</p>
            <p className="text-gray-600">{address.phone}</p>
            <p className="text-gray-600">
              {address.address_line1}
              {address.address_line2 && `, ${address.address_line2}`}
            </p>
            <p className="text-gray-600">
              {address.district}, {address.city} {address.postal_code}
            </p>
            <p className="text-gray-600">{address.country}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              disabled={loading}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Edit className="h-4 w-4 mr-1" />
              Düzenle
            </Button>
            {!address.is_default && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetDefault}
                disabled={loading}
                className="hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 transition-colors"
              >
                <Star className="h-4 w-4 mr-1" />
                Varsayılan Yap
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteClick}
              disabled={loading}
              className="ml-auto"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Sil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adresi Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Adres Başlığı</Label>
              <Input
                id="edit-title"
                name="title"
                defaultValue={address.title}
                placeholder="Ev, İş, vb."
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-name">Ad Soyad</Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={address.name}
                placeholder="Alıcı adı"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-phone">Telefon</Label>
              <Input
                id="edit-phone"
                name="phone"
                type="tel"
                defaultValue={address.phone}
                placeholder="+90 555 123 4567"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-addressLine1">Adres</Label>
              <Input
                id="edit-addressLine1"
                name="addressLine1"
                defaultValue={address.address_line1}
                placeholder="Sokak, No, Daire"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-addressLine2">Adres Devamı (Opsiyonel)</Label>
              <Input
                id="edit-addressLine2"
                name="addressLine2"
                defaultValue={address.address_line2 || ""}
                placeholder="Apartman, Kat, vb."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-city">Şehir</Label>
                <Input
                  id="edit-city"
                  name="city"
                  defaultValue={address.city}
                  placeholder="İstanbul"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-district">İlçe</Label>
                <Input
                  id="edit-district"
                  name="district"
                  defaultValue={address.district}
                  placeholder="Kadıköy"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-postalCode">Posta Kodu</Label>
              <Input
                id="edit-postalCode"
                name="postalCode"
                defaultValue={address.postal_code}
                placeholder="34000"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isDefault"
                name="isDefault"
                defaultChecked={address.is_default}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="edit-isDefault" className="font-normal cursor-pointer">
                Varsayılan adres olarak ayarla
              </Label>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                İptal
              </Button>
              <Button type="submit" disabled={updating} className="bg-olive-gradient">
                {updating ? "Güncelleniyor..." : "Güncelle"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title={address.title}
        description="Bu adres kalıcı olarak silinecektir."
        loading={loading}
      />
    </>
  );
}
