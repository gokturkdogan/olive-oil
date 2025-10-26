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
        <CardContent className="p-2 sm:p-3 md:p-5">
          <div className="flex gap-2 sm:gap-3 md:gap-4">
            {/* Product Image */}
            <div className="relative flex-shrink-0">
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 rounded-xl h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-500 overflow-hidden">
                {(() => {
                  const imageArray = extractProductImages(item.product.images);
                  const hasImages = imageArray.length > 0;
                  
                  return (
                    <>
                      {hasImages && (
                        <img
                          src={imageArray[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                      )}
                      <div className="text-3xl sm:text-4xl md:text-5xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" style={{ display: hasImages ? 'none' : 'flex' }}>
                        🫒
                      </div>
                    </>
                  );
                })()}
              </div>
              {item.product.stock < 10 && (
                <Badge className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white border-0 text-[9px] px-1.5 py-0.5 shadow-md">
                  Son {item.product.stock}
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex justify-between items-start gap-1 sm:gap-2 mb-2 md:mb-3">
                <div className="flex-1 min-w-0 pr-1">
                  <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg mb-0.5 sm:mb-1 text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
                    {item.product.title}
                  </h3>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">
                      {formatPrice(item.product.price)} / adet
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  disabled={loading}
                  className="flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-300 group/delete"
                >
                  <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 group-hover/delete:scale-110 transition-transform" />
                </Button>
              </div>

              <div className="flex items-center justify-between gap-1.5 sm:gap-2 md:gap-4 flex-wrap">
                {/* Quantity Controls */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 sm:p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 sm:h-7 sm:w-7 hover:bg-white hover:text-green-700 rounded-md transition-all"
                    onClick={() => updateQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || loading}
                  >
                    <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
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
                    className="w-8 sm:w-10 md:w-12 h-6 sm:h-7 text-center border-0 bg-transparent font-bold text-[10px] sm:text-xs md:text-sm px-0"
                    disabled={loading}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 sm:h-7 sm:w-7 hover:bg-white hover:text-green-700 rounded-md transition-all"
                    onClick={() => updateQuantity(Math.min(item.product.stock, quantity + 1))}
                    disabled={quantity >= item.product.stock || loading}
                  >
                    <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Button>
                </div>

                {/* Item Total */}
                <div className="text-right min-w-[60px] sm:min-w-[80px]">
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-500 mb-0.5">Toplam</p>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent truncate">
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

