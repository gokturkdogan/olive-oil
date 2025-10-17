"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/money";
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
        title: "Ürün sepetten kaldırıldı",
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
    <Card className="overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 group">
      <CardContent className="p-4 md:p-6">
        <div className="flex gap-4 md:gap-6">
          {/* Product Image */}
          <div className="relative">
            <div className="bg-olive-gradient rounded-xl h-24 w-24 md:h-28 md:w-28 flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <Leaf className="h-10 w-10 md:h-12 md:w-12 text-white" />
            </div>
            {item.product.stock < 10 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 text-xs px-2 py-0.5"
              >
                Son {item.product.stock}
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors">
                  {item.product.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {formatPrice(item.product.price)} / adet
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Stokta: {item.product.stock}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={loading}
                className="flex-shrink-0 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group/delete"
              >
                <Trash2 className="h-4 w-4 group-hover/delete:scale-110 transition-transform" />
              </Button>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all"
                  onClick={() => updateQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || loading}
                >
                  <Minus className="h-3 w-3" />
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
                  className="w-14 h-8 text-center border-0 bg-transparent font-semibold"
                  disabled={loading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all"
                  onClick={() => updateQuantity(Math.min(item.product.stock, quantity + 1))}
                  disabled={quantity >= item.product.stock || loading}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Toplam</p>
                <p className="text-xl md:text-2xl font-bold text-gradient">
                  {formatPrice(itemTotal)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

