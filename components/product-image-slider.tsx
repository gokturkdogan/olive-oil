"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImageSliderProps {
  images: string[];
  title: string;
}

export function ProductImageSlider({ images, title }: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 rounded-2xl border-2 border-green-200 overflow-hidden">
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              🫒
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Main Image Container */}
      <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 rounded-2xl border-2 border-green-200 overflow-hidden">
        {/* Main Image */}
        <div className="relative h-[400px] overflow-hidden">
          <img
            src={images[currentIndex]}
            alt={`${title} - Görsel ${currentIndex + 1}`}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isZoomed ? 'scale-150' : 'group-hover:scale-105'
            }`}
            onError={(e) => {
              // Fallback to emoji if image fails to load
              e.currentTarget.style.display = 'none';
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextElement) {
                nextElement.style.display = 'flex';
              }
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
            <div className="text-8xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              🫒
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Zoom Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-lg border-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-green-200">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    index === currentIndex
                      ? 'border-green-500 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${title} - Küçük görsel ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5K2PC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Overlay */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={images[currentIndex]}
              alt={`${title} - Büyük görsel ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-lg"
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
