import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Crown, Gem, Check, Gift, Truck, Percent, Star, Sparkles, Zap } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";

async function getShippingThreshold() {
  const settings = await db.shippingSettings.findFirst();
  return settings?.free_shipping_threshold || 200000; // Default 2000 TL in kurus
}

export default async function LoyaltyPage() {
  const shippingThreshold = await getShippingThreshold();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Header - Green Theme */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50/50 to-white py-16 md:py-20 px-4">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-gradient-to-br from-green-300/20 to-emerald-300/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-gradient-to-tr from-amber-300/15 to-lime-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          {/* Premium Badge */}
          <div className="mb-8 animate-fadeInUp">
            <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-green-800 px-5 py-2.5 rounded-full text-sm font-semibold border border-green-200 shadow-xl hover:scale-105 transition-all duration-300">
              <Trophy className="w-4 h-4 text-amber-500" />
              Sadakat Programı
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fadeInUp leading-tight">
            Alışveriş Yapın,
            <br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-lime-600 bg-clip-text text-transparent">
              Ödüllendirilir
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fadeInUp">
            Her alışverişinizde kazanın, özel avantajlardan yararlanın
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* How It Works Widgets - Green Theme */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
              Nasıl <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Çalışır</span>?
            </h2>
            <p className="text-center text-gray-600 mb-10">Üç basit adımda avantajlar</p>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Widget 1 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-all duration-500"></div>
                <div className="relative bg-white rounded-2xl border-2 border-gray-200 hover:border-green-400 shadow-lg hover:shadow-xl p-6 text-center transition-all duration-500 hover:-translate-y-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Gift className="h-7 w-7 text-white" />
                  </div>
                  <div className="mb-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-2">
                      1
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-green-700 transition-colors">Alışveriş Yapın</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Her siparişinizde toplam harcamanız otomatik olarak birikir
                  </p>
                </div>
              </div>

              {/* Widget 2 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-all duration-500"></div>
                <div className="relative bg-white rounded-2xl border-2 border-gray-200 hover:border-amber-400 shadow-lg hover:shadow-xl p-6 text-center transition-all duration-500 hover:-translate-y-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <div className="mb-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-700 rounded-full text-sm font-bold mb-2">
                      2
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-amber-600 transition-colors">Seviye Atlayın</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Harcama limitine ulaşınca otomatik yükseltme
                  </p>
                </div>
              </div>

              {/* Widget 3 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500 to-lime-600 rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-all duration-500"></div>
                <div className="relative bg-white rounded-2xl border-2 border-gray-200 hover:border-lime-400 shadow-lg hover:shadow-xl p-6 text-center transition-all duration-500 hover:-translate-y-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-lime-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Percent className="h-7 w-7 text-white" />
                  </div>
                  <div className="mb-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-lime-100 text-lime-700 rounded-full text-sm font-bold mb-2">
                      3
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-lime-600 transition-colors">Avantajlar Kazanın</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    İndirim, ücretsiz kargo ve özel ayrıcalıklar
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Loyalty Tiers Header */}
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3">
              Üyelik <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Seviyeleri</span>
            </h2>
            <p className="text-center text-gray-600">Harcamanız arttıkça daha fazla kazanın</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Standard Tier */}
            <div className="group relative h-full">
              <div className="absolute -inset-1 bg-gradient-to-br from-gray-400 to-gray-600 rounded-3xl opacity-0 group-hover:opacity-15 blur-xl transition-all duration-700"></div>
              
              <Card className="relative h-full flex flex-col border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <CardHeader className="relative text-center pb-4 pt-8">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gray-400 rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                    <div className="relative bg-gradient-to-br from-gray-400 to-gray-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                      <Star className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Standart</CardTitle>
                  <Badge className="bg-gray-100 text-gray-800 border border-gray-300 mx-auto mt-3 px-3 py-1">
                    0 - 5.000 TL
                  </Badge>
                </CardHeader>
                <CardContent className="relative space-y-3 pb-6 flex-1 flex flex-col justify-start">
                  <div className="text-center mb-4 pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">İndirim</p>
                    <p className="text-4xl font-black text-gray-600">-</p>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2 text-sm">
                      <div className="bg-gray-100 p-1 rounded-lg flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-gray-700" />
                      </div>
                      <span className="text-gray-700">{(shippingThreshold / 100).toFixed(0)} TL üzeri ücretsiz kargo</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="bg-gray-100 p-1 rounded-lg flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-gray-700" />
                      </div>
                      <span className="text-gray-700">Kampanya bildirimleri</span>
                    </div>
                  </div>
                </CardContent>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 to-gray-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </Card>
            </div>

            {/* Gold Tier */}
            <div className="group relative h-full">
              <div className="absolute -inset-1 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700"></div>
              
              <Card className="relative h-full flex flex-col border-2 border-amber-300 hover:border-amber-500 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <CardHeader className="relative text-center pb-4 pt-8">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-amber-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="relative bg-gradient-to-br from-amber-500 to-yellow-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                      <Award className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-amber-800 group-hover:text-amber-600 transition-colors">Gold</CardTitle>
                  <Badge className="bg-amber-100 text-amber-800 border border-amber-300 mx-auto mt-3 px-3 py-1">
                    5.000 TL+
                  </Badge>
                </CardHeader>
                <CardContent className="relative space-y-3 pb-6 flex-1 flex flex-col justify-start">
                  <div className="text-center mb-4 pb-4 border-b border-amber-200">
                    <p className="text-xs text-gray-600 mb-1">İndirim</p>
                    <p className="text-4xl font-black text-amber-600">%5</p>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2 text-sm">
                      <div className="bg-amber-100 p-1 rounded-lg flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-amber-700" />
                      </div>
                      <span className="text-gray-700 font-medium">%5 sepet indirimi</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="bg-amber-100 p-1 rounded-lg flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-amber-700" />
                      </div>
                      <span className="text-gray-700">{(shippingThreshold / 100).toFixed(0)} TL üzeri ücretsiz kargo</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="bg-amber-100 p-1 rounded-lg flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-amber-700" />
                      </div>
                      <span className="text-gray-700">Kampanya bildirimleri</span>
                    </div>
                  </div>
                </CardContent>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </Card>
            </div>

            {/* Platinum Tier */}
            <div className="group relative h-full">
              <div className="absolute -inset-1 bg-gradient-to-br from-slate-400 to-gray-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700"></div>
              
              <Card className="relative h-full flex flex-col border-2 border-slate-300 hover:border-slate-500 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <CardHeader className="relative text-center pb-4 pt-8">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-slate-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="relative bg-gradient-to-br from-slate-500 to-gray-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                      <Gem className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-slate-600 transition-colors">Platinum</CardTitle>
                  <Badge className="bg-slate-100 text-slate-800 border border-slate-400 mx-auto mt-3 px-3 py-1">
                    10.000 TL+
                  </Badge>
                </CardHeader>
                <CardContent className="relative space-y-3 pb-6 flex-1 flex flex-col justify-start">
                  <div className="text-center mb-4 pb-4 border-b border-slate-200">
                    <p className="text-xs text-gray-600 mb-1">İndirim</p>
                    <p className="text-4xl font-black text-slate-600">%10</p>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2 text-sm">
                      <div className="bg-slate-100 p-1 rounded-lg flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-slate-700" />
                      </div>
                      <span className="text-gray-700 font-medium">%10 sepet indirimi</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="bg-slate-100 p-1 rounded-lg flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-slate-700" />
                      </div>
                      <span className="text-gray-700 font-medium">Her zaman ücretsiz kargo</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="bg-slate-100 p-1 rounded-lg flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-slate-700" />
                      </div>
                      <span className="text-gray-700">Platinuma özel kampanyalar</span>
                    </div>
                  </div>
                </CardContent>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-500 to-gray-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </Card>
            </div>

            {/* Diamond Tier - VIP */}
            <div className="group relative h-full">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl opacity-0 group-hover:opacity-25 blur-xl transition-all duration-700 animate-pulse"></div>
              
              <Card className="relative h-full flex flex-col border-2 border-blue-400 hover:border-blue-600 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-white overflow-hidden">
                {/* Sparkle effect */}
                <div className="absolute top-4 right-4">
                  <Sparkles className="h-5 w-5 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <CardHeader className="relative text-center pb-4 pt-8">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                      <Crown className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-800 group-hover:text-blue-600 transition-colors">Diamond</CardTitle>
                  <Badge className="bg-blue-100 text-blue-800 border border-blue-400 mx-auto mt-3 px-3 py-1 font-bold">
                    15.000 TL+
                  </Badge>
                </CardHeader>
                <CardContent className="relative space-y-3 pb-6 flex-1 flex flex-col justify-start">
                  <div className="text-center mb-4 pb-4 border-b border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">İndirim</p>
                    <p className="text-4xl font-black text-blue-600">%15</p>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2 text-sm">
                      <div className="bg-blue-100 p-1 rounded-lg flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-blue-700" />
                      </div>
                      <span className="text-gray-700 font-bold">%15 sepet indirimi</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="bg-blue-100 p-1 rounded-lg flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-blue-700" />
                      </div>
                      <span className="text-gray-700 font-bold">Her zaman ücretsiz kargo</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="bg-blue-100 p-1 rounded-lg flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-blue-700" />
                      </div>
                      <span className="text-gray-700">Diamonda özel kampanyalar</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="bg-blue-100 p-1 rounded-lg flex-shrink-0">
                        <Check className="h-3.5 w-3.5 text-blue-700" />
                      </div>
                      <span className="text-gray-700">VIP hediyeler</span>
                    </div>
                  </div>
                </CardContent>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </Card>
            </div>
          </div>

          {/* Benefits Widget - Green Theme */}
          <div className="mb-16 max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
              Tüm Seviyelerde <span className="text-green-700">Ortak Avantajlar</span>
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-green-300 hover:shadow-lg transition-all duration-300">
                <Truck className="h-6 w-6 text-green-700 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Hızlı Kargo</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-green-300 hover:shadow-lg transition-all duration-300">
                <Star className="h-6 w-6 text-green-700 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Özel Kampanyalar</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-green-300 hover:shadow-lg transition-all duration-300">
                <Gift className="h-6 w-6 text-green-700 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Sürpriz Hediyeler</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-green-300 hover:shadow-lg transition-all duration-300">
                <Sparkles className="h-6 w-6 text-green-700 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Yeni Ürünler</p>
              </div>
            </div>
          </div>

          {/* FAQ Widget */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
              Sık Sorulan <span className="text-green-700">Sorular</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-5 blur-lg transition-all duration-500"></div>
                <Card className="relative border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-base flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
                      Seviyem nasıl yükselir?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Tamamlanan siparişlerinizin toplam tutarı arttıkça seviyeniz otomatik olarak yükselir.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-5 blur-lg transition-all duration-500"></div>
                <Card className="relative border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-base flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
                      İndirim nasıl uygulanır?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Seviyenize göre indirim sepetinize otomatik uygulanır. Ödeme sayfasında görebilirsiniz.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-5 blur-lg transition-all duration-500"></div>
                <Card className="relative border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-base flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
                      Seviyem düşer mi?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Hayır! Ulaştığınız seviye kalıcıdır. Toplam harcamanız hiçbir zaman azalmaz.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-5 blur-lg transition-all duration-500"></div>
                <Card className="relative border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-base flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
                      Üye olmam gerekir mi?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Evet, programdan yararlanmak için üye olmanız gerekir. Misafir siparişler dahil değildir.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

