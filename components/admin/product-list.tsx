"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/money";
import { extractProductImages } from "@/lib/image-utils";
import { ProductDialog } from "./product-dialog";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { deleteProduct, toggleProductActive } from "@/actions/admin";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Power, Package, ImageIcon, Plus, Zap, Filter, X } from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: any; // Json field
  active: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  } | null;
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

  // Filter states
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleDeleteClick = (productId: string, productTitle: string) => {
    setDeleteDialog({
      open: true,
      productId,
      productTitle,
    });
  };

  // Filter functions
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(""); // Reset subcategory when category changes
  };

  const clearFilters = () => {
    setSelectedCategoryId("");
    setSelectedSubcategoryId("");
  };

  // Get selected category and its subcategories
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
  const availableSubcategories = selectedCategory?.subcategories || [];

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    if (selectedCategoryId && product.category?.id !== selectedCategoryId) {
      return false;
    }
    if (selectedSubcategoryId && product.subcategory?.id !== selectedSubcategoryId) {
      return false;
    }
    return true;
  });

  const hasActiveFilters = selectedCategoryId || selectedSubcategoryId;

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

  if (filteredProducts.length === 0 && hasActiveFilters) {
    return (
      <>
        {/* Filter Controls */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-2 border-green-200 hover:border-green-500 hover:bg-green-50 text-green-700 hover:text-green-800 transition-all duration-300"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtreler
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-2 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-700 hover:text-red-800 transition-all duration-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Filtreleri Temizle
                </Button>
              )}
            </div>
            <ProductDialog />
          </div>

          {showFilters && (
            <Card className="border-2 border-green-200 bg-green-50/30">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Kategori</label>
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 bg-background px-3 py-2 text-sm focus:border-green-500 focus:ring-4 focus:ring-green-500/10 focus:outline-none"
                    >
                      <option value="">Tüm kategoriler</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Alt Kategori</label>
                    <select
                      value={selectedSubcategoryId}
                      onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                      disabled={!selectedCategoryId || availableSubcategories.length === 0}
                      className="w-full rounded-xl border-2 border-gray-200 bg-background px-3 py-2 text-sm focus:border-green-500 focus:ring-4 focus:ring-green-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Tüm alt kategoriler</option>
                      {availableSubcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="border-2 border-dashed border-amber-200 shadow-lg shadow-amber-500/10 bg-white">
          <CardContent className="py-16 text-center">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-200">
              <Filter className="h-10 w-10 text-amber-600" />
            </div>
            <p className="text-lg font-bold text-gray-800 mb-2">Filtrelere uygun ürün bulunamadı</p>
            <p className="text-gray-600 mb-6">Farklı filtreler deneyin veya filtreleri temizleyin</p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-2 border-green-200 hover:border-green-500 hover:bg-green-50 text-green-700 hover:text-green-800 transition-all duration-300"
            >
              <X className="h-4 w-4 mr-2" />
              Filtreleri Temizle
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Filter Controls */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-2 border-green-200 hover:border-green-500 hover:bg-green-50 text-green-700 hover:text-green-800 transition-all duration-300"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtreler
                {hasActiveFilters && (
                  <Badge className="ml-2 bg-green-500 text-white text-xs">
                    {[selectedCategoryId, selectedSubcategoryId].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-2 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-700 hover:text-red-800 transition-all duration-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Filtreleri Temizle
                </Button>
              )}
            </div>
            <ProductDialog />
          </div>

          {showFilters && (
            <Card className="border-2 border-green-200 bg-green-50/30">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Kategori</label>
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 bg-background px-3 py-2 text-sm focus:border-green-500 focus:ring-4 focus:ring-green-500/10 focus:outline-none"
                    >
                      <option value="">Tüm kategoriler</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Alt Kategori</label>
                    <select
                      value={selectedSubcategoryId}
                      onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                      disabled={!selectedCategoryId || availableSubcategories.length === 0}
                      className="w-full rounded-xl border-2 border-gray-200 bg-background px-3 py-2 text-sm focus:border-green-500 focus:ring-4 focus:ring-green-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Tüm alt kategoriler</option>
                      {availableSubcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Count */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{filteredProducts.length}</span> ürün bulundu
              {selectedCategoryId && (
                <span className="ml-2">
                  (Kategori: <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {selectedCategory?.name}
                  </Badge>)
                </span>
              )}
              {selectedSubcategoryId && (
                <span className="ml-2">
                  (Alt Kategori: <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                    {availableSubcategories.find(sub => sub.id === selectedSubcategoryId)?.name}
                  </Badge>)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid gap-6">
        {filteredProducts.map((product) => (
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
                  {(() => {
                    const imageArray = extractProductImages(product.images);
                    const hasImages = imageArray.length > 0;
                    
                    return (
                      <>
                        {hasImages && (
                          <img
                            src={imageArray[0]}
                            alt={product.title}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.style.display = 'flex';
                              }
                            }}
                          />
                        )}
                        <div 
                          className="flex flex-col items-center justify-center" 
                          style={{ display: hasImages ? 'none' : 'flex' }}
                        >
                          <ImageIcon className="h-8 w-8 text-green-600 mb-1" />
                          <span className="text-xs text-green-600 font-semibold">Görsel yok</span>
                        </div>
                      </>
                    );
                  })()}
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
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Slug:</span> /{product.slug}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600">
                          <span className="font-semibold">Kategori:</span> 
                          <Badge variant="outline" className="ml-1 text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {product.category?.name || "Kategori yok"}
                          </Badge>
                        </span>
                        {product.subcategory && (
                          <span className="text-sm text-gray-600">
                            <span className="font-semibold">Alt Kategori:</span>
                            <Badge variant="outline" className="ml-1 text-xs bg-purple-50 text-purple-700 border-purple-200">
                              {product.subcategory.name}
                            </Badge>
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-2">{product.description}</div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </p>
                      <div className="text-sm text-gray-600 mt-1">
                        Stok: <span className={`font-semibold ${product.stock < 10 ? "text-red-600" : "text-green-600"}`}>
                          {product.stock}
                        </span> adet
                      </div>
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