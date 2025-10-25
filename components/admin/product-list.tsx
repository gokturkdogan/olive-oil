"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/money";
import { ProductDialog } from "./product-dialog";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { deleteProduct, toggleProductActive } from "@/actions/admin";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Power, Package, ImageIcon, Plus, Zap } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: any; // Json field
  active: boolean;
}

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    productId: string;
    productTitle: string;
  }>({
    open: false,
    productId: "",
    productTitle: "",
  });

  const handleDeleteClick = (productId: string, productTitle: string) => {
    setDeleteDialog({
      open: true,
      productId,
      productTitle,
    });
  };

  const handleDeleteConfirm = async () => {
    setLoadingId(deleteDialog.productId);
    const result = await deleteProduct(deleteDialog.productId);

    if (result.success) {
      toast({
        title: "Başarılı! ✓",
        description: "Ürün silindi",
        variant: "success",
      });
      router.refresh();
    } else {
      toast({
        title: "Hata",
        description: result.error || "Ürün silinemedi",
        variant: "destructive",
      });
    }
    setLoadingId(null);
    setDeleteDialog({ open: false, productId: "", productTitle: "" });
  };

  const handleToggleActive = async (productId: string) => {
    setLoadingId(productId);
    const result = await toggleProductActive(productId);

    if (result.success) {
      toast({
        title: "Başarılı! ✓",
        description: `Ürün ${result.newStatus ? "aktif" : "pasif"} yapıldı`,
        variant: "success",
      });
      router.refresh();
    } else {
      toast({
        title: "Hata",
        description: result.error || "Durum değiştirilemedi",
        variant: "destructive",
      });
    }
    setLoadingId(null);
  };

  if (products.length === 0) {
    return (
      <Card className="border-2 border-dashed border-green-200 shadow-lg shadow-green-500/10 bg-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
        <CardContent className="py-16 text-center">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200">
            <Package className="h-10 w-10 text-green-600" />
          </div>
          <p className="text-lg font-bold text-gray-800 mb-2">Henüz ürün eklenmemiş</p>
          <p className="text-gray-600 mb-6">İlk ürününüzü ekleyerek başlayın</p>
          <ProductDialog />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Add Product Button */}
        <div className="flex justify-end">
          <ProductDialog />
        </div>

        {/* Products Grid */}
        <div className="grid gap-6">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className={`hover:shadow-xl transition-all duration-300 border-2 ${
              product.active 
                ? "border-green-200 shadow-lg shadow-green-500/10 bg-white hover:shadow-2xl hover:border-green-300" 
                : "border-gray-200 opacity-75 bg-gray-50"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Product Image */}
                <div className="relative h-24 w-24 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center border-2 border-green-200">
                  {product.images && (product.images as string[])[0] ? (
                    <Image
                      src={(product.images as string[])[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-green-600 mb-1" />
                      <span className="text-xs text-green-600 font-semibold">Görsel yok</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg truncate text-gray-800">{product.title}</h3>
                        {product.active ? (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                            <Zap className="w-3 h-3 mr-1" />
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                            Pasif
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Slug:</span> /{product.slug}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Stok: <span className={`font-semibold ${product.stock < 10 ? "text-red-600" : "text-green-600"}`}>
                          {product.stock}
                        </span> adet
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap pt-4 border-t border-gray-200">
                    <ProductDialog 
                      product={product}
                      trigger={
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-2 border-green-200 hover:border-green-500 hover:bg-green-50 text-green-700 hover:text-green-800 transition-all duration-300"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Düzenle
                        </Button>
                      }
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(product.id)}
                      disabled={loadingId === product.id}
                      className={`border-2 transition-all duration-300 ${
                        product.active
                          ? "border-amber-200 hover:border-amber-500 hover:bg-amber-50 text-amber-700 hover:text-amber-800"
                          : "border-green-200 hover:border-green-500 hover:bg-green-50 text-green-700 hover:text-green-800"
                      }`}
                    >
                      <Power className="h-4 w-4 mr-1" />
                      {product.active ? "Pasif Yap" : "Aktif Yap"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(product.id, product.title)}
                      disabled={loadingId === product.id}
                      className="ml-auto border-2 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-700 hover:text-red-800 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Sil
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

    {/* Delete Confirmation Dialog */}
    <DeleteConfirmationDialog
      open={deleteDialog.open}
      onOpenChange={(open) => 
        setDeleteDialog({ ...deleteDialog, open })
      }
      onConfirm={handleDeleteConfirm}
      title={deleteDialog.productTitle}
      description="Bu ürün sipariş geçmişinde varsa silinemez. Bu durumda pasif yapabilirsiniz."
      loading={loadingId === deleteDialog.productId}
    />
  </>
  );
}