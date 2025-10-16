import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Leaf, Award, Heart, Sparkles, TrendingUp, ShieldCheck, ShoppingCart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-olive-gradient-soft py-12 md:py-20 lg:py-24 px-4">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-40 h-40 md:w-72 md:h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-52 h-52 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-4 md:mb-6 bg-white/90 text-primary border-primary/20 shadow-lg animate-fadeInUp px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-medium">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 inline" />
            %100 Doğal Sızma Zeytinyağı
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 animate-fadeInUp leading-tight px-2">
            Sofranıza Sağlık
            <br />
            <span className="text-gradient">Getiren Lezzet</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 md:mb-10 max-w-3xl mx-auto animate-fadeInUp leading-relaxed px-4">
            Ege'nin bereketli topraklarından, özenle seçilmiş zeytinlerden elde edilen 
            <span className="font-semibold text-primary"> premium kalite</span> sızma zeytinyağı.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-fadeInUp px-4">
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base md:text-lg bg-olive-gradient hover:opacity-90 shadow-xl hover:shadow-2xl transition-all duration-300 px-6 md:px-8 py-5 md:py-6 group">
                Hemen Sipariş Ver
                <TrendingUp className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#benefits" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base md:text-lg border-2 border-primary/30 hover:border-primary hover:bg-primary/5 px-6 md:px-8 py-5 md:py-6 shadow-lg">
                Faydaları Keşfet
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-8 max-w-3xl mx-auto mt-8 md:mt-16 px-2">
            <div className="bg-white/80 backdrop-blur rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-0.5 md:mb-1">%100</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600">Doğal</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-0.5 md:mb-1">10+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600">Yıl Tecrübe</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-0.5 md:mb-1">5K+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600">Mutlu Müşteri</div>
            </div>
          </div>
        </div>

        {/* Floating olive icon */}
        <div className="absolute bottom-20 right-1/4 text-8xl animate-float hidden lg:block opacity-20">
          🫒
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 md:py-20 lg:py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-gray-900 px-4">
              Neden Bizim <span className="text-gradient">Zeytinyağımız</span>?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Kalite, sağlık ve lezzeti bir arada sunan zeytinyağımızın
              benzersiz özellikleri
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-gray-900">%100 Doğal</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Hiçbir katkı maddesi içermez, tamamen doğal sızma zeytinyağı
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-gray-900">Premium Kalite</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Soğuk sıkım yöntemiyle işlenmiş, birinci sınıf kalite
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-gray-900">Sağlığa Yararlı</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Antioksidan ve omega-3 açısından zengin, kalp dostu
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-gray-900">Güvenilir Tedarik</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Kendi zeytinliklerimizden, laboratuvar testli ürün
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-12 md:py-20 lg:py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-gray-900 px-4">
              Premium <span className="text-gradient">Ürünlerimiz</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Farklı hacim seçenekleri ile ihtiyacınıza uygun zeytinyağı
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Link href="/products">
              <Card className="border-2 border-transparent hover:border-primary/30 hover:shadow-2xl transition-all duration-500 cursor-pointer group overflow-hidden">
                <CardContent className="p-5 md:p-8 lg:p-10">
                  <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
                    <div className="relative bg-olive-gradient-soft rounded-2xl md:rounded-3xl h-56 sm:h-64 md:h-80 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
                      <div className="text-center relative z-10">
                        <div className="text-6xl sm:text-7xl md:text-8xl mb-3 md:mb-4 animate-float">
                          🫒
                        </div>
                        <p className="text-sm md:text-base font-semibold text-gray-700 px-2">
                          Premium Sızma Zeytinyağı
                        </p>
                      </div>
                    </div>
                    <div>
                      <Badge className="mb-3 md:mb-4 bg-primary text-white shadow-lg px-3 md:px-4 py-1 text-xs md:text-sm">
                        <Sparkles className="w-3 h-3 mr-1 inline" />
                        Çok Satan
                      </Badge>
                      <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-gray-900 group-hover:text-primary transition-colors">
                        Sızma Zeytinyağı
                      </h3>
                      <p className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm sm:text-base md:text-lg">
                        Ege bölgesinin en kaliteli zeytinlerinden, soğuk sıkım
                        yöntemiyle elde edilmiş. Düşük asitli, yüksek besin
                        değerli zeytinyağı.
                      </p>
                      <div className="space-y-2 md:space-y-3 mb-5 md:mb-6">
                        <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base">
                          <div className="bg-primary/10 p-1 rounded-full flex-shrink-0">
                            <Check className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                          </div>
                          <span className="text-gray-700">Soğuk sıkım yöntemi</span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base">
                          <div className="bg-primary/10 p-1 rounded-full flex-shrink-0">
                            <Check className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                          </div>
                          <span className="text-gray-700">%0.5'den düşük asit oranı</span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base">
                          <div className="bg-primary/10 p-1 rounded-full flex-shrink-0">
                            <Check className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                          </div>
                          <span className="text-gray-700">Koyu renkli cam şişede</span>
                        </div>
                      </div>
                      <Button className="w-full md:w-auto bg-olive-gradient hover:opacity-90 shadow-lg hover:shadow-xl transition-all px-6 md:px-8 text-sm md:text-base group-hover:scale-105">
                        Ürünü İncele
                        <TrendingUp className="ml-2 h-4 w-4" />
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
      <section className="relative py-12 md:py-20 lg:py-24 px-4 bg-olive-gradient text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-52 h-52 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-52 h-52 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight px-4">
            Sağlıklı Yaşama İlk Adımı Atın
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 opacity-95 max-w-2xl mx-auto px-4">
            Hemen sipariş verin, premium zeytinyağımız kapınıza kadar gelsin
          </p>
          <Link href="/products" className="inline-block w-full sm:w-auto px-4">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-6 md:py-7 shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white text-primary hover:bg-white/90">
              <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Sipariş Ver
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
