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
  onLinkClick?: () => void;
}

export function CategoryDropdown({ pathname, onLinkClick }: CategoryDropdownProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [clickedCategory, setClickedCategory] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [subDropdownPosition, setSubDropdownPosition] = useState<'left' | 'right'>('right');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchCategories();
    
    // Check if mobile (< 768px = Tailwind's 'md' breakpoint)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdown when pathname changes
  useEffect(() => {
    setIsOpen(false);
    setClickedCategory(null);
    setHoveredCategory(null);
  }, [pathname]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };
  
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  
  const handleCategoryClick = (e: React.MouseEvent, categoryId: string) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setClickedCategory(clickedCategory === categoryId ? null : categoryId);
    }
  };

  const handleMouseEnter = () => {
    if (isMobile) return; // Mobile'da hover çalışmasın
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return; // Mobile'da hover çalışmasın
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
    if (isMobile) return; // Mobile'da hover çalışmasın
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
    if (isMobile) return; // Mobile'da hover çalışmasın
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
        onClick={isMobile ? (e) => handleToggle(e) : undefined}
        className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
          pathname.startsWith("/products") || pathname.startsWith("/category") || pathname.startsWith("/subcategory")
            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md" 
            : "text-gray-700 hover:bg-green-50 hover:text-green-700"
        }`}
      >
        Ürünler
        <ChevronDown className={`inline-block ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
              onClick={() => {
                setIsOpen(false);
                setClickedCategory(null);
                onLinkClick?.();
              }}
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
                <div 
                  onClick={(e) => handleCategoryClick(e, category.id)}
                  className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-150 cursor-pointer"
                >
                  <Link 
                    href={isMobile && category.subcategories.length > 0 ? "#" : `/category/${category.slug}`}
                    onClick={(e) => {
                      if (isMobile && category.subcategories.length > 0) {
                        e.preventDefault();
                      }
                      if (!isMobile || category.subcategories.length === 0) {
                        setIsOpen(false);
                        if (isMobile) setClickedCategory(null);
                        onLinkClick?.();
                      }
                    }}
                  >
                    {category.name}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <ChevronDown className={`h-4 w-4 transition-transform ${(clickedCategory === category.id) ? 'rotate-180' : ''}`} />
                  )}
                </div>

                {/* Sub Kategoriler */}
                {((hoveredCategory === category.id && !isMobile) || (clickedCategory === category.id && isMobile)) && category.subcategories.length > 0 && (
                  <div 
                    className={`w-full bg-white rounded-lg shadow-xl border border-gray-200 z-[60] transition-all duration-200 ease-out ${
                      isMobile 
                        ? 'relative mt-1' 
                        : `absolute top-0 ${
                            subDropdownPosition === 'right' 
                              ? 'left-full ml-1 w-56' 
                              : 'right-full mr-1 w-56'
                          }`
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
                            setClickedCategory(null);
                            onLinkClick?.();
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
