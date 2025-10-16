import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          <CardContent className="pt-12 pb-12">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">
              Siparişiniz Alındı!
            </h1>
            <p className="text-gray-600 mb-2">
              Ödemeniz başarıyla tamamlandı.
            </p>
            {params.order && (
              <p className="text-sm text-gray-500 mb-6">
                Sipariş No: {params.order}
              </p>
            )}
            <p className="text-gray-600 mb-8">
              Siparişiniz en kısa sürede kargoya verilecektir. E-posta
              adresinize onay mesajı gönderildi.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button size="lg">Ana Sayfaya Dön</Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline">
                  Alışverişe Devam Et
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

