import Link from "next/link";
import { getProducts } from "@/actions/products";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/money";
import { ShoppingCart, Sparkles, Package, AlertCircle } from "lucide-react";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-olive-gradient-soft to-white">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-olive-gradient-soft py-12 md:py-16 lg:py-20 px-4 border-b border-primary/10">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-52 h-52 md:w-80 md:h-80 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <Badge className="mb-4 md:mb-6 bg-white/90 text-primary border-primary/20 shadow-lg px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-medium">
            <Package className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 inline" />
            Premium Ürünler
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-gray-900 leading-tight">
            Ürünlerimiz
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Premium kalitede sızma zeytinyağı ürünlerimizi keşfedin
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        {products.length === 0 ? (
          <div className="text-center py-16 md:py-24">
            <div className="bg-white/80 backdrop-blur rounded-3xl p-8 md:p-12 max-w-lg mx-auto shadow-xl">
              <div className="bg-primary/10 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </div>
              <p className="text-lg md:text-xl text-gray-700 mb-2 font-semibold">Henüz ürün bulunmamaktadır</p>
              <p className="text-sm md:text-base text-gray-500">
                Yakında yeni ürünler eklenecektir.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Link href={`/products/${product.slug}`} key={product.id}>
                <Card className="h-full border-2 border-transparent hover:border-primary/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group overflow-hidden">
                  {/* Product Image */}
                  <div className="relative bg-olive-gradient-soft h-48 sm:h-56 md:h-64 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent group-hover:opacity-80 transition-opacity"></div>
                    <div className="text-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-6xl md:text-7xl lg:text-8xl mb-2 animate-float">🫒</div>
                      <p className="text-xs md:text-sm font-semibold text-gray-700 px-2">{product.title}</p>
                    </div>
                    
                    {/* Stock Badge */}
                    <div className="absolute top-3 right-3">
                      {product.stock > 0 ? (
                        <Badge className="bg-primary text-white shadow-lg">
                          <Sparkles className="w-3 h-3 mr-1 inline" />
                          Stokta
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="shadow-lg">
                          Tükendi
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <CardContent className="pt-4 md:pt-5 pb-3">
                    <h3 className="font-bold text-base md:text-lg mb-2 text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-3 md:mb-4 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl md:text-3xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </CardContent>

                  {/* Action Button */}
                  <CardFooter className="pt-0 pb-4 md:pb-5">
                    <Button 
                      className="w-full bg-olive-gradient hover:opacity-90 shadow-md hover:shadow-lg transition-all group-hover:scale-105 text-sm md:text-base" 
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Sepete Ekle
                        </>
                      ) : (
                        "Stokta Yok"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

