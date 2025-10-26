"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/money";
import { extractProductImages } from "@/lib/image-utils";
import { addToCart } from "@/actions/cart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Check } from "lucide-react";

interface CompactProductCardProps {
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

export function CompactProductCard({ product }: CompactProductCardProps) {
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
      setTimeout(() => setAdded(false), 2000);
    } else {
      toast({
        title: "Hata",
        description: result?.error || "Ürün sepete eklenemedi",
        variant: "destructive" as any,
      });
    }
  };

  const productImages = extractProductImages(product.images);
  const firstImage = productImages[0];

  return (
    <Card className="group border-2 border-gray-200 hover:border-green-400 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-white hover:-translate-y-1 w-full max-w-full">
      <Link href={`/products/${product.slug}`}>
        <div className="flex gap-2 p-2">
          {/* Product Image */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 overflow-hidden rounded-lg">
            {firstImage ? (
              <img
                src={firstImage}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  const target = e.currentTarget;
                  const nextSibling = target.nextElementSibling as HTMLElement;
                  if (nextSibling) nextSibling.style.display = 'flex';
                  target.style.display = 'none';
                }}
              />
            ) : (
              <></>
            )}
            <div className="hidden items-center justify-center h-full">
              <span className="text-2xl sm:text-3xl">🫒</span>
            </div>
            
            {/* Stock Badge */}
            {product.stock === 0 && (
              <div className="absolute top-0.5 left-0.5">
                <Badge className="bg-red-500 text-white text-[8px] sm:text-[10px] py-0 px-1">Tükendi</Badge>
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0 space-y-0.5 pr-1">
            <h3 className="font-semibold text-[10px] sm:text-xs text-gray-900 group-hover:text-green-700 transition-colors duration-300 line-clamp-2 leading-tight">
              {product.title}
            </h3>
            
            <p className="text-[9px] sm:text-[10px] text-gray-600 line-clamp-1 leading-tight">
              {product.description}
            </p>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={adding || added || product.stock === 0}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300 group/btn text-[10px] sm:text-xs py-0.5 h-6 sm:h-7 px-2"
              size="sm"
            >
              {adding ? (
                <>
                  <div className="animate-spin rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 border-b-2 border-white mr-0.5 sm:mr-1"></div>
                  <span className="hidden sm:inline">Ekleniyor...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : added ? (
                <>
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  <span className="hidden sm:inline">Eklendi!</span>
                  <span className="sm:hidden">✓</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  <span className="hidden sm:inline">Sepete Ekle</span>
                  <span className="sm:hidden">Ekle</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
}

