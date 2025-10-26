"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Truck, Settings, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

export default function AdminShippingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [baseShippingFee, setBaseShippingFee] = useState<string>("25");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<string>("1000");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/shipping-settings");
      if (response.ok) {
        const data = await response.json();
        const settings = data.settings;
        
        // Kuruş'tan TL'ye çevir
        setBaseShippingFee((settings.base_shipping_fee / 100).toString());
        setFreeShippingThreshold((settings.free_shipping_threshold / 100).toString());
        setActive(settings.active);
      }
    } catch (error) {
      console.error("Settings fetch error:", error);
      toast({
        title: "Hata",
        description: "Ayarlar yüklenemedi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/shipping-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base_shipping_fee: parseFloat(baseShippingFee),
          free_shipping_threshold: parseFloat(freeShippingThreshold),
          active,
        }),
      });

      if (response.ok) {
        toast({
          title: "Başarılı",
          description: "Kargo ayarları güncellendi",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Hata",
          description: error.error || "Ayarlar güncellenemedi",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Save settings error:", error);
      toast({
        title: "Hata",
        description: "Ayarlar kaydedilemedi",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/admin")}
              variant="ghost"
              size="icon"
              className="hover:bg-white/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Truck className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Kargo Yönetimi</h1>
                <p className="text-green-100 text-sm mt-1">
                  Kargo ücreti ve ücretsiz kargo eşiği ayarları
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Card */}
        <Card className="border-2 border-green-100 shadow-xl bg-white">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-green-100">
              <Settings className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Kargo Ayarları</h2>
            </div>

            {/* Base Shipping Fee */}
            <div className="mb-6">
              <Label htmlFor="base-fee" className="text-base font-semibold mb-2 block">
                Kargo Ücreti (TL)
              </Label>
              <Input
                id="base-fee"
                type="number"
                step="0.01"
                value={baseShippingFee}
                onChange={(e) => setBaseShippingFee(e.target.value)}
                placeholder="25.00"
                className="text-lg"
              />
              <p className="text-sm text-gray-500 mt-2">
                Bu ücret sepet tutarı ücretsiz kargo eşiğinin altındayken uygulanır
              </p>
            </div>

            {/* Free Shipping Threshold */}
            <div className="mb-6">
              <Label htmlFor="threshold" className="text-base font-semibold mb-2 block">
                Ücretsiz Kargo Eşiği (TL)
              </Label>
              <Input
                id="threshold"
                type="number"
                step="0.01"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                placeholder="1000.00"
                className="text-lg"
              />
              <p className="text-sm text-gray-500 mt-2">
                Sepet tutarı bu değerin üzerinde olduğunda kargo ücretsiz olur
              </p>
            </div>

            {/* Active Status */}
            <div className="mb-8 flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <Label htmlFor="active" className="text-base font-semibold mb-1 block">
                  Aktif
                </Label>
                <p className="text-sm text-gray-600">
                  Kargo ayarlarını aktif/pasif yap
                </p>
              </div>
              <Switch
                id="active"
                checked={active}
                onCheckedChange={setActive}
              />
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 text-lg shadow-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Ayarları Kaydet
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-2 border-blue-100 bg-blue-50">
          <div className="p-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Bilgilendirme
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Kargo ücreti kuruş cinsinden veritabanında saklanır</li>
              <li>• Ücretsiz kargo eşiği sepetteki toplam tutarı kontrol eder</li>
              <li>• Ayarlar anında tüm siparişlerde uygulanır</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

