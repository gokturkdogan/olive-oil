import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Leaf, Award, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            %100 Doğal Sızma Zeytinyağı
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sofranıza Sağlık
            <br />
            <span className="text-primary">Getiren Lezzet</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ege'nin verimli topraklarından, özenle seçilmiş zeytinlerden elde
            edilen premium kalite sızma zeytinyağı.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="text-lg">
                Hemen Sipariş Ver
              </Button>
            </Link>
            <Link href="#benefits">
              <Button size="lg" variant="outline" className="text-lg">
                Faydaları Keşfet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Neden Bizim Zeytinyağımız?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kalite, sağlık ve lezzeti bir arada sunan zeytinyağımızın
              benzersiz özellikleri
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">%100 Doğal</h3>
                <p className="text-sm text-gray-600">
                  Hiçbir katkı maddesi içermez, tamamen doğal sızma zeytinyağı
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Premium Kalite</h3>
                <p className="text-sm text-gray-600">
                  Soğuk sıkım yöntemiyle işlenmiş, birinci sınıf kalite
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Sağlığa Yararlı</h3>
                <p className="text-sm text-gray-600">
                  Antioksidan ve omega-3 açısından zengin, kalp dostu
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Güvenilir Tedarik</h3>
                <p className="text-sm text-gray-600">
                  Kendi zeytinliklerimizden, laboratuvar testli ürün
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ürünlerimiz
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Farklı hacim seçenekleri ile ihtiyacınıza uygun zeytinyağı
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Link href="/products">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-primary mb-2">
                          🫒
                        </div>
                        <p className="text-sm text-gray-600">
                          Premium Sızma Zeytinyağı
                        </p>
                      </div>
                    </div>
                    <div>
                      <Badge className="mb-2">Çok Satan</Badge>
                      <h3 className="text-2xl font-bold mb-2">
                        Sızma Zeytinyağı
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Ege bölgesinin en kaliteli zeytinlerinden, soğuk sıkım
                        yöntemiyle elde edilmiş. Düşük asitli, yüksek besin
                        değerli zeytinyağı.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>Soğuk sıkım</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>%0.5'den düşük asit</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>Cam şişede</span>
                        </div>
                      </div>
                      <Button className="w-full md:w-auto">
                        Ürünü İncele
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="text-yellow-400 text-lg">★★★★★</div>
                </div>
                <p className="text-gray-600 mb-4">
                  &ldquo;Şimdiye kadar kullandığım en kaliteli zeytinyağı.
                  Tadı ve kokusu harika!&rdquo;
                </p>
                <p className="font-semibold text-sm">- Ayşe K.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="text-yellow-400 text-lg">★★★★★</div>
                </div>
                <p className="text-gray-600 mb-4">
                  &ldquo;Doğal ve sağlıklı beslenmek isteyenler için ideal.
                  Kesinlikle tavsiye ederim.&rdquo;
                </p>
                <p className="font-semibold text-sm">- Mehmet Y.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="text-yellow-400 text-lg">★★★★★</div>
                </div>
                <p className="text-gray-600 mb-4">
                  &ldquo;Kargo hızlı, ürün kaliteli. Artık sürekli buradan
                  alıyorum.&rdquo;
                </p>
                <p className="font-semibold text-sm">- Zeynep A.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sağlıklı Yaşama İlk Adımı Atın
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Hemen sipariş verin, kapınıza kadar gelsin
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="text-lg">
              Sipariş Ver
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
