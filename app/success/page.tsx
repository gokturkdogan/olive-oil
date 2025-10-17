import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, Truck, Mail, Home, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";

function SuccessContent({ orderId }: { orderId?: string }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-primary/5 to-green-50 -z-10"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-olive-gradient opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-olive-gradient opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-3xl mx-auto w-full">
        <Card className="border-2 border-green-200 shadow-2xl overflow-hidden animate-fadeInUp">
          <CardContent className="pt-12 pb-12 px-6 md:px-12">
            {/* Success Icon */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-olive-gradient opacity-20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full p-6 inline-block shadow-xl">
                <CheckCircle className="h-16 w-16 md:h-20 md:w-20 text-white animate-bounce" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gradient animate-fadeIn">
              🎉 Siparişiniz Alındı!
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              Ödemeniz başarıyla tamamlandı. Teşekkür ederiz!
            </p>

            {/* Order Number */}
            {orderId && (
              <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <Badge variant="secondary" className="text-lg px-6 py-3">
                  <Package className="mr-2 h-5 w-5" />
                  Sipariş No: <span className="font-bold ml-2">{orderId}</span>
                </Badge>
              </div>
            )}

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
              <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <CardContent className="p-4">
                  <Truck className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-semibold mb-1 text-sm">Hızlı Kargo</h3>
                  <p className="text-xs text-muted-foreground">En kısa sürede kargoya verilecek</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <CardContent className="p-4">
                  <Mail className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1 text-sm">E-posta Onayı</h3>
                  <p className="text-xs text-muted-foreground">Detaylı bilgi gönderildi</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                <CardContent className="p-4">
                  <Leaf className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-semibold mb-1 text-sm">Premium Kalite</h3>
                  <p className="text-xs text-muted-foreground">%100 doğal ürünler</p>
                </CardContent>
              </Card>
            </div>

            {/* Message */}
            <p className="text-muted-foreground mb-8 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              Siparişinizin durumunu <span className="font-semibold text-primary">Siparişlerim</span> sayfasından takip edebilirsiniz.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn" style={{ animationDelay: '0.7s' }}>
              <Link href="/profile/orders">
                <Button size="lg" className="bg-olive-gradient hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto">
                  <Package className="mr-2 h-5 w-5" />
                  Siparişlerimi Görüntüle
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="border-2 hover:bg-primary/5 transition-all duration-300 w-full sm:w-auto">
                  <Home className="mr-2 h-5 w-5" />
                  Ana Sayfaya Dön
                </Button>
              </Link>
            </div>

            {/* Thank You Message */}
            <div className="mt-8 pt-8 border-t animate-fadeIn" style={{ animationDelay: '0.8s' }}>
              <p className="text-sm text-muted-foreground">
                Bizi tercih ettiğiniz için teşekkür ederiz! 🌿
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <SuccessContent orderId={searchParams.order} />
    </Suspense>
  );
}
