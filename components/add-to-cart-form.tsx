"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, ShoppingCart, Package } from "lucide-react";
import { addToCart } from "@/actions/cart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface AddToCartFormProps {
  productId: string;
  inStock: boolean;
}

export function AddToCartForm({ productId, inStock }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await addToCart(productId, quantity);

      if (result.success) {
        toast({
          title: "Başarılı! ✓",
          description: `${quantity} adet ürün sepetinize eklendi.`,
          variant: "success",
        });
        router.refresh();
      } else {
        toast({
          title: "Hata",
          description: result.error || "Bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Sepete eklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-800">Sepete Ekle</h3>
        </div>
        <p className="text-sm text-gray-600">Miktar seçin ve sepete ekleyin</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Quantity Selector */}
        <div>
          <Label htmlFor="quantity" className="text-sm font-semibold text-gray-700 mb-3 block">
            Adet Seçin
          </Label>
          <div className="flex items-center gap-3 justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 text-gray-700 hover:text-green-700 transition-all duration-300"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="relative">
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-20 text-center border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300 font-semibold"
              />
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <Package className="h-3 w-3 text-gray-400" />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
              className="border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 text-gray-700 hover:text-green-700 transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold py-4 text-lg"
          disabled={!inStock || loading}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {loading ? "Ekleniyor..." : inStock ? "Sepete Ekle" : "Stokta Yok"}
        </Button>

        {/* Stock Status */}
        {!inStock && (
          <div className="p-3 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700 font-semibold text-center">
              Bu ürün şu anda stokta bulunmuyor
            </p>
          </div>
        )}
      </form>
    </div>
  );
}