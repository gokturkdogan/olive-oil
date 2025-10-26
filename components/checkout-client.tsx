"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
// Client component, shipping fee server-side calculated
import { extractProductImages } from "@/lib/image-utils";

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
  shippingFee: number;
  remainingForFreeShipping: number | null;
  freeShippingReason?: string;
}

export function CheckoutClient({ session, cart, addresses: initialAddresses, loyaltyTier, shippingFee, remainingForFreeShipping, freeShippingReason }: CheckoutClientProps) {
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    initialAddresses.find((a) => a.is_default)?.id || null
  );
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isLoggedIn = !!session?.user;

  // Check if user came back from payment (URL has payment_return parameter)
  useEffect(() => {
    const paymentReturn = searchParams.get('payment_return');
    const error = searchParams.get('error');
    
    if (paymentReturn === 'true') {

      
      // Clean up user's PENDING orders
      const cleanupPendingOrders = async () => {
        try {
          const response = await fetch("/api/admin/cleanup-pending-orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userEmail: session?.user?.email,
              userId: session?.user?.id,
              cleanupUser: true
            })
          });
          
          if (response.ok) {
            const result = await response.json();

            
            // Show appropriate toast based on error
            if (error) {
              toast({
                title: "Ödeme İptal Edildi",
                description: "Ödeme işlemi iptal edildi. Sepetiniz korundu, yeni sipariş verebilirsiniz.",
                variant: "default",
              });
            } else {
              toast({
                title: "Bilgi",
                description: "Önceki sipariş işlemi temizlendi. Yeni sipariş verebilirsiniz.",
                variant: "default",
              });
            }
          }
        } catch (error) {
          console.error("❌ PENDING order temizleme hatası:", error);
        }
      };
      
      cleanupPendingOrders();
      
      // Remove the parameters from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('payment_return');
      newUrl.searchParams.delete('error');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, session?.user?.email, session?.user?.id, toast]);

  // Calculate totals
  const subtotal = cart?.items?.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0
  ) || 0;
  
  // Shipping fee from server (already calculated)
  
  const total = subtotal + shippingFee;

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
        title: "Başarılı! ✓",
        description: "Adres eklendi",
        variant: "success",
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


      
      // 60 saniye timeout (daha uzun)
      const orderPromise = createOrder(data);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => {
          console.error("⏱️ Frontend timeout! 60 saniye doldu");
          reject(new Error("İstek zaman aşımına uğradı (60s)"));
        }, 60000)
      );
      
      const result = await Promise.race([orderPromise, timeoutPromise]) as any;




      if (result.success && result.paymentPageUrl) {

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 py-12 md:py-16 px-4">
        {/* Animated Background Blobs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">Güvenli Ödeme</span>
            </div>
            
            {/* Icon */}
            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/30">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-white leading-tight">
              Ödeme
            </h1>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/90 font-medium">
              Siparişinizi tamamlayın
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Right Side - Order Summary (Mobile First) */}
            <div className="lg:col-span-1 lg:order-last order-first">
              <div className="lg:sticky lg:top-24">
                <Card className="border-2 border-green-200 shadow-2xl shadow-green-500/10 bg-white hover:shadow-3xl hover:border-green-300 transition-all duration-500">
                  <CardHeader className="bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <ShoppingBag className="h-5 w-5 text-green-600" />
                      Sipariş Özeti
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Cart Items */}
                    <div className="space-y-4 mb-6">
                      {cart?.items?.map((item: any) => {
                        const imageArray = extractProductImages(item.product.images);
                        const hasImages = imageArray.length > 0;
                        
                        return (
                          <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-green-100 to-emerald-100">
                              {hasImages && (
                                <img
                                  src={imageArray[0]}
                                  alt={item.product.title}
                                  className="w-full h-full object-cover rounded-xl"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (nextElement) {
                                      nextElement.style.display = 'flex';
                                    }
                                  }}
                                />
                              )}
                              <div className="flex items-center justify-center h-full" style={{ display: hasImages ? 'none' : 'flex' }}>
                                <Package className="h-8 w-8 text-green-600" />
                              </div>
                              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                                {item.quantity}
                              </Badge>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate text-gray-800">{item.product.title}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {item.quantity} x {formatPrice(item.product.price)}
                              </p>
                              <p className="text-sm font-bold mt-1 text-green-600">
                                {formatPrice(item.product.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Price Summary */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ara Toplam</span>
                        <span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Truck className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Kargo</span>
                        </div>
                        <span className={`font-semibold ${shippingFee === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                          {shippingFee === 0 ? 'Ücretsiz' : formatPrice(shippingFee)}
                        </span>
                      </div>
                      
                      {/* Free shipping progress */}
                      {remainingForFreeShipping !== null && remainingForFreeShipping > 0 && (
                        <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                          <p className="text-xs text-amber-800 font-semibold">
                            ✨ {formatPrice(remainingForFreeShipping)} daha ekleyin, ücretsiz kargo kazanın!
                          </p>
                        </div>
                      )}
                      
                      {shippingFee === 0 && subtotal > 0 && (
                        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                          <p className="text-xs text-green-800 font-semibold flex items-center gap-1">
                            <Truck className="h-4 w-4" />
                            {freeShippingReason && `${freeShippingReason} `}Ücretsiz kargo kazandınız!
                          </p>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                        <span className="text-gray-800">Toplam</span>
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{formatPrice(total)}</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <p className="text-xs text-gray-600 text-center font-medium">
                        Güvenli ödeme ile korunan alışveriş
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
                  <Card className="border-2 border-green-200 shadow-lg shadow-green-500/10 bg-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
                    <CardHeader className="bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                      <CardTitle className="text-gray-800">İletişim Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div>
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">E-posta</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="ornek@email.com"
                          className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Addresses for logged-in users */}
                {isLoggedIn && (
                  <Card className="border-2 border-green-200 shadow-lg shadow-green-500/10 bg-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
                    <CardHeader className="bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-gray-800">
                          <MapPin className="h-5 w-5 text-green-600" />
                          Teslimat Adresi
                        </CardTitle>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddressDialog(true)}
                          className="flex items-center gap-2 border-2 border-green-200 hover:border-green-500 hover:bg-green-50 text-green-700 transition-all duration-300"
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
                                  ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-500/20"
                                  : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold">{address.title}</p>
                                    {address.is_default && (
                                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs font-semibold">
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
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
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
                          <Home className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 mb-4 font-medium">Henüz kayıtlı adresiniz yok</p>
                          <Button
                            type="button"
                            onClick={() => setShowAddressDialog(true)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold"
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
                  <Card className="border-2 border-green-200 shadow-lg shadow-green-500/10 bg-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
                    <CardHeader className="bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                      <CardTitle className="text-gray-800">Teslimat Adresi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div>
                        <Label htmlFor="shippingName" className="text-sm font-semibold text-gray-700">Ad Soyad</Label>
                        <Input
                          id="shippingName"
                          name="shippingName"
                          type="text"
                          required
                          placeholder="Ahmet Yılmaz"
                          className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
                        />
                      </div>

                      <div>
                        <Label htmlFor="shippingPhone" className="text-sm font-semibold text-gray-700">Telefon</Label>
                        <Input
                          id="shippingPhone"
                          name="shippingPhone"
                          type="tel"
                          required
                          placeholder="+90 555 123 4567"
                          className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
                        />
                      </div>

                      <div>
                        <Label htmlFor="shippingAddressLine1" className="text-sm font-semibold text-gray-700">Adres</Label>
                        <Input
                          id="shippingAddressLine1"
                          name="shippingAddressLine1"
                          type="text"
                          required
                          placeholder="Sokak, No, Daire"
                          className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
                        />
                      </div>

                      <div>
                        <Label htmlFor="shippingAddressLine2" className="text-sm font-semibold text-gray-700">
                          Adres Devamı (Opsiyonel)
                        </Label>
                        <Input
                          id="shippingAddressLine2"
                          name="shippingAddressLine2"
                          type="text"
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
                            type="text"
                            required
                            placeholder="İstanbul"
                            className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
                          />
                        </div>

                        <div>
                          <Label htmlFor="district" className="text-sm font-semibold text-gray-700">İlçe</Label>
                          <Input
                            id="district"
                            name="district"
                            type="text"
                            required
                            placeholder="Kadıköy"
                            className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="postalCode" className="text-sm font-semibold text-gray-700">Posta Kodu</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          type="text"
                          required
                          placeholder="34000"
                          className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Coupon Code */}
                <Card className="border-2 border-green-200 shadow-lg shadow-green-500/10 bg-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
                  <CardHeader className="bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                    <CardTitle className="text-gray-800">İndirim Kodu (Opsiyonel)</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Input
                      id="couponCode"
                      name="couponCode"
                      type="text"
                      placeholder="KUPON KODUNUZ"
                      className="uppercase border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300"
                    />
                  </CardContent>
                </Card>

                {/* Submit */}
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold py-4 text-lg" 
                  disabled={loading}
                >
                  {loading ? "İşleniyor..." : "Ödemeye Geç"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-green-200 shadow-2xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-800">Yeni Adres Ekle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAddress} className="space-y-5">
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
                onClick={() => setShowAddressDialog(false)}
                className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                İptal
              </Button>
              <Button 
                type="submit" 
                disabled={addingAddress} 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold"
              >
                {addingAddress ? "Ekleniyor..." : "Adres Ekle"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}