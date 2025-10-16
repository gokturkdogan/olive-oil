"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createOrder } from "@/actions/orders";
import { getUserAddresses } from "@/actions/addresses";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Address {
  id: string;
  title: string;
  name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  district: string;
  postal_code: string;
  is_default: boolean;
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);
  const [addressTitle, setAddressTitle] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  // Load user addresses
  useEffect(() => {
    async function loadAddresses() {
      const userAddresses = await getUserAddresses();
      setAddresses(userAddresses as Address[]);
      
      // Auto-select default address
      const defaultAddress = userAddresses.find((a: Address) => a.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    }
    loadAddresses();
  }, []);

  // Fill form when address is selected
  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const address = addresses.find((a) => a.id === addressId);
    
    if (address) {
      // Fill form fields
      (document.getElementById("shippingName") as HTMLInputElement).value = address.name;
      (document.getElementById("shippingPhone") as HTMLInputElement).value = address.phone;
      (document.getElementById("shippingAddressLine1") as HTMLInputElement).value = address.address_line1;
      (document.getElementById("shippingAddressLine2") as HTMLInputElement).value = address.address_line2 || "";
      (document.getElementById("city") as HTMLInputElement).value = address.city;
      (document.getElementById("district") as HTMLInputElement).value = address.district;
      (document.getElementById("postalCode") as HTMLInputElement).value = address.postal_code;
    }
  };

  const handleNewAddress = () => {
    setSelectedAddressId(null);
    // Clear form
    (document.getElementById("shippingName") as HTMLInputElement).value = "";
    (document.getElementById("shippingPhone") as HTMLInputElement).value = "";
    (document.getElementById("shippingAddressLine1") as HTMLInputElement).value = "";
    (document.getElementById("shippingAddressLine2") as HTMLInputElement).value = "";
    (document.getElementById("city") as HTMLInputElement).value = "";
    (document.getElementById("district") as HTMLInputElement).value = "";
    (document.getElementById("postalCode") as HTMLInputElement).value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Validate address title if saving
    if (saveAddress && !addressTitle.trim()) {
      toast({
        title: "Hata",
        description: "Adres başlığı gereklidir",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const data = {
      email: formData.get("email") as string,
      shippingName: formData.get("shippingName") as string,
      shippingPhone: formData.get("shippingPhone") as string,
      shippingAddressLine1: formData.get("shippingAddressLine1") as string,
      shippingAddressLine2: formData.get("shippingAddressLine2") as string,
      city: formData.get("city") as string,
      district: formData.get("district") as string,
      postalCode: formData.get("postalCode") as string,
      country: "TR",
      couponCode: formData.get("couponCode") as string,
      saveAddress,
      addressTitle: saveAddress ? addressTitle : undefined,
    };

    try {
      const result = await createOrder(data);

      if (result.success && result.paymentPageUrl) {
        // Redirect to iyzico payment page
        window.location.href = result.paymentPageUrl;
      } else {
        toast({
          title: "Hata",
          description: result.error || "Sipariş oluşturulamadı",
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bir hata oluştu",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ödeme</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="ornek@email.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Saved Addresses */}
          {addresses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Kayıtlı Adreslerim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => handleAddressSelect(address.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{address.title}</p>
                            {address.is_default && (
                              <Badge variant="secondary" className="text-xs">
                                Varsayılan
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{address.name}</p>
                          <p className="text-sm text-gray-600">{address.phone}</p>
                          <p className="text-sm text-gray-600">
                            {address.address_line1}
                            {address.address_line2 && `, ${address.address_line2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.district}, {address.city} {address.postal_code}
                          </p>
                        </div>
                        {selectedAddressId === address.id && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleNewAddress}
                  className="w-full"
                >
                  Yeni Adres Kullan
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Shipping Address Form */}
          <Card>
            <CardHeader>
              <CardTitle>Teslimat Adresi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shippingName">Ad Soyad</Label>
                <Input
                  id="shippingName"
                  name="shippingName"
                  type="text"
                  required
                  placeholder="Ahmet Yılmaz"
                />
              </div>

              <div>
                <Label htmlFor="shippingPhone">Telefon</Label>
                <Input
                  id="shippingPhone"
                  name="shippingPhone"
                  type="tel"
                  required
                  placeholder="+90 555 123 4567"
                />
              </div>

              <div>
                <Label htmlFor="shippingAddressLine1">Adres</Label>
                <Input
                  id="shippingAddressLine1"
                  name="shippingAddressLine1"
                  type="text"
                  required
                  placeholder="Sokak, No, Daire"
                />
              </div>

              <div>
                <Label htmlFor="shippingAddressLine2">
                  Adres Devamı (Opsiyonel)
                </Label>
                <Input
                  id="shippingAddressLine2"
                  name="shippingAddressLine2"
                  type="text"
                  placeholder="Apartman, Kat, vb."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Şehir</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    required
                    placeholder="İstanbul"
                  />
                </div>

                <div>
                  <Label htmlFor="district">İlçe</Label>
                  <Input
                    id="district"
                    name="district"
                    type="text"
                    required
                    placeholder="Kadıköy"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="postalCode">Posta Kodu</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  required
                  placeholder="34000"
                />
              </div>

              {/* Save Address Checkbox */}
              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    checked={saveAddress}
                    onChange={(e) => {
                      setSaveAddress(e.target.checked);
                      if (!e.target.checked) {
                        setAddressTitle("");
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="saveAddress" className="font-normal cursor-pointer">
                    Bu adresi adreslerime kaydet
                  </Label>
                </div>

                {saveAddress && (
                  <div>
                    <Label htmlFor="addressTitle">Adres Başlığı *</Label>
                    <Input
                      id="addressTitle"
                      value={addressTitle}
                      onChange={(e) => setAddressTitle(e.target.value)}
                      placeholder="Örn: Ev, İş, Yazlık"
                      required={saveAddress}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Bu isimle kayıtlı adreslerinizde görünecek
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Coupon Code */}
          <Card>
            <CardHeader>
              <CardTitle>Kupon Kodu (Opsiyonel)</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                id="couponCode"
                name="couponCode"
                type="text"
                placeholder="KUPON KODUNUZ"
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "İşleniyor..." : "Ödemeye Geç"}
          </Button>
        </form>
      </div>
    </div>
  );
}
