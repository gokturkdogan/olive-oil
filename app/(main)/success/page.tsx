import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, Truck, Mail, Home, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";

function SuccessContent({ orderId }: { orderId?: string }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl mx-auto w-full">
        <Card className="border border-border shadow-lg overflow-hidden">
          <CardContent className="pt-12 pb-12 px-6 md:px-12">
            {/* Success Icon */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-6 inline-block shadow-lg">
                <CheckCircle className="h-16 w-16 md:h-20 md:w-20 text-white" strokeWidth={2.5} />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gradient">
              Siparişiniz Alındı!
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6">
              Ödemeniz başarıyla tamamlandı. Teşekkür ederiz!
            </p>

            {/* Order Number */}
            {orderId && (
              <div className="mb-8">
                <Badge variant="secondary" className="text-base px-5 py-2.5 font-medium">
                  <Package className="mr-2 h-4 w-4" />
                  Sipariş No: <span className="font-bold ml-1">{orderId}</span>
                </Badge>
              </div>
            )}

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
              <div className="border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                <Truck className="h-7 w-7 text-green-600 mb-2" />
                <h3 className="font-semibold mb-1 text-sm">Hızlı Kargo</h3>
                <p className="text-xs text-muted-foreground">En kısa sürede kargoya verilecek</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                <Mail className="h-7 w-7 text-primary mb-2" />
                <h3 className="font-semibold mb-1 text-sm">E-posta Onayı</h3>
                <p className="text-xs text-muted-foreground">Detaylı bilgi gönderildi</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                <Leaf className="h-7 w-7 text-green-600 mb-2" />
                <h3 className="font-semibold mb-1 text-sm">Premium Kalite</h3>
                <p className="text-xs text-muted-foreground">%100 doğal ürünler</p>
              </div>
            </div>

            {/* Message */}
            <p className="text-muted-foreground mb-8">
              Siparişinizin durumunu <span className="font-semibold text-primary">Siparişlerim</span> sayfasından takip edebilirsiniz.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/profile/orders">
                <Button size="lg" className="bg-olive-gradient hover:opacity-90 transition-all w-full sm:w-auto">
                  <Package className="mr-2 h-5 w-5" />
                  Siparişlerimi Görüntüle
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="hover:bg-muted transition-all w-full sm:w-auto">
                  <Home className="mr-2 h-5 w-5" />
                  Ana Sayfaya Dön
                </Button>
              </Link>
            </div>

            {/* Thank You Message */}
            <div className="mt-8 pt-8 border-t">
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

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <SuccessContent orderId={params.order} />
    </Suspense>
  );
}
