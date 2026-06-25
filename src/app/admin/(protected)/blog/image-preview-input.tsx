"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon } from "lucide-react";

export function ImagePreviewInput({ 
  name = "image_file", 
  defaultImageUrl = "" 
}: { 
  name?: string;
  defaultImageUrl?: string;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(defaultImageUrl || null);
    }
  };

  return (
    <label className="flex flex-col items-center justify-center w-full h-40 rounded-3xl border border-dashed border-[#d2e2ff] bg-[#faf8f5] hover:bg-[#f3f8ff] transition cursor-pointer relative overflow-hidden group">
      <input 
        type="file" 
        name={name}
        accept="image/*" 
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20" 
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <div className="flex flex-col items-center gap-3 z-10 relative">
        <div className="w-10 h-10 rounded-full bg-[#e8f1ff] flex items-center justify-center text-[#4F95FF] shadow-sm">
          <ImageIcon size={18} />
        </div>
        <div className="text-center bg-white/80 px-4 py-1 rounded-full backdrop-blur-sm">
          <p className="text-sm font-bold text-[#4F95FF]">{previewUrl ? "Nova imagem de capa" : "Imagem de capa do post"}</p>
          <p className="text-[11px] text-[#4F95FF]/80 mt-0.5">{previewUrl ? "Clique para substituir" : "Arraste ou clique para enviar"}</p>
        </div>
      </div>
      {previewUrl && (
        <img 
          src={previewUrl} 
          alt="Preview da capa" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition z-0" 
        />
      )}
    </label>
  );
}
