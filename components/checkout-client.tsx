"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createOrder } from "@/actions/orders";
import { createAddress, getUserAddresses } from "@/actions/addresses";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Package, Plus, MapPin, CheckCircle2, Home, Truck } from "lucide-react";
import { formatPrice } from "@/lib/money";
import { calculateShippingFee, getRemainingForFreeShipping } from "@/lib/shipping";
import Image from "next/image";

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
  session: any;
  cart: any;
  addresses: Address[];
  loyaltyTier: string;
}

export function CheckoutClient({ session, cart, addresses: initialAddresses, loyaltyTier }: CheckoutClientProps) {
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    initialAddresses.find((a) => a.is_default)?.id || null
  );
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const isLoggedIn = !!session?.user;

  // Calculate totals
  const subtotal = cart?.items?.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0
  ) || 0;
  
  // Dynamic shipping fee based on loyalty tier
  const shippingCost = calculateShippingFee(subtotal, loyaltyTier as any);
  const remainingForFreeShipping = getRemainingForFreeShipping(subtotal, loyaltyTier as any);
  
  const total = subtotal + shippingCost;

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddingAddress(true);

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
      
      // Refresh addresses
      const newAddresses = await getUserAddresses();
      setAddresses(newAddresses as Address[]);
      
      // Select the newly added address if it's default
      if (data.isDefault) {
        const newAddr = newAddresses.find((a: any) => a.is_default);
        if (newAddr) setSelectedAddressId(newAddr.id);
      }
      
      setShowAddressDialog(false);
      (e.target as HTMLFormElement).reset();
    } else {
      toast({
        title: "Hata",
        description: result.error || "Adres eklenemedi",
        variant: "destructive",
      });
    }

    setAddingAddress(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    let shippingData;

    if (isLoggedIn) {
      // For logged-in users, use selected address
      if (!selectedAddressId) {
        toast({
          title: "Hata",
          description: "Lütfen bir teslimat adresi seçin",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
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
        email: session.user.email,
        shippingName: selectedAddress.name,
        shippingPhone: selectedAddress.phone,
        shippingAddressLine1: selectedAddress.address_line1,
        shippingAddressLine2: selectedAddress.address_line2 || "",
        city: selectedAddress.city,
        district: selectedAddress.district,
        postalCode: selectedAddress.postal_code,
        saveAddress: false,
        addressTitle: undefined,
      };
    } else {
      // For guests, use form data
      shippingData = {
        email: formData.get("email") as string,
        shippingName: formData.get("shippingName") as string,
        shippingPhone: formData.get("shippingPhone") as string,
        shippingAddressLine1: formData.get("shippingAddressLine1") as string,
        shippingAddressLine2: formData.get("shippingAddressLine2") as string,
        city: formData.get("city") as string,
        district: formData.get("district") as string,
        postalCode: formData.get("postalCode") as string,
        saveAddress: false,
        addressTitle: undefined,
      };
    }

    const data = {
      ...shippingData,
      country: "TR",
      couponCode: formData.get("couponCode") as string,
    };

    try {
      console.log("🛒 Sipariş oluşturuluyor...");
      console.log("⏰ Başlangıç:", new Date().toISOString());
      
      // 60 saniye timeout (daha uzun)
      const orderPromise = createOrder(data);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => {
          console.error("⏱️ Frontend timeout! 60 saniye doldu");
          reject(new Error("İstek zaman aşımına uğradı (60s)"));
        }, 60000)
      );
      
      const result = await Promise.race([orderPromise, timeoutPromise]) as any;
      console.log("✅ Sipariş yanıt aldı:", new Date().toISOString());

      console.log("Order result:", result);

      if (result.success && result.paymentPageUrl) {
        console.log("✅ Ödeme sayfasına yönlendiriliyor...");
        window.location.href = result.paymentPageUrl;
      } else {
        console.error("❌ Sipariş hatası:", result.error);
        
        toast({
          title: "Sipariş Oluşturulamadı",
          description: result.error || "Ödeme sistemine bağlanılamadı. Sepetiniz korundu, lütfen tekrar deneyin.",
          variant: "destructive",
        });
        
        setLoading(false);
        
        // 2 saniye sonra sepete yönlendir
        setTimeout(() => {
          router.push("/cart");
        }, 2000);
      }
    } catch (error: any) {
      console.error("💥 Checkout error:", error);
      
      toast({
        title: "Bağlantı Hatası",
        description: "Ödeme sistemine bağlanılamadı. Sepetiniz korundu, lütfen tekrar deneyin.",
        variant: "destructive",
      });
      
      setLoading(false);
      
      // 2 saniye sonra sepete yönlendir
      setTimeout(() => {
        router.push("/cart");
      }, 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Ödeme</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Right Side - Order Summary (Mobile First) */}
        <div className="lg:col-span-1 lg:order-last order-first">
          <div className="lg:sticky lg:top-24">
            <Card className="border-2 border-primary/20">
              <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Sipariş Özeti
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart?.items?.map((item: any) => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {item.quantity}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.quantity} x {formatPrice(item.product.price)}
                        </p>
                        <p className="text-sm font-semibold mt-1">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Kargo</span>
                    </div>
                    <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                      {shippingCost === 0 ? 'Ücretsiz' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  
                  {/* Free shipping progress */}
                  {remainingForFreeShipping !== null && remainingForFreeShipping > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs text-amber-800 font-medium">
                        ✨ Ücretsiz kargo için sadece {formatPrice(remainingForFreeShipping)} daha ekleyin!
                      </p>
                    </div>
                  )}
                  
                  {shippingCost === 0 && subtotal > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-800 font-medium flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        🎉 Ücretsiz kargo kazandınız!
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-bold pt-3 border-t">
                    <span>Toplam</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-6 p-3 bg-primary/5 rounded-lg">
                  <p className="text-xs text-muted-foreground text-center">
                    🔒 Güvenli ödeme ile korunan alışveriş
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Left Side - Form */}
        <div className="lg:col-span-2 order-last lg:order-first">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Info - Only for guests */}
            {!isLoggedIn && (
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
            )}

            {/* Addresses for logged-in users */}
            {isLoggedIn && (
              <Card>
                <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Teslimat Adresi
                    </CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddressDialog(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Yeni Adres
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                  {addresses.length > 0 ? (
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
                  ) : (
                    <div className="text-center py-8">
                      <Home className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">Henüz kayıtlı adresiniz yok</p>
                      <Button
                        type="button"
                        onClick={() => setShowAddressDialog(true)}
                        className="bg-olive-gradient"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        İlk Adresinizi Ekleyin
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Shipping Address Form - Only for guests */}
            {!isLoggedIn && (
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
                </CardContent>
              </Card>
            )}

            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle>İndirim Kodu (Opsiyonel)</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  id="couponCode"
                  name="couponCode"
                  type="text"
                  placeholder="KUPON KODUNUZ"
                  className="uppercase"
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full bg-olive-gradient" disabled={loading}>
              {loading ? "İşleniyor..." : "Ödemeye Geç"}
            </Button>
          </form>
        </div>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yeni Adres Ekle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAddress} className="space-y-4">
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

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddressDialog(false)}
              >
                İptal
              </Button>
              <Button type="submit" disabled={addingAddress} className="bg-olive-gradient">
                {addingAddress ? "Ekleniyor..." : "Adres Ekle"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
