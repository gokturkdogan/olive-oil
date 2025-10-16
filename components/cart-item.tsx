"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/money";
import { Minus, Plus, Trash2 } from "lucide-react";
import { removeFromCart, updateCartItemQuantity } from "@/actions/cart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded h-24 w-24 flex items-center justify-center flex-shrink-0">
            <div className="text-3xl">🫒</div>
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{item.product.title}</h3>
                <p className="text-sm text-gray-600">
                  {formatPrice(item.product.price)} / adet
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
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
                  className="w-16 h-8 text-center"
                  disabled={loading}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(Math.min(item.product.stock, quantity + 1))}
                  disabled={quantity >= item.product.stock || loading}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="font-semibold text-primary">
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

