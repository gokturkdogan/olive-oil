import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, Truck, Mail, Home, Leaf, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";

function SuccessContent({ orderId }: { orderId?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 py-8 md:py-12 px-4">
        {/* Animated Background Blobs */}
        <div className="absolute top-5 right-5 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-5 left-5 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">Sipariş Başarılı</span>
            </div>
            
            {/* Icon */}
            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/30">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white leading-tight">
              Siparişiniz Alındı!
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base text-white/90 font-medium max-w-2xl mx-auto">
              Ödemeniz başarıyla tamamlandı. Teşekkür ederiz!
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-green-200 shadow-2xl shadow-green-500/10 bg-white hover:shadow-3xl hover:border-green-300 transition-all duration-500">
            <CardContent className="pt-8 pb-8 px-6 md:px-12">
              {/* Order Number */}
              {orderId && (
                <div className="text-center mb-8">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-base px-6 py-3 font-semibold shadow-lg">
                    <Package className="mr-2 h-4 w-4" />
                    Sipariş No: <span className="font-bold ml-1">{orderId}</span>
                  </Badge>
                </div>
              )}

              {/* Info Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="border-2 border-green-200 rounded-xl p-6 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg hover:border-green-300 transition-all duration-300">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl w-fit mb-4">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold mb-2 text-gray-800">Hızlı Kargo</h3>
                  <p className="text-sm text-gray-600">En kısa sürede kargoya verilecek</p>
                </div>
                
                <div className="border-2 border-blue-200 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl w-fit mb-4">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold mb-2 text-gray-800">E-posta Onayı</h3>
                  <p className="text-sm text-gray-600">Detaylı bilgi gönderildi</p>
                </div>
                
                <div className="border-2 border-green-200 rounded-xl p-6 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg hover:border-green-300 transition-all duration-300">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl w-fit mb-4">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold mb-2 text-gray-800">Premium Kalite</h3>
                  <p className="text-sm text-gray-600">%100 doğal ürünler</p>
                </div>
              </div>

              {/* Message */}
              <div className="text-center mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <p className="text-gray-700 font-medium">
                  Siparişinizin durumunu <span className="font-bold text-green-600">Siparişlerim</span> sayfasından takip edebilirsiniz.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/profile/orders">
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold w-full sm:w-auto">
                    <Package className="mr-2 h-5 w-5" />
                    Siparişlerimi Görüntüle
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 text-gray-700 hover:text-green-700 transition-all duration-300 w-full sm:w-auto">
                    <Home className="mr-2 h-5 w-5" />
                    Ana Sayfaya Dön
                  </Button>
                </Link>
              </div>

              {/* Thank You Message */}
              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 font-medium">
                  Bizi tercih ettiğiniz için teşekkür ederiz! 🌿
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    }>
      <SuccessContent orderId={params.order} />
    </Suspense>
  );
}