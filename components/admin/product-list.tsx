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
import { Edit, Trash2, Power, Package, ImageIcon } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image_url: string | null;
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
        title: "Başarılı",
        description: "Ürün silindi",
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
        title: "Başarılı",
        description: `Ürün ${result.newStatus ? "aktif" : "pasif"} yapıldı`,
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
      <Card className="border-2 border-dashed border-primary/20">
        <CardContent className="py-16 text-center">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-10 w-10 text-primary" />
          </div>
          <p className="text-lg font-semibold text-gray-700 mb-2">Henüz ürün eklenmemiş</p>
          <p className="text-gray-500 mb-6">İlk ürününüzü ekleyerek başlayın</p>
          <ProductDialog />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Add Product Button */}
        <div className="flex justify-end">
          <ProductDialog />
        </div>

        {/* Products Grid */}
        <div className="grid gap-4">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className={`hover:shadow-lg transition-all duration-300 border-2 ${
              product.active ? "border-primary/20" : "border-gray-200 opacity-75"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Product Image */}
                <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-400">Görsel yok</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg truncate">{product.title}</h3>
                        {product.active ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-600">
                            Pasif
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Slug:</span> /{product.slug}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold text-primary">
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
                  <div className="flex gap-2 flex-wrap pt-3 border-t">
                    <ProductDialog 
                      product={product}
                      trigger={
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
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
                      className={`transition-colors ${
                        product.active
                          ? "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300"
                          : "hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                      }`}
                    >
                      <Power className="h-4 w-4 mr-1" />
                      {product.active ? "Pasif Yap" : "Aktif Yap"}
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(product.id, product.title)}
                      disabled={loadingId === product.id}
                      className="ml-auto"
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

