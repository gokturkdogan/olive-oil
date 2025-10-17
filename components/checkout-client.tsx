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
import { Mail, MapPin, Home, Package, CreditCard, Tag, CheckCircle2, Truck } from "lucide-react";

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

interface CheckoutClientProps {
  userEmail?: string;
}

export function CheckoutClient({ userEmail }: CheckoutClientProps) {
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(true);
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
        setShowAddressForm(false); // Hide form when default address is selected
      } else {
        // If no saved addresses or no default, show form
        setShowAddressForm(userAddresses.length === 0);
      }
    }
    loadAddresses();
  }, []);

  // Fill form when address is selected
  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    setShowAddressForm(false); // Hide form when saved address is selected
    setSaveAddress(false); // Reset save address checkbox
    setAddressTitle(""); // Reset address title
  };

  const handleNewAddress = () => {
    setSelectedAddressId(null);
    setShowAddressForm(true); // Show form when new address is selected
    // Clear form
    const shippingName = document.getElementById("shippingName") as HTMLInputElement;
    const shippingPhone = document.getElementById("shippingPhone") as HTMLInputElement;
    const shippingAddressLine1 = document.getElementById("shippingAddressLine1") as HTMLInputElement;
    const shippingAddressLine2 = document.getElementById("shippingAddressLine2") as HTMLInputElement;
    const city = document.getElementById("city") as HTMLInputElement;
    const district = document.getElementById("district") as HTMLInputElement;
    const postalCode = document.getElementById("postalCode") as HTMLInputElement;
    
    if (shippingName) shippingName.value = "";
    if (shippingPhone) shippingPhone.value = "";
    if (shippingAddressLine1) shippingAddressLine1.value = "";
    if (shippingAddressLine2) shippingAddressLine2.value = "";
    if (city) city.value = "";
    if (district) district.value = "";
    if (postalCode) postalCode.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Get shipping info from saved address or form
    let shippingData;
    
    if (selectedAddressId) {
      // Use selected saved address
      const selectedAddress = addresses.find(a => a.id === selectedAddressId);
      if (!selectedAddress) {
        toast({
          title: "Hata",
          description: "Seçili adres bulunamadı",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      shippingData = {
        shippingName: selectedAddress.name,
        shippingPhone: selectedAddress.phone,
        shippingAddressLine1: selectedAddress.address_line1,
        shippingAddressLine2: selectedAddress.address_line2 || "",
        city: selectedAddress.city,
        district: selectedAddress.district,
        postalCode: selectedAddress.postal_code,
        saveAddress: false, // Don't save again
        addressTitle: undefined,
      };
    } else {
      // Use form data for new address
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
      
      shippingData = {
        shippingName: formData.get("shippingName") as string,
        shippingPhone: formData.get("shippingPhone") as string,
        shippingAddressLine1: formData.get("shippingAddressLine1") as string,
        shippingAddressLine2: formData.get("shippingAddressLine2") as string,
        city: formData.get("city") as string,
        district: formData.get("district") as string,
        postalCode: formData.get("postalCode") as string,
        saveAddress,
        addressTitle: saveAddress ? addressTitle : undefined,
      };
    }

    const data = {
      email: formData.get("email") as string,
      ...shippingData,
      country: "TR",
      couponCode: formData.get("couponCode") as string,
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
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-3">Ödeme</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Package className="h-4 w-4" />
            Siparişinizi tamamlamak için son adım!
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-2 md:gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-olive-gradient text-white rounded-full h-8 w-8 flex items-center justify-center font-semibold shadow-md">
              1
            </div>
            <span className="font-medium hidden sm:inline">Bilgiler</span>
          </div>
          <div className="h-0.5 w-8 md:w-16 bg-primary"></div>
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-primary/20 text-primary rounded-full h-8 w-8 flex items-center justify-center font-semibold">
              2
            </div>
            <span className="text-muted-foreground hidden sm:inline">Ödeme</span>
          </div>
          <div className="h-0.5 w-8 md:w-16 bg-muted"></div>
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-muted text-muted-foreground rounded-full h-8 w-8 flex items-center justify-center font-semibold">
              3
            </div>
            <span className="text-muted-foreground hidden sm:inline">Tamamla</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Info */}
          <Card className="border-2 border-primary/10 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                İletişim Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue={userEmail || ""}
                  placeholder="ornek@email.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Saved Addresses */}
          {addresses.length > 0 && (
            <Card className="border-2 border-primary/10 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Kayıtlı Adreslerim
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                <div className="grid gap-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => handleAddressSelect(address.id)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                        selectedAddressId === address.id
                          ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md"
                          : "border-muted hover:border-primary/50"
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
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-olive-gradient flex items-center justify-center shadow-md">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
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
                  className="w-full border-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group"
                >
                  <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Yeni Adres Kullan
                </Button>
                
                {!selectedAddressId && !showAddressForm && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    ⚠️ Lütfen kayıtlı adreslerinizden birini seçin veya yeni adres girin
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Shipping Address Form */}
          {showAddressForm && (
            <Card className="animate-fadeInUp border-2 border-primary/10 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Teslimat Adresi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
              <div>
                <Label htmlFor="shippingName">Ad Soyad</Label>
                <Input
                  id="shippingName"
                  name="shippingName"
                  type="text"
                  required={showAddressForm}
                  placeholder="Ahmet Yılmaz"
                />
              </div>

              <div>
                <Label htmlFor="shippingPhone">Telefon</Label>
                <Input
                  id="shippingPhone"
                  name="shippingPhone"
                  type="tel"
                  required={showAddressForm}
                  placeholder="+90 555 123 4567"
                />
              </div>

              <div>
                <Label htmlFor="shippingAddressLine1">Adres</Label>
                <Input
                  id="shippingAddressLine1"
                  name="shippingAddressLine1"
                  type="text"
                  required={showAddressForm}
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
                    required={showAddressForm}
                    placeholder="İstanbul"
                  />
                </div>

                <div>
                  <Label htmlFor="district">İlçe</Label>
                  <Input
                    id="district"
                    name="district"
                    type="text"
                    required={showAddressForm}
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
                  required={showAddressForm}
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
          )}

          {/* Coupon Code */}
          <Card className="border-2 border-primary/10 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Kupon Kodu (Opsiyonel)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Input
                id="couponCode"
                name="couponCode"
                type="text"
                placeholder="KUPON KODUNUZ"
                className="text-center uppercase tracking-wider font-semibold"
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                İndirim kuponu varsa buraya girin
              </p>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="sticky bottom-0 pt-6 bg-background/95 backdrop-blur-sm border-t-2 border-primary/10 -mx-4 px-4 md:mx-0 md:px-0 md:border-0 md:bg-transparent">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full bg-olive-gradient hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl group text-lg py-6" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  İşleniyor...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Güvenli Ödemeye Geç
                  <CheckCircle2 className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              🔒 Ödeme bilgileriniz SSL ile korunmaktadır
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

