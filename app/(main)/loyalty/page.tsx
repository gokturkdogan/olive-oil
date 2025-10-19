import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Crown, Gem, Check, Gift, Truck, Percent, Star } from "lucide-react";

export default function LoyaltyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-olive-gradient-soft to-white">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-olive-gradient-soft py-12 md:py-16 lg:py-20 px-4 border-b border-primary/10">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-52 h-52 md:w-80 md:h-80 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="bg-white/90 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl border-2 border-primary/20">
            <Trophy className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-gray-900 leading-tight">
            <span className="text-gradient">Sadakat Programı</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Alışverişlerinizle puan kazanın, özel avantajlardan yararlanın
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <Card className="mb-8 border-2 border-primary/20 shadow-xl">
            <CardContent className="py-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Nasıl Çalışır?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Her alışverişinizde harcadığınız tutar kadar puan kazanırsınız. 
                Toplam harcamanıza göre seviyeniz yükselir ve daha fazla avantajdan yararlanırsınız!
              </p>
            </CardContent>
          </Card>

          {/* Loyalty Tiers */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Standard Tier */}
            <Card className="border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Star className="h-10 w-10 text-gray-600" />
                </div>
                <CardTitle className="text-2xl">Standart</CardTitle>
                <Badge className="bg-gray-100 text-gray-800 border-gray-300 mx-auto mt-2">
                  Başlangıç Seviyesi
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Harcama Limiti</p>
                  <p className="text-xl font-bold text-gray-800">0 - 5.000 TL</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Standart kargo hızı</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Temel müşteri desteği</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Kampanya bildirimleri</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gold Tier */}
            <Card className="border-2 border-amber-300 hover:border-amber-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-white to-amber-50/30">
              <CardHeader className="text-center pb-4">
                <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award className="h-10 w-10 text-amber-600" />
                </div>
                <CardTitle className="text-2xl text-amber-800">Gold</CardTitle>
                <Badge className="bg-amber-100 text-amber-800 border-amber-300 mx-auto mt-2">
                  5.000 TL+
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Sepet İndirimi</p>
                  <p className="text-3xl font-bold text-amber-600">%5</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-medium">%5 sepet indirimi</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Öncelikli kargo</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Özel kampanyalar</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Doğum günü hediyesi</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Yeni ürünlere erken erişim</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platinum Tier */}
            <Card className="border-2 border-slate-300 hover:border-slate-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-white to-slate-50/30">
              <CardHeader className="text-center pb-4">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Gem className="h-10 w-10 text-slate-600" />
                </div>
                <CardTitle className="text-2xl text-slate-800">Platinum</CardTitle>
                <Badge className="bg-slate-100 text-slate-800 border-slate-400 mx-auto mt-2">
                  10.000 TL+
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Sepet İndirimi</p>
                  <p className="text-3xl font-bold text-slate-600">%10</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-medium">%10 sepet indirimi</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-medium">Ücretsiz kargo</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Yeni ürünlere erken erişim</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Diamond Tier */}
            <Card className="border-2 border-blue-400 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full blur-2xl"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Crown className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-blue-800">Diamond</CardTitle>
                <Badge className="bg-blue-100 text-blue-800 border-blue-400 mx-auto mt-2">
                  15.000 TL+
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Sepet İndirimi</p>
                  <p className="text-3xl font-bold text-blue-600">%15</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-medium">%15 sepet indirimi</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-medium">Tüm kargolar ücretsiz</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Sürpriz hediyeler</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Yeni ürünlere erken erişim</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="mb-8 border-2 border-primary/20 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl mb-2">
                Seviye Atlama Sistemi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-olive-gradient-soft rounded-xl">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Gift className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Alışveriş Yapın</h3>
                  <p className="text-sm text-gray-600">
                    Her siparişinizde toplam harcamanız artıyor
                  </p>
                </div>

                <div className="text-center p-6 bg-olive-gradient-soft rounded-xl">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Seviye Atlayın</h3>
                  <p className="text-sm text-gray-600">
                    Toplam harcamanız arttıkça seviyeniz yükseliyor
                  </p>
                </div>

                <div className="text-center p-6 bg-olive-gradient-soft rounded-xl">
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Percent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">İndirim Kazanın</h3>
                  <p className="text-sm text-gray-600">
                    Yüksek seviyelerde otomatik sepet indirimi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Comparison */}
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl mb-2">
                Avantaj Karşılaştırması
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-primary/20">
                    <th className="text-left py-4 px-4 text-gray-700 font-semibold">Avantaj</th>
                    <th className="text-center py-4 px-2 text-gray-600">
                      <div className="flex flex-col items-center gap-1">
                        <Star className="h-5 w-5 text-gray-500" />
                        <span className="text-xs">Standart</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-2 text-amber-700">
                      <div className="flex flex-col items-center gap-1">
                        <Award className="h-5 w-5 text-amber-600" />
                        <span className="text-xs">Gold</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-2 text-slate-700">
                      <div className="flex flex-col items-center gap-1">
                        <Gem className="h-5 w-5 text-slate-600" />
                        <span className="text-xs">Platinum</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-2 text-blue-700">
                      <div className="flex flex-col items-center gap-1">
                        <Crown className="h-5 w-5 text-blue-600" />
                        <span className="text-xs">Diamond</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4 font-medium">Sepet İndirimi</td>
                    <td className="text-center py-4 px-2">-</td>
                    <td className="text-center py-4 px-2 font-bold text-amber-600">%5</td>
                    <td className="text-center py-4 px-2 font-bold text-slate-600">%10</td>
                    <td className="text-center py-4 px-2 font-bold text-blue-600">%15</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4 font-medium">Ücretsiz Kargo</td>
                    <td className="text-center py-4 px-2 text-gray-400">✗</td>
                    <td className="text-center py-4 px-2 text-gray-400">✗</td>
                    <td className="text-center py-4 px-2 text-primary">✓</td>
                    <td className="text-center py-4 px-2 text-primary">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4 font-medium">Öncelikli Kargo</td>
                    <td className="text-center py-4 px-2 text-gray-400">✗</td>
                    <td className="text-center py-4 px-2 text-primary">✓</td>
                    <td className="text-center py-4 px-2 text-primary">✓</td>
                    <td className="text-center py-4 px-2 text-primary">✓</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-4 font-medium">Özel Kampanyalar</td>
                    <td className="text-center py-4 px-2 text-gray-400">✗</td>
                    <td className="text-center py-4 px-2 text-primary">✓</td>
                    <td className="text-center py-4 px-2 text-primary">✓</td>
                    <td className="text-center py-4 px-2 text-primary">✓</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">
              Sık Sorulan Sorular
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">Seviyem nasıl yükselir?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Tamamlanan (teslim edilen) siparişlerinizin toplam tutarı arttıkça seviyeniz otomatik olarak yükselir.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">İndirim ne zaman geçerli?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Seviyenize göre belirlenen indirim oranı, sepetinize otomatik olarak uygulanır. Ödeme sayfasında görebilirsiniz.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">Seviyem düşer mi?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Hayır! Bir kez ulaştığınız seviye kalıcıdır. Toplam harcamanız hiçbir zaman azalmaz.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">Kaydolmam gerekir mi?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Evet, sadakat programından yararlanmak için üye olmanız gerekmektedir. Misafir siparişler programa dahil değildir.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Card className="border-2 border-primary/20 bg-olive-gradient text-white shadow-xl">
              <CardContent className="py-12">
                <Trophy className="h-16 w-16 mx-auto mb-6 text-white" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Hemen Başlayın!
                </h2>
                <p className="text-lg mb-6 opacity-95 max-w-2xl mx-auto">
                  İlk alışverişinizle sadakat programına katılın ve avantajlardan yararlanmaya başlayın.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

