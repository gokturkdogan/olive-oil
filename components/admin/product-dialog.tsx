"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, RefreshCw } from "lucide-react";
import { createProduct, updateProduct } from "@/actions/admin";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ProductDialogProps {
  product?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    images: any; // Json field
    active: boolean;
  };
  trigger?: React.ReactNode;
}

// Function to generate slug from title
function generateSlug(title: string): string {
  const turkishMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
  };

  return title
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

export function ProductDialog({ product, trigger }: ProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState(product?.slug || "");
  const [manualSlugEdit, setManualSlugEdit] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  const isEdit = !!product;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Only auto-generate slug if user hasn't manually edited it
    if (!manualSlugEdit) {
      setSlug(generateSlug(title));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setManualSlugEdit(true);
  };

  const handleRegenerateSlug = () => {
    const titleInput = document.getElementById("title") as HTMLInputElement;
    if (titleInput?.value) {
      setSlug(generateSlug(titleInput.value));
      setManualSlugEdit(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get("title") as string,
      slug: slug, // Use state value instead of form data
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      stock: parseInt(formData.get("stock") as string),
      imageUrl: formData.get("imageUrl") as string,
      active: formData.get("active") === "on",
    };

    const result = isEdit
      ? await updateProduct(product.id, data)
      : await createProduct(data);

    if (result.success) {
      toast({
        title: "Başarılı! ✓",
        description: isEdit ? "Ürün güncellendi" : "Ürün eklendi",
        variant: "success",
      });
      // Don't reset slug here, handleOpenChange will do it
      setOpen(false);
      router.refresh();
    } else {
      toast({
        title: "Hata",
        description: result.error || "Bir hata oluştu",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when dialog closes
      setSlug(product?.slug || "");
      setManualSlugEdit(false);
    } else if (newOpen && product) {
      // Set slug when opening for edit
      setSlug(product.slug);
      setManualSlugEdit(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold px-6 py-3">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Ürün Ekle
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-green-200 shadow-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">{isEdit ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Ürün Başlığı *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={product?.title}
              onChange={handleTitleChange}
              placeholder="Örn: Premium Sızma Zeytinyağı 1L"
              required
              className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
            />
          </div>

          <div>
            <Label htmlFor="slug" className="flex items-center justify-between">
              <span>Slug (URL) *</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRegenerateSlug}
                className="h-6 text-xs hover:bg-primary/10 hover:text-primary"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Yeniden Oluştur
              </Button>
            </Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={handleSlugChange}
              placeholder="ornek-premium-zeytinyagi-1l"
              required
              pattern="[a-z0-9-]+"
              title="Sadece küçük harf, rakam ve tire kullanın"
              className={`mt-1 border-2 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 ${
                manualSlugEdit ? "border-amber-300 bg-amber-50/30" : "border-gray-200"
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">
              {manualSlugEdit ? (
                <span className="text-amber-600">
                  ⚠️ Manuel düzenlendi. "Yeniden Oluştur" ile başlığa göre otomatik oluşturulabilir.
                </span>
              ) : (
                <span>
                  ✨ Ürün başlığından otomatik oluşturuluyor. Manuel düzenleyebilirsiniz.
                </span>
              )}
            </p>
          </div>

          <div>
            <Label htmlFor="description">Açıklama *</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={product?.description}
              placeholder="Ürün açıklaması"
              required
              rows={4}
              className="flex w-full rounded-xl border-2 border-gray-200 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-green-500 focus:ring-4 focus:ring-green-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Fiyat (TL) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.price}
                placeholder="99.90"
                required
                className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
              />
            </div>

            <div>
              <Label htmlFor="stock">Stok Adedi *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                defaultValue={product?.stock}
                placeholder="100"
                required
                className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">Görsel URL (Opsiyonel)</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              defaultValue={product?.images && (product.images as string[])[0] ? (product.images as string[])[0] : ""}
              placeholder="https://example.com/image.jpg"
              className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ürün görseli URL'si. Boş bırakılırsa varsayılan görsel kullanılır.
            </p>
          </div>

          <div className="bg-green-50 rounded-xl border border-green-200 p-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                name="active"
                defaultChecked={product?.active ?? true}
                className="h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-500"
              />
              <Label htmlFor="active" className="font-normal cursor-pointer text-gray-800">
                Ürün aktif (Müşteriler görebilir)
              </Label>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-800 transition-all duration-300"
            >
              İptal
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold px-6"
            >
              {loading ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Ürün Ekle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

