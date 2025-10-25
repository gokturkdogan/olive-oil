'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface SubCategorySidebarProps {
  subcategories: SubCategory[];
  categorySlug: string;
}

export function SubCategorySidebar({ subcategories, categorySlug }: SubCategorySidebarProps) {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Alt Kategoriler</h3>
      
      <nav className="space-y-2">
        {subcategories.map((subcategory) => {
          const isActive = pathname === `/subcategory/${subcategory.slug}`;
          
          return (
            <Link
              key={subcategory.id}
              href={`/subcategory/${subcategory.slug}`}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-green-100 text-green-700 font-medium'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              {subcategory.name}
            </Link>
          );
        })}
      </nav>

      {/* Kategoriye Geri Dön */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          href={`/category/${categorySlug}`}
          className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors"
        >
          ← Tüm Kategoriye Dön
        </Link>
      </div>
    </div>
  );
}
