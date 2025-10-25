"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/money";
import { extractProductImages } from "@/lib/image-utils";
import { addToCart } from "@/actions/cart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Check } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    images: any; // Json field
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link'e gitmesini engelle
    e.stopPropagation(); // Event bubbling'i durdur
    
    setAdding(true);
    
    const result = await addToCart(product.id, 1);
    
    setAdding(false);
    
    if (result?.success) {
      setAdded(true);
      
      toast({
        title: "Sepete Eklendi! 🎉",
        description: `${product.title} sepetinize eklendi.`,
        variant: "success" as any,
      });
      
      // 2 saniye sonra "added" state'ini sıfırla
      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } else {
      toast({
        title: "Hata",
        description: result?.error || "Ürün sepete eklenemedi.",
        variant: "destructive",
      });
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      {/* Glow Effect */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl opacity-0 group-hover:opacity-15 blur-xl transition-all duration-700"></div>
        
        <Card className="relative h-full border-2 border-gray-200 hover:border-green-400 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 overflow-hidden bg-white">
          {/* Product Image Area */}
          <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 h-64 flex items-center justify-center overflow-hidden">
            {/* Animated background on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-green-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Stock badge */}
            {product.stock > 0 ? (
              <Badge className="absolute top-4 right-4 bg-green-700 text-white shadow-lg">
                Stokta
              </Badge>
            ) : (
              <Badge className="absolute top-4 right-4 bg-red-600 text-white shadow-lg">
                Tükendi
              </Badge>
            )}

            {/* Product Image */}
            {(() => {
              const imageArray = extractProductImages(product.images);
              return imageArray.length > 0 ? (
                <div className="relative w-full h-full">
                  <img
                    src={imageArray[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      // Fallback to emoji if image fails to load
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                    <div className="text-7xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                      🫒
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center relative z-10">
                  <div className="text-7xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                    🫒
                  </div>
                </div>
              );
            })()}

            {/* Stock warning badge */}
            {product.stock < 10 && product.stock > 0 && (
              <Badge variant="outline" className="absolute bottom-4 left-4 bg-amber-50 text-amber-700 border-amber-300 text-xs">
                Son {product.stock} adet
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <CardContent className="pt-5 pb-4">
            <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-green-700 transition-colors duration-300 line-clamp-1">
              {product.title}
            </h3>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl font-bold text-green-700">
                {formatPrice(product.price)}
              </span>
            </div>
          </CardContent>

          {/* Action Button */}
          <CardFooter className="pt-0 pb-5">
            <Button
              className={`w-full group/btn transition-all duration-300 ${
                added 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-green-700 hover:bg-green-800'
              } text-white shadow-lg hover:shadow-xl relative overflow-hidden`}
              disabled={product.stock === 0 || adding}
              onClick={handleAddToCart}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {adding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Ekleniyor...
                  </>
                ) : added ? (
                  <>
                    <Check className="w-4 h-4" />
                    Sepete Eklendi!
                  </>
                ) : product.stock > 0 ? (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Sepete Ekle
                  </>
                ) : (
                  "Stokta Yok"
                )}
              </span>
              
              {/* Button shine effect */}
              {!adding && !added && product.stock > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Link>
  );
}

