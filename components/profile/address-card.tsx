"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trash2, Star } from "lucide-react";
import { deleteAddress, setDefaultAddress } from "@/actions/addresses";
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
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Bu adresi silmek istediğinize emin misiniz?")) {
      return;
    }

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

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">{address.title}</h3>
          </div>
          {address.is_default && (
            <Badge variant="secondary">Varsayılan</Badge>
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

        <div className="flex gap-2">
          {!address.is_default && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetDefault}
              disabled={loading}
            >
              <Star className="h-4 w-4 mr-1" />
              Varsayılan Yap
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Sil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

