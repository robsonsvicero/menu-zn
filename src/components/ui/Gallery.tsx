"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryProps {
  images: string[];
  establishmentName: string;
}

export function Gallery({ images, establishmentName }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <article className="rounded-[28px] border border-outline/20 bg-white p-8 shadow-sm">
      <h2 className="font-serif text-2xl mb-5">Galeria de Fotos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((url, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-outline/10 cursor-pointer group"
            onClick={() => openLightbox(i)}
          >
            <Image
              src={url}
              alt={`Foto ${i + 1} de ${establishmentName}`}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
              <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                Visualizar
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition"
            aria-label="Fechar visualização"
          >
            <X size={24} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={showPrev}
                className="absolute left-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition"
                aria-label="Foto anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={showNext}
                className="absolute right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition"
                aria-label="Próxima foto"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="relative max-w-[90vw] max-h-[85vh] aspect-auto select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedIndex]}
              alt={`Foto ${selectedIndex + 1} ampliada de ${establishmentName}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded-full text-white text-xs font-medium backdrop-blur-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
