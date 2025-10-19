"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/money";
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
    <Link href={`/products/${product.slug}`} className="block">
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <div className="bg-gradient-to-br from-green-100 to-green-50 h-64 flex items-center justify-center rounded-t-lg">
          <div className="text-center">
            <div className="text-6xl mb-2">🫒</div>
            <p className="text-sm text-gray-600">{product.title}</p>
          </div>
        </div>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">{product.title}</h3>
            {product.stock > 0 ? (
              <Badge variant="secondary">Stokta</Badge>
            ) : (
              <Badge variant="destructive">Tükendi</Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            disabled={product.stock === 0 || adding}
            onClick={handleAddToCart}
          >
            {adding ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Ekleniyor...
              </>
            ) : added ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Sepete Eklendi!
              </>
            ) : product.stock > 0 ? (
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
  );
}

