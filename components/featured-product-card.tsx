"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Product } from "@prisma/client";
import { extractProductImages } from "@/lib/image-utils";

interface FeaturedProductCardProps {
  product: Product;
}

export function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const productImages = extractProductImages(product.images);
  const firstImage = productImages[0];

  return (
    <Link 
      href={`/products/${product.slug}`} 
      className="block group"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-700"></div>
        <Card className="relative border-2 border-gray-200 hover:border-green-400 hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <CardContent className="p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 rounded-2xl h-64 md:h-80 overflow-hidden">
                {firstImage ? (
                  <img
                    src={firstImage}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5K2PC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                ) : (
                  <div className="text-center flex items-center justify-center h-full">
                    <div className="text-8xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">🫒</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-green-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>

              {/* Product Info */}
              <div className="text-left">
                <Badge className="mb-4 bg-gradient-to-r from-green-700 to-emerald-700 text-white shadow-lg">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Premium Ürün
                </Badge>
                
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                  {product.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm group/item hover:translate-x-2 transition-transform duration-300">
                    <div className="bg-green-100 p-1 rounded-lg">
                      <Check className="h-4 w-4 text-green-700" />
                    </div>
                    <span className="text-gray-700">Premium Kalite</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm group/item hover:translate-x-2 transition-transform duration-300">
                    <div className="bg-green-100 p-1 rounded-lg">
                      <Check className="h-4 w-4 text-green-700" />
                    </div>
                    <span className="text-gray-700">%100 Doğal</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm group/item hover:translate-x-2 transition-transform duration-300">
                    <div className="bg-green-100 p-1 rounded-lg">
                      <Check className="h-4 w-4 text-green-700" />
                    </div>
                    <span className="text-gray-700">{product.price / 100} TL</span>
                  </div>
                </div>
                
                <Button className="bg-green-700 hover:bg-green-800 text-white px-6 py-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 group/btn">
                  İncele
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}

