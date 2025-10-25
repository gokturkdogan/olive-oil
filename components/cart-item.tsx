"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/money";
import { extractProductImages } from "@/lib/image-utils";
import { Minus, Plus, Trash2, Leaf } from "lucide-react";
import { removeFromCart, updateCartItemQuantity } from "@/actions/cart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    product: {
      id: string;
      title: string;
      price: number;
      stock: number;
      images: any; // Json field
    };
  };
}

export function CartItem({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity === quantity) return;

    setLoading(true);
    const result = await updateCartItemQuantity(item.id, newQuantity);

    if (result.success) {
      setQuantity(newQuantity);
      router.refresh();
    } else {
      toast({
        title: "Hata",
        description: result.error || "Miktar güncellenemedi",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    const result = await removeFromCart(item.id);

    if (result.success) {
      toast({
        title: "Ürün Kaldırıldı",
        description: "Ürün sepetinizden kaldırıldı.",
        variant: "success" as any,
      });
      router.refresh();
    } else {
      toast({
        title: "Hata",
        description: result.error || "Ürün kaldırılamadı",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const itemTotal = item.product.price * quantity;

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-all duration-500"></div>
      
      <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-green-300 transition-all duration-500 shadow-lg hover:shadow-xl bg-white">
        <CardContent className="p-4 md:p-5">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="relative flex-shrink-0">
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 rounded-xl h-20 w-20 md:h-24 md:w-24 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-500 overflow-hidden">
                {(() => {
                  const imageArray = extractProductImages(item.product.images);
                  return imageArray.length > 0 ? (
                    <img
                      src={imageArray[0]}
                      alt={item.product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback to emoji if image fails to load
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null;
                })()}
                <div className="text-4xl md:text-5xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" style={{ display: 'flex' }}>
                  🫒
                </div>
              </div>
              {item.product.stock < 10 && (
                <Badge className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white border-0 text-[10px] px-1.5 py-0.5 shadow-md">
                  Son {item.product.stock}
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base md:text-lg mb-1.5 text-gray-900 group-hover:text-green-700 transition-colors truncate">
                    {item.product.title}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-gray-600">
                      {formatPrice(item.product.price)} / adet
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  disabled={loading}
                  className="flex-shrink-0 h-8 w-8 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-300 group/delete"
                >
                  <Trash2 className="h-4 w-4 group-hover/delete:scale-110 transition-transform" />
                </Button>
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-white hover:text-green-700 rounded-md transition-all"
                    onClick={() => updateQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || loading}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max={item.product.stock}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(val);
                    }}
                    onBlur={(e) => {
                      const val = Math.max(
                        1,
                        Math.min(item.product.stock, parseInt(e.target.value) || 1)
                      );
                      updateQuantity(val);
                    }}
                    className="w-12 h-7 text-center border-0 bg-transparent font-bold text-sm"
                    disabled={loading}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-white hover:text-green-700 rounded-md transition-all"
                    onClick={() => updateQuantity(Math.min(item.product.stock, quantity + 1))}
                    disabled={quantity >= item.product.stock || loading}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 mb-0.5">Toplam</p>
                  <p className="text-lg md:text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {formatPrice(itemTotal)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

