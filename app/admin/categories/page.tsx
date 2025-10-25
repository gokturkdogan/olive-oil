'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, FolderOpen, Tag, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: 'ACTIVE' | 'INACTIVE';
  sort_order: number;
  subcategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: 'ACTIVE' | 'INACTIVE';
  sort_order: number;
  category_id: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    sort_order: 0
  });
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    sort_order: 0,
    category_id: ''
  });

  // Edit states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<SubCategory | null>(null);
  const [editCategoryForm, setEditCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    sort_order: 0,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });
  const [editSubcategoryForm, setEditSubcategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    sort_order: 0,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    category_id: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data.categories || []);
      setSubcategories(data.subcategories || []);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async () => {
    // Form validation
    if (!categoryForm.name.trim()) {
      toast({
        title: "Hata",
        description: "Kategori adı zorunludur",
        variant: "destructive",
      });
      return;
    }

    if (!categoryForm.slug.trim()) {
      toast({
        title: "Hata",
        description: "Slug zorunludur",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });
      
      if (response.ok) {
        toast({
          title: "Başarılı! ✓",
          description: `"${categoryForm.name}" kategorisi başarıyla oluşturuldu`,
          variant: "success",
        });
        fetchCategories();
        setCategoryForm({ name: '', slug: '', description: '', image: '', sort_order: 0 });
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: errorData.error || "Kategori oluşturulurken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Kategori oluşturma hatası:', error);
      toast({
        title: "Hata",
        description: "Kategori oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const createSubCategory = async (formData: any) => {
    // Form validation
    if (!formData.name.trim()) {
      toast({
        title: "Hata",
        description: "Alt kategori adı zorunludur",
        variant: "destructive",
      });
      return;
    }

    if (!formData.slug.trim()) {
      toast({
        title: "Hata",
        description: "Slug zorunludur",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast({
          title: "Başarılı! ✓",
          description: `"${formData.name}" alt kategorisi başarıyla oluşturuldu`,
          variant: "success",
        });
        fetchCategories();
        setSubcategoryForm({ name: '', slug: '', description: '', image: '', sort_order: 0, category_id: '' });
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: errorData.error || "Alt kategori oluşturulurken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Alt kategori oluşturma hatası:', error);
      toast({
        title: "Hata",
        description: "Alt kategori oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`"${categoryName}" kategorisini silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast({
          title: "Başarılı! ✓",
          description: `"${categoryName}" kategorisi başarıyla silindi`,
          variant: "success",
        });
        fetchCategories();
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: errorData.error || "Kategori silinirken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Kategori silme hatası:', error);
      toast({
        title: "Hata",
        description: "Kategori silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const deleteSubCategory = async (subcategoryId: string, subcategoryName: string) => {
    if (!confirm(`"${subcategoryName}" alt kategorisini silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/subcategories?id=${subcategoryId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast({
          title: "Başarılı! ✓",
          description: `"${subcategoryName}" alt kategorisi başarıyla silindi`,
          variant: "success",
        });
        fetchCategories();
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: errorData.error || "Alt kategori silinirken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Alt kategori silme hatası:', error);
      toast({
        title: "Hata",
        description: "Alt kategori silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const updateCategory = async () => {
    if (!editingCategory) return;

    // Form validation
    if (!editCategoryForm.name.trim()) {
      toast({
        title: "Hata",
        description: "Kategori adı zorunludur",
        variant: "destructive",
      });
      return;
    }

    if (!editCategoryForm.slug.trim()) {
      toast({
        title: "Hata",
        description: "Slug zorunludur",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory.id,
          ...editCategoryForm
        })
      });
      
      if (response.ok) {
        toast({
          title: "Başarılı! ✓",
          description: `"${editCategoryForm.name}" kategorisi başarıyla güncellendi`,
          variant: "success",
        });
        fetchCategories();
        setEditingCategory(null);
        setEditCategoryForm({
          name: '',
          slug: '',
          description: '',
          image: '',
          sort_order: 0,
          status: 'ACTIVE'
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: errorData.error || "Kategori güncellenirken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Kategori güncelleme hatası:', error);
      toast({
        title: "Hata",
        description: "Kategori güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const updateSubCategory = async () => {
    if (!editingSubcategory) return;

    // Form validation
    if (!editSubcategoryForm.name.trim()) {
      toast({
        title: "Hata",
        description: "Alt kategori adı zorunludur",
        variant: "destructive",
      });
      return;
    }

    if (!editSubcategoryForm.slug.trim()) {
      toast({
        title: "Hata",
        description: "Slug zorunludur",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/subcategories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingSubcategory.id,
          ...editSubcategoryForm
        })
      });
      
      if (response.ok) {
        toast({
          title: "Başarılı! ✓",
          description: `"${editSubcategoryForm.name}" alt kategorisi başarıyla güncellendi`,
          variant: "success",
        });
        fetchCategories();
        setEditingSubcategory(null);
        setEditSubcategoryForm({
          name: '',
          slug: '',
          description: '',
          image: '',
          sort_order: 0,
          status: 'ACTIVE',
          category_id: ''
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Hata",
          description: errorData.error || "Alt kategori güncellenirken bir hata oluştu",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Alt kategori güncelleme hatası:', error);
      toast({
        title: "Hata",
        description: "Alt kategori güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      sort_order: category.sort_order,
      status: category.status
    });
  };

  const startEditSubcategory = (subcategory: SubCategory) => {
    setEditingSubcategory(subcategory);
    setEditSubcategoryForm({
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || '',
      image: subcategory.image || '',
      sort_order: subcategory.sort_order,
      status: subcategory.status,
      category_id: subcategory.category_id
    });
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 py-8 md:py-12 px-4 -mx-4 mb-8">
        {/* Animated Background Blobs */}
        <div className="absolute top-5 right-5 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-5 left-5 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
              <FolderOpen className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">Kategori Yönetimi</span>
            </div>
            
            {/* Icon */}
            <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/30">
              <Layers className="h-7 w-7 text-white" />
            </div>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white leading-tight">
              Kategori Yönetimi
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base text-white/90 font-medium max-w-2xl mx-auto">
              Kategorileri ve alt kategorileri oluşturun, düzenleyin ve yönetin
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Kategori Oluşturma */}
          <Card className="border-2 border-green-200 shadow-lg shadow-green-500/10 bg-white hover:shadow-xl hover:border-green-300 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                Yeni Kategori Oluştur
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category-name" className="text-sm font-semibold text-gray-700 mb-2 block">Kategori Adı *</Label>
                  <Input
                    id="category-name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="Örn: Zeytinyağı"
                    className="border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />
                </div>
                <div>
                  <Label htmlFor="category-slug" className="text-sm font-semibold text-gray-700 mb-2 block">Slug *</Label>
                  <Input
                    id="category-slug"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    placeholder="Örn: zeytinyagi"
                    className="border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category-description" className="text-sm font-semibold text-gray-700 mb-2 block">Açıklama</Label>
                <textarea
                  id="category-description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Kategori açıklaması"
                  rows={3}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-green-500 focus:ring-4 focus:ring-green-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category-image" className="text-sm font-semibold text-gray-700 mb-2 block">Resim URL</Label>
                  <Input
                    id="category-image"
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />
                </div>
                <div>
                  <Label htmlFor="category-sort" className="text-sm font-semibold text-gray-700 mb-2 block">Sıralama</Label>
                  <Input
                    id="category-sort"
                    type="number"
                    value={categoryForm.sort_order}
                    onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: parseInt(e.target.value) || 0 })}
                    className="border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                  />
                </div>
              </div>
              <Button 
                onClick={createCategory} 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 font-semibold px-6 py-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Kategori Oluştur
              </Button>
            </CardContent>
          </Card>

          {/* Kategoriler Listesi */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-white" />
                </div>
                Mevcut Kategoriler
              </h2>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {categories.length} kategori
              </Badge>
            </div>

            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="border-2 border-gray-200 shadow-lg shadow-gray-500/5 bg-white hover:shadow-xl hover:border-green-300 transition-all duration-300"
              >
                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategoryExpansion(category.id)}
                        className="hover:bg-green-100 hover:text-green-700 transition-colors"
                      >
                        {expandedCategories.has(category.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center border-2 border-green-200">
                          <FolderOpen className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-800">{category.name}</CardTitle>
                          <div className="text-sm text-gray-600">Slug: /{category.slug}</div>
                        </div>
                      </div>
                      <Badge 
                        variant={category.status === 'ACTIVE' ? 'default' : 'secondary'}
                        className={category.status === 'ACTIVE' 
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0" 
                          : "bg-gray-100 text-gray-600 border-gray-300"
                        }
                      >
                        {category.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-blue-700 hover:text-blue-800 transition-all duration-300"
                        onClick={() => startEditCategory(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-2 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-700 hover:text-red-800 transition-all duration-300"
                        onClick={() => deleteCategory(category.id, category.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
            
                {expandedCategories.has(category.id) && (
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Kategori Detayları */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                            <Tag className="w-3 h-3 text-white" />
                          </div>
                          Kategori Detayları
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-semibold text-gray-700">Açıklama:</span>
                            <div className="text-gray-600 mt-1">{category.description || 'Açıklama yok'}</div>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Sıralama:</span>
                            <div className="text-gray-600 mt-1">{category.sort_order}</div>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Alt Kategori Sayısı:</span>
                            <div className="text-gray-600 mt-1">
                              {subcategories.filter(sub => sub.category_id === category.id).length} adet
                            </div>
                          </div>
                        </div>
                      </div>
                  
                      {/* Sub Kategoriler */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Layers className="w-3 h-3 text-white" />
                          </div>
                          Alt Kategoriler
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {subcategories.filter(sub => sub.category_id === category.id).length}
                          </Badge>
                        </h4>
                        <div className="space-y-3">
                          {subcategories
                            .filter(sub => sub.category_id === category.id)
                            .map((subcategory) => (
                              <div key={subcategory.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border border-purple-200">
                                    <Layers className="w-4 h-4 text-purple-600" />
                                  </div>
                                  <div>
                                    <span className="font-semibold text-gray-800">{subcategory.name}</span>
                                    <div className="text-sm text-gray-600">Slug: /{subcategory.slug}</div>
                                  </div>
                                  <Badge 
                                    variant={subcategory.status === 'ACTIVE' ? 'default' : 'secondary'}
                                    className={subcategory.status === 'ACTIVE' 
                                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0" 
                                      : "bg-gray-100 text-gray-600 border-gray-300"
                                    }
                                  >
                                    {subcategory.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
                                  </Badge>
                                </div>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-blue-700 hover:text-blue-800 transition-all duration-300"
                                    onClick={() => startEditSubcategory(subcategory)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="border-2 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-700 hover:text-red-800 transition-all duration-300"
                                    onClick={() => deleteSubCategory(subcategory.id, subcategory.name)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                    
                        {/* Sub Kategori Oluşturma */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-4 border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50 text-purple-700 hover:text-purple-800 transition-all duration-300"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Alt Kategori Ekle
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl border-2 border-purple-200 shadow-2xl">
                            <DialogHeader className="pb-4">
                              <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                  <Plus className="w-4 h-4 text-white" />
                                </div>
                                Yeni Alt Kategori
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <Label htmlFor="subcategory-name" className="text-sm font-semibold text-gray-700 mb-2 block">Alt Kategori Adı *</Label>
                                  <Input
                                    id="subcategory-name"
                                    value={subcategoryForm.name}
                                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                                    placeholder="Örn: Sızma Zeytinyağı"
                                    className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="subcategory-slug" className="text-sm font-semibold text-gray-700 mb-2 block">Slug *</Label>
                                  <Input
                                    id="subcategory-slug"
                                    value={subcategoryForm.slug}
                                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, slug: e.target.value })}
                                    placeholder="Örn: sizma-zeytinyagi"
                                    className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="subcategory-description" className="text-sm font-semibold text-gray-700 mb-2 block">Açıklama</Label>
                                <textarea
                                  id="subcategory-description"
                                  value={subcategoryForm.description}
                                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                                  placeholder="Alt kategori açıklaması"
                                  rows={3}
                                  className="flex w-full rounded-xl border-2 border-gray-200 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <Label htmlFor="subcategory-image" className="text-sm font-semibold text-gray-700 mb-2 block">Resim URL</Label>
                                  <Input
                                    id="subcategory-image"
                                    value={subcategoryForm.image}
                                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="subcategory-sort" className="text-sm font-semibold text-gray-700 mb-2 block">Sıralama</Label>
                                  <Input
                                    id="subcategory-sort"
                                    type="number"
                                    value={subcategoryForm.sort_order}
                                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, sort_order: parseInt(e.target.value) || 0 })}
                                    className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                                  />
                                </div>
                              </div>
                              <Button 
                                onClick={() => {
                                  const formData = { ...subcategoryForm, category_id: category.id };
                                  createSubCategory(formData);
                                }}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 font-semibold px-6 py-3"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Alt Kategori Oluştur
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        </div>
        </div>
      </div>

      {/* Kategori Düzenleme Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Edit className="w-4 h-4 text-white" />
              </div>
              Kategori Düzenle
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-category-name" className="text-sm font-semibold text-gray-700 mb-2 block">Kategori Adı *</Label>
                <Input
                  id="edit-category-name"
                  value={editCategoryForm.name}
                  onChange={(e) => setEditCategoryForm({ ...editCategoryForm, name: e.target.value })}
                  placeholder="Örn: Zeytinyağı"
                  className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div>
                <Label htmlFor="edit-category-slug" className="text-sm font-semibold text-gray-700 mb-2 block">Slug *</Label>
                <Input
                  id="edit-category-slug"
                  value={editCategoryForm.slug}
                  onChange={(e) => setEditCategoryForm({ ...editCategoryForm, slug: e.target.value })}
                  placeholder="Örn: zeytinyagi"
                  className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-category-description" className="text-sm font-semibold text-gray-700 mb-2 block">Açıklama</Label>
              <textarea
                id="edit-category-description"
                value={editCategoryForm.description}
                onChange={(e) => setEditCategoryForm({ ...editCategoryForm, description: e.target.value })}
                placeholder="Kategori açıklaması"
                rows={3}
                className="flex w-full rounded-xl border-2 border-gray-200 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="edit-category-image" className="text-sm font-semibold text-gray-700 mb-2 block">Resim URL</Label>
                <Input
                  id="edit-category-image"
                  value={editCategoryForm.image}
                  onChange={(e) => setEditCategoryForm({ ...editCategoryForm, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div>
                <Label htmlFor="edit-category-sort" className="text-sm font-semibold text-gray-700 mb-2 block">Sıralama</Label>
                <Input
                  id="edit-category-sort"
                  type="number"
                  value={editCategoryForm.sort_order}
                  onChange={(e) => setEditCategoryForm({ ...editCategoryForm, sort_order: parseInt(e.target.value) || 0 })}
                  className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div>
                <Label htmlFor="edit-category-status" className="text-sm font-semibold text-gray-700 mb-2 block">Durum</Label>
                <select
                  id="edit-category-status"
                  value={editCategoryForm.status}
                  onChange={(e) => setEditCategoryForm({ ...editCategoryForm, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-background px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
                >
                  <option value="ACTIVE">Aktif</option>
                  <option value="INACTIVE">Pasif</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={updateCategory}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 font-semibold px-6 py-3"
              >
                <Edit className="w-4 h-4 mr-2" />
                Güncelle
              </Button>
              <Button 
                variant="outline"
                onClick={() => setEditingCategory(null)}
                className="px-6 py-3"
              >
                İptal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alt Kategori Düzenleme Dialog */}
      <Dialog open={!!editingSubcategory} onOpenChange={(open) => !open && setEditingSubcategory(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Edit className="w-4 h-4 text-white" />
              </div>
              Alt Kategori Düzenle
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="edit-subcategory-name" className="text-sm font-semibold text-gray-700 mb-2 block">Alt Kategori Adı *</Label>
                <Input
                  id="edit-subcategory-name"
                  value={editSubcategoryForm.name}
                  onChange={(e) => setEditSubcategoryForm({ ...editSubcategoryForm, name: e.target.value })}
                  placeholder="Örn: Sızma Zeytinyağı"
                  className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                />
              </div>
              <div>
                <Label htmlFor="edit-subcategory-slug" className="text-sm font-semibold text-gray-700 mb-2 block">Slug *</Label>
                <Input
                  id="edit-subcategory-slug"
                  value={editSubcategoryForm.slug}
                  onChange={(e) => setEditSubcategoryForm({ ...editSubcategoryForm, slug: e.target.value })}
                  placeholder="Örn: sizma-zeytinyagi"
                  className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-subcategory-description" className="text-sm font-semibold text-gray-700 mb-2 block">Açıklama</Label>
              <textarea
                id="edit-subcategory-description"
                value={editSubcategoryForm.description}
                onChange={(e) => setEditSubcategoryForm({ ...editSubcategoryForm, description: e.target.value })}
                placeholder="Alt kategori açıklaması"
                rows={3}
                className="flex w-full rounded-xl border-2 border-gray-200 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="edit-subcategory-image" className="text-sm font-semibold text-gray-700 mb-2 block">Resim URL</Label>
                <Input
                  id="edit-subcategory-image"
                  value={editSubcategoryForm.image}
                  onChange={(e) => setEditSubcategoryForm({ ...editSubcategoryForm, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                />
              </div>
              <div>
                <Label htmlFor="edit-subcategory-sort" className="text-sm font-semibold text-gray-700 mb-2 block">Sıralama</Label>
                <Input
                  id="edit-subcategory-sort"
                  type="number"
                  value={editSubcategoryForm.sort_order}
                  onChange={(e) => setEditSubcategoryForm({ ...editSubcategoryForm, sort_order: parseInt(e.target.value) || 0 })}
                  className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                />
              </div>
              <div>
                <Label htmlFor="edit-subcategory-status" className="text-sm font-semibold text-gray-700 mb-2 block">Durum</Label>
                <select
                  id="edit-subcategory-status"
                  value={editSubcategoryForm.status}
                  onChange={(e) => setEditSubcategoryForm({ ...editSubcategoryForm, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                  className="flex w-full rounded-xl border-2 border-gray-200 bg-background px-3 py-2 text-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none"
                >
                  <option value="ACTIVE">Aktif</option>
                  <option value="INACTIVE">Pasif</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={updateSubCategory}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 font-semibold px-6 py-3"
              >
                <Edit className="w-4 h-4 mr-2" />
                Güncelle
              </Button>
              <Button 
                variant="outline"
                onClick={() => setEditingSubcategory(null)}
                className="px-6 py-3"
              >
                İptal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
