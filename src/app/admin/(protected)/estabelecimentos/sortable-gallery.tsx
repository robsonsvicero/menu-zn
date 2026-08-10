"use client";

import { useState, useRef, useCallback } from "react";
import { GripVertical, X, Plus } from "lucide-react";

interface SortableGalleryProps {
  existingImages: string[];
  maxImages?: number;
}

type ImageItem = {
  id: string;
  url: string;
  source: "existing" | "new";
  file?: File;
};

let idCounter = 0;
function nextId() {
  return `img_${++idCounter}_${Date.now()}`;
}

export function SortableGallery({ existingImages, maxImages = 6 }: SortableGalleryProps) {
  const [items, setItems] = useState<ImageItem[]>(() =>
    existingImages.map((url) => ({ id: nextId(), url, source: "existing" as const }))
  );

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Transfer new files to a DataTransfer for form submission
  const dataTransferRef = useRef<DataTransfer>(new DataTransfer());
  const hiddenFileRef = useRef<HTMLInputElement>(null);

  const syncHiddenFileInput = useCallback((newItems: ImageItem[]) => {
    const dt = new DataTransfer();
    newItems
      .filter((item) => item.source === "new" && item.file)
      .forEach((item) => dt.items.add(item.file!));
    dataTransferRef.current = dt;
    if (hiddenFileRef.current) {
      hiddenFileRef.current.files = dt.files;
    }
  }, []);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    setItems((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(dragItem.current!, 1);
      updated.splice(dragOverItem.current!, 0, removed);
      syncHiddenFileInput(updated);
      return updated;
    });

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      syncHiddenFileInput(updated);
      return updated;
    });
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = maxImages - items.length;
    const filesToAdd = Array.from(files).slice(0, remaining);

    const newItems: ImageItem[] = filesToAdd.map((file) => ({
      id: nextId(),
      url: URL.createObjectURL(file),
      source: "new" as const,
      file,
    }));

    setItems((prev) => {
      const updated = [...prev, ...newItems];
      syncHiddenFileInput(updated);
      return updated;
    });

    // Reset file input so the same file can be selected again
    e.target.value = "";
  };

  // Build the image order for form submission as JSON
  // Each entry is either { type: "existing", url: "..." } or { type: "new", fileIndex: N }
  const imageOrder = items.map((item) => {
    if (item.source === "existing") {
      return { type: "existing" as const, url: item.url };
    }
    // For new files, find the index within only the new files
    const newItems = items.filter((i) => i.source === "new");
    const fileIndex = newItems.findIndex((i) => i.id === item.id);
    return { type: "new" as const, fileIndex };
  });

  return (
    <div>
      <label className="block text-sm mb-2 font-medium">
        Imagens da Galeria (Máximo {maxImages})
      </label>

      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              className="relative group border border-outline/25 rounded-xl bg-white shadow-sm overflow-hidden cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={item.url}
                  alt={`Galeria ${index + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {/* Drag handle overlay */}
                <div className="absolute top-2 left-2 bg-black/50 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  <GripVertical size={16} />
                </div>
                {/* Position badge */}
                <div className="absolute top-2 right-10 bg-black/50 text-white text-xs font-bold rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  {index + 1}
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition"
                  title="Remover imagem"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="px-3 py-2 text-xs text-on-surface/60 flex items-center gap-1">
                <GripVertical size={12} className="text-on-surface/40" />
                Arraste para reordenar
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length < maxImages && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 rounded-xl border-2 border-dashed border-outline/40 px-4 py-3 text-sm text-on-surface/60 hover:border-primary/50 hover:text-primary transition w-full justify-center"
        >
          <Plus size={16} />
          Adicionar imagens ({items.length}/{maxImages})
        </button>
      )}

      {/* Hidden file input for picking new images */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleAddFiles}
        className="hidden"
      />

      {/* Serialized image order as JSON for the server action */}
      <input type="hidden" name="image_order" value={JSON.stringify(imageOrder)} />

      {/* Hidden file input synced with new files in correct order */}
      <input
        ref={hiddenFileRef}
        type="file"
        name="gallery_files"
        multiple
        className="hidden"
        tabIndex={-1}
      />

      <p className="mt-1 text-xs text-on-surface/60">
        Arraste e solte para reordenar. Clique no X para remover. O total é limitado a {maxImages}.
      </p>
    </div>
  );
}
