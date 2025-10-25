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
import { MapPin, Trash2, Star, Edit, Phone, Building, Globe } from "lucide-react";
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
        title: "Başarılı! ✓",
        description: "Adres silindi",
        variant: "success",
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
        title: "Başarılı! ✓",
        description: "Varsayılan adres ayarlandı",
        variant: "success",
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
        title: "Başarılı! ✓",
        description: "Adres güncellendi",
        variant: "success",
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
      <Card className="hover:shadow-xl hover:border-green-300 transition-all duration-300 border-2 border-gray-200 shadow-lg bg-white group">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-700 transition-colors duration-300">{address.title}</h3>
            </div>
            {address.is_default && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg shadow-green-500/30 px-3 py-1 text-xs font-semibold">
                Varsayılan
              </Badge>
            )}
          </div>

          <div className="space-y-2 text-sm mb-6">
            <p className="font-semibold text-gray-800">{address.name}</p>
            <p className="text-gray-600 flex items-center gap-2">
              <Phone className="h-4 w-4 text-green-600" />
              {address.phone}
            </p>
            <p className="text-gray-600 flex items-start gap-2">
              <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
              <span>
                {address.address_line1}
                {address.address_line2 && `, ${address.address_line2}`}
              </span>
            </p>
            <p className="text-gray-600 flex items-center gap-2">
              <Building className="h-4 w-4 text-green-600" />
              {address.district}, {address.city} {address.postal_code}
            </p>
            <p className="text-gray-600 flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-600" />
              {address.country}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              disabled={loading}
              className="hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all duration-300 border-2"
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
                className="hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-all duration-300 border-2"
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
              className="ml-auto hover:bg-red-600 hover:shadow-lg transition-all duration-300"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Sil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-green-200 shadow-2xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-800">Adresi Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <Label htmlFor="edit-title" className="text-sm font-semibold text-gray-700">Adres Başlığı</Label>
              <Input
                id="edit-title"
                name="title"
                defaultValue={address.title}
                placeholder="Ev, İş, vb."
                required
                className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
              />
            </div>

            <div>
              <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-700">Ad Soyad</Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={address.name}
                placeholder="Alıcı adı"
                required
                className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
              />
            </div>

            <div>
              <Label htmlFor="edit-phone" className="text-sm font-semibold text-gray-700">Telefon</Label>
              <Input
                id="edit-phone"
                name="phone"
                type="tel"
                defaultValue={address.phone}
                placeholder="+90 555 123 4567"
                required
                className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
              />
            </div>

            <div>
              <Label htmlFor="edit-addressLine1" className="text-sm font-semibold text-gray-700">Adres</Label>
              <Input
                id="edit-addressLine1"
                name="addressLine1"
                defaultValue={address.address_line1}
                placeholder="Sokak, No, Daire"
                required
                className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
              />
            </div>

            <div>
              <Label htmlFor="edit-addressLine2" className="text-sm font-semibold text-gray-700">Adres Devamı (Opsiyonel)</Label>
              <Input
                id="edit-addressLine2"
                name="addressLine2"
                defaultValue={address.address_line2 || ""}
                placeholder="Apartman, Kat, vb."
                className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-city" className="text-sm font-semibold text-gray-700">Şehir</Label>
                <Input
                  id="edit-city"
                  name="city"
                  defaultValue={address.city}
                  placeholder="İstanbul"
                  required
                  className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
                />
              </div>
              <div>
                <Label htmlFor="edit-district" className="text-sm font-semibold text-gray-700">İlçe</Label>
                <Input
                  id="edit-district"
                  name="district"
                  defaultValue={address.district}
                  placeholder="Kadıköy"
                  required
                  className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-postalCode" className="text-sm font-semibold text-gray-700">Posta Kodu</Label>
              <Input
                id="edit-postalCode"
                name="postalCode"
                defaultValue={address.postal_code}
                placeholder="34000"
                required
                className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
              />
            </div>

            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <input
                type="checkbox"
                id="edit-isDefault"
                name="isDefault"
                defaultChecked={address.is_default}
                className="h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-500"
              />
              <Label htmlFor="edit-isDefault" className="font-semibold text-gray-700 cursor-pointer">
                Varsayılan adres olarak ayarla
              </Label>
            </div>

            <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                İptal
              </Button>
              <Button 
                type="submit" 
                disabled={updating} 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold"
              >
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
