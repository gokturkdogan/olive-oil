'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

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

interface CategoryDropdownProps {
  pathname: string;
}

export function CategoryDropdown({ pathname }: CategoryDropdownProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [subDropdownPosition, setSubDropdownPosition] = useState<'left' | 'right'>('right');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => {
      setIsOpen(false);
      setHoveredCategory(null);
    }, 200); // Biraz daha uzun süre
    setHoverTimeout(timeout);
  };

  const handleCategoryMouseEnter = (categoryId: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredCategory(categoryId);
    
    // Sub dropdown pozisyonunu kontrol et
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const subDropdownWidth = 224; // w-56 = 14rem = 224px
      
      if (rect.right + subDropdownWidth > viewportWidth) {
        setSubDropdownPosition('left');
      } else {
        setSubDropdownPosition('right');
      }
    }
  };

  const handleCategoryMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
    }, 200); // Biraz daha uzun süre
    setHoverTimeout(timeout);
  };

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
          pathname.startsWith("/products") || pathname.startsWith("/category") || pathname.startsWith("/subcategory")
            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md" 
            : "text-gray-700 hover:bg-green-50 hover:text-green-700"
        }`}
      >
        Ürünler
        <ChevronDown className="inline-block ml-1 h-4 w-4" />
      </div>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-[55] transition-all duration-200 ease-out"
          style={{
            animation: 'fadeInUp 0.2s ease-out'
          }}
        >
          <div className="py-2">
            <Link
              href="/products"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Tüm Ürünler
            </Link>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="relative"
                onMouseEnter={() => handleCategoryMouseEnter(category.id)}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-150 cursor-pointer">
                  <Link 
                    href={`/category/${category.slug}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>

                {/* Sub Kategoriler */}
                {hoveredCategory === category.id && category.subcategories.length > 0 && (
                  <div 
                    className={`absolute top-0 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-[60] transition-all duration-200 ease-out ${
                      subDropdownPosition === 'right' 
                        ? 'left-full ml-1' 
                        : 'right-full mr-1'
                    }`}
                    style={{
                      animation: 'fadeInUp 0.2s ease-out'
                    }}
                  >
                    <div className="py-2">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/subcategory/${subcategory.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-150 hover:translate-x-1"
                          onClick={() => {
                            setIsOpen(false);
                            setHoveredCategory(null);
                          }}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
