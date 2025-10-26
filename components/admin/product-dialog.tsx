"use client";

import { useState, useEffect } from "react";
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
import { Plus, RefreshCw, Upload, X, ImageIcon, Trash2, GripVertical } from "lucide-react";
import { createProduct, updateProduct } from "@/actions/admin";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { tlToKurus, kurusToTl } from "@/lib/money";
import { extractProductImages } from "@/lib/image-utils";

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
    is_main_page?: boolean;
    is_recommended?: boolean;
    category_id?: string;
    subcategory_id?: string;
  };
  trigger?: React.ReactNode;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

// Function to generate slug from title
function generateSlug(title: string): string {
  const turkishMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  
  return title
    .toLowerCase()
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function ProductDialog({ product, trigger }: ProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState(product?.slug || "");
  const [manualSlugEdit, setManualSlugEdit] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(
    product ? extractProductImages(product.images) : []
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(product?.category_id || "");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(product?.subcategory_id || "");
  const [isMainPage, setIsMainPage] = useState(product?.is_main_page || false);
  const [isRecommended, setIsRecommended] = useState(product?.is_recommended || false);
  const { toast } = useToast();
  const router = useRouter();
  
  const isEdit = !!product;

  // Get selected category and its subcategories
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleTitleChange = (title: string) => {
    if (!manualSlugEdit) {
      setSlug(generateSlug(title));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Dosya tipini kontrol et
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      toast({
        title: "Hata",
        description: "Sadece resim dosyaları yüklenebilir",
        variant: "destructive",
      });
      return;
    }

    // Dosya boyutunu kontrol et (5MB limit)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Hata",
        description: "Dosya boyutu 5MB'dan küçük olmalıdır",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          return result.url;
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImageUrls(prev => [...prev, ...uploadedUrls]);
      
      toast({
        title: "Başarılı! ✓",
        description: `${uploadedUrls.length} görsel başarıyla yüklendi`,
        variant: "success",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Hata",
        description: "Görsel yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      setImageUrls(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...imageUrls];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImageUrls(newImages);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(""); // Reset subcategory when category changes
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setSlug(product?.slug || "");
      setManualSlugEdit(false);
      setImageUrls(product ? extractProductImages(product.images) : []);
      setNewImageUrl("");
      setSelectedCategoryId(product?.category_id || "");
      setSelectedSubcategoryId(product?.subcategory_id || "");
      setIsMainPage(product?.is_main_page || false);
      setIsRecommended(product?.is_recommended || false);
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
      price: tlToKurus(parseFloat(formData.get("price") as string)),
      stock: parseInt(formData.get("stock") as string),
      imageUrl: imageUrls, // Use state value
      active: formData.get("active") === "on",
      is_main_page: isMainPage,
      is_recommended: isRecommended,
      category_id: selectedCategoryId || undefined,
      subcategory_id: selectedSubcategoryId || undefined,
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
        description: result.error || (isEdit ? "Ürün güncellenemedi" : "Ürün eklenemedi"),
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold px-6 py-3">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Ürün Ekle
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            {isEdit ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Ürün Adı *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={product?.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Örn: Premium Sızma Zeytinyağı"
                required
                className="mt-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setManualSlugEdit(true);
                  }}
                  placeholder="premium-sizma-zeytinyagi"
                  required
                  className="flex-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setManualSlugEdit(false);
                    setSlug(generateSlug((document.getElementById('title') as HTMLInputElement)?.value || ''));
                  }}
                  className="border-2 border-gray-200 hover:border-green-500 hover:bg-green-50"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Açıklama *</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={product?.description}
              placeholder="Ürün açıklaması..."
              rows={4}
              required
              className="mt-1 w-full border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 resize-none"
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
                defaultValue={product ? kurusToTl(product.price) : undefined}
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

          {/* Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="category">Kategori *</Label>
              <select
                id="category"
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                required
                className="mt-1 w-full border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 bg-white px-3 py-2"
              >
                <option value="">Kategori Seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="subcategory">Alt Kategori</Label>
              <select
                id="subcategory"
                value={selectedSubcategoryId}
                onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                className="mt-1 w-full border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 bg-white px-3 py-2"
              >
                <option value="">Alt Kategori Seçin (Opsiyonel)</option>
                {selectedCategory?.subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Management */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Ürün Görselleri</Label>
            
            {/* Current Images */}
            {imageUrls.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm text-gray-600 font-medium">
                  Mevcut Görseller ({imageUrls.length})
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-green-400 transition-colors">
                        <img
                          src={url}
                          alt={`Ürün görseli ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5K2PC90ZXh0Pgo8L3N2Zz4K';
                          }}
                        />
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeImage(index)}
                          className="h-6 w-6"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-400 hover:bg-green-50/50 transition-all duration-300">
              <div className="text-center">
                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <Upload className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {uploading ? 'Yükleniyor...' : 'Görsel Yükle'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Birden fazla görsel seçebilirsiniz
                  </div>
                </label>
              </div>
            </div>

            {/* Manual URL Input */}
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Görsel URL'si ekle..."
                className="flex-1 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
              />
              <Button
                type="button"
                onClick={addImageUrl}
                disabled={!newImageUrl.trim()}
                className="px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                Ekle
              </Button>
            </div>
          </div>

          {/* Status Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                name="active"
                defaultChecked={product?.active !== false}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <Label htmlFor="active" className="text-sm font-medium text-gray-700">
                Ürün aktif (müşteriler görebilir)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isMainPage"
                checked={isMainPage}
                onChange={(e) => setIsMainPage(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <Label htmlFor="isMainPage" className="text-sm font-medium text-gray-700">
                Anasayfada öne çıkar
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRecommended"
                checked={isRecommended}
                onChange={(e) => setIsRecommended(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <Label htmlFor="isRecommended" className="text-sm font-medium text-gray-700">
                Sepette tavsiye et
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="px-6"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={loading || uploading}
              className="px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {isEdit ? "Güncelleniyor..." : "Ekleniyor..."}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {isEdit ? "Güncelle" : "Ekle"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
