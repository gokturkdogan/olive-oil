import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Leaf, Award, Heart, Sparkles, TrendingUp, ShieldCheck, ShoppingCart, ArrowRight, Star, Truck, Lock, Mail } from "lucide-react";
import { db } from "@/lib/db";
import { FeaturedProductCard } from "@/components/featured-product-card";

export default async function HomePage() {
  // Get products marked as main page featured
  const featuredProducts = await db.product.findMany({
    where: {
      is_main_page: true,
      active: true,
    },
    orderBy: { created_at: "desc" },
    take: 8, // Limit to 8 products
  });
  return (
    <div className="flex flex-col">
      {/* Hero Section - Dynamic & Modern */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-green-50/40 to-emerald-50/30 min-h-[80vh] flex items-center px-4 py-20 md:py-24">
        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-gradient-to-br from-green-400/20 to-emerald-600/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-amber-400/20 to-yellow-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-bl from-lime-400/15 to-green-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10 max-w-5xl">
          {/* Premium Badge */}
          <div className="mb-8 animate-fadeInUp">
            <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-green-800 px-5 py-2.5 rounded-full text-sm font-semibold border border-green-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Liva Oil
            </span>
          </div>
          
          {/* Dynamic Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6 animate-fadeInUp leading-tight">
            Ege'nin{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                Altın Damlası
              </span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-amber-200/40 -z-0"></span>
            </span>
            <br />
            <span className="text-green-700">Sofranızda</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fadeInUp leading-relaxed">
            %100 organik, soğuk sıkım sızma zeytinyağı.
            <br className="hidden sm:block" />
            Doğanın saf tadı her damlasında.
          </p>
          
          {/* Dynamic Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp px-4 mb-12">
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white px-8 py-6 rounded-xl shadow-xl hover:shadow-green-700/50 transition-all duration-300 group relative overflow-hidden hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Ürünleri Keşfet
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
            </Link>
            <Link href="#why-us" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-green-700 text-green-700 hover:bg-green-50 hover:border-green-800 px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Detaylı Bilgi
              </Button>
            </Link>
          </div>

          {/* Animated Stats with Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="group relative w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-100">
                <Leaf className="h-8 w-8 text-green-700 mx-auto mb-3" />
                <div className="text-4xl md:text-5xl font-bold text-green-700 mb-1">100%</div>
                <div className="text-sm text-gray-600 font-medium">Organik</div>
              </div>
            </div>

            <div className="group relative w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-100">
                <Award className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-1">15+</div>
                <div className="text-sm text-gray-600 font-medium">Yıl Tecrübe</div>
              </div>
            </div>

            <div className="group relative w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
                <Heart className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-1">10K+</div>
                <div className="text-sm text-gray-600 font-medium">Müşteri</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section - Ultra Dynamic */}
      <section id="why-us" className="relative py-20 md:py-28 px-4 bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-50 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-green-400/10 to-emerald-600/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-blue-400/10 to-cyan-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Neden <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Bizi Seçmelisiniz</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Her detayda mükemmellik arayışı
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 - Organik */}
            <div className="group relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700"></div>
              
              <Card className="relative border-2 border-gray-200 hover:border-green-400 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-white overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <CardContent className="relative pt-8 pb-6 text-center">
                  {/* Animated icon container */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-lg">
                      <Leaf className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                    %100 Organik
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Katkısız, tamamen doğal
                  </p>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </CardContent>
              </Card>
            </div>

            {/* Feature 2 - Kalite */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700"></div>
              
              <Card className="relative border-2 border-gray-200 hover:border-amber-400 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <CardContent className="relative pt-8 pb-6 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-lg">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                    Premium Kalite
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Birinci sınıf, ödüllü
                  </p>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </CardContent>
              </Card>
            </div>

            {/* Feature 3 - Sağlık */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700"></div>
              
              <Card className="relative border-2 border-gray-200 hover:border-rose-400 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <CardContent className="relative pt-8 pb-6 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-lg">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-rose-600 transition-colors duration-300">
                    Sağlık Dostu
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Omega-3 & antioksidan
                  </p>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </CardContent>
              </Card>
            </div>

            {/* Feature 4 - Güvenilir */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700"></div>
              
              <Card className="relative border-2 border-gray-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <CardContent className="relative pt-8 pb-6 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-lg">
                      <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    Güvenilir
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Lab onaylı, test edilmiş
                  </p>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase - Dynamic */}
      <section className="py-20 md:py-24 px-4 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236b8e23' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Premium <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Ürünlerimiz</span>
            </h2>
            <p className="text-lg text-gray-600">
              Farklı hacim seçenekleriyle ihtiyacınıza uygun
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="space-y-6">
              {featuredProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Henüz anasayfada öne çıkarılmış ürün bulunmamaktadır.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials - Dynamic */}
      <section className="py-20 md:py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Müşteri <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Yorumları</span>
            </h2>
            <p className="text-gray-600">Binlerce mutlu müşterimizden</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-5 blur-xl transition-all duration-500"></div>
              <Card className="relative border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-4 w-4 text-amber-500 fill-amber-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" 
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    "Şimdiye kadar kullandığım en kaliteli zeytinyağı. Tadı ve kokusu harika!"
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      A
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Ayşe K.</p>
                      <p className="text-xs text-gray-500">İstanbul</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Testimonial 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-5 blur-xl transition-all duration-500"></div>
              <Card className="relative border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-4 w-4 text-amber-500 fill-amber-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" 
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    "Organik ve sağlıklı. Ailemle birlikte güvenle kullanıyoruz. Kesinlikle tavsiye ederim."
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      M
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Mehmet Y.</p>
                      <p className="text-xs text-gray-500">Ankara</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Testimonial 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-5 blur-xl transition-all duration-500"></div>
              <Card className="relative border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-4 w-4 text-amber-500 fill-amber-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" 
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    "Hızlı kargo, mükemmel kalite. Her ay düzenli sipariş veriyorum."
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      Z
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Zeynep A.</p>
                      <p className="text-xs text-gray-500">İzmir</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Ultra Premium */}
      <section className="relative py-20 md:py-28 lg:py-36 px-4 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Icon */}
            <div className="mb-6 md:mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl animate-fadeInUp">
                <Leaf className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8 leading-tight px-4">
              Sağlıklı Yaşama
              <br />
              <span className="text-amber-200">İlk Adımı Atın</span>
            </h2>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-10 md:mb-12 text-white/90 max-w-2xl mx-auto px-4 leading-relaxed">
              Hemen sipariş verin, Liva Oil ile kaliteli zeytinyağımız kapınıza kadar gelsin
            </p>
            
            {/* Features Row */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-10 md:mb-14 px-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 md:px-6 py-3 rounded-full">
                <Lock className="h-5 w-5" />
                <span className="text-sm md:text-base font-medium">Güvenli Ödeme</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 md:px-6 py-3 rounded-full">
                <Truck className="h-5 w-5" />
                <span className="text-sm md:text-base font-medium">Ücretsiz Kargo</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 md:px-6 py-3 rounded-full">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm md:text-base font-medium">%100 Organik</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/products" className="inline-block w-full sm:w-auto px-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base md:text-xl px-10 md:px-14 py-7 md:py-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-white text-green-700 hover:bg-white/95 rounded-2xl font-bold group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <ShoppingCart className="h-6 w-6" />
                  Alışverişe Başla
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-100/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </Button>
            </Link>

            {/* Trust badges */}
            <div className="mt-10 md:mt-12 flex flex-wrap justify-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4" /> 10.000+ Mutlu Müşteri
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4" /> 5.0 Ortalama Puan
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4" /> Güvenli Teslimat
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
