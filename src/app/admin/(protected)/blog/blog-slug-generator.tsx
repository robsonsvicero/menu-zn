"use client";

import { useEffect } from "react";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function BlogSlugGenerator() {
  useEffect(() => {
    const titleInput = document.querySelector('input[name="title"]') as HTMLInputElement;
    const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;

    if (!titleInput || !slugInput) return;

    let isSlugManuallyEdited = Boolean(slugInput.value.trim());

    const handleTitleChange = () => {
      if (!isSlugManuallyEdited) {
        slugInput.value = slugify(titleInput.value);
      }
    };

    const handleSlugChange = () => {
      const generatedSlug = slugify(titleInput.value);
      const currentSlug = slugInput.value.trim();

      if (!currentSlug) {
        isSlugManuallyEdited = false;
        return;
      }

      isSlugManuallyEdited = currentSlug !== generatedSlug;
    };

    titleInput.addEventListener("input", handleTitleChange);
    slugInput.addEventListener("input", handleSlugChange);

    handleTitleChange();

    return () => {
      titleInput.removeEventListener("input", handleTitleChange);
      slugInput.removeEventListener("input", handleSlugChange);
    };
  }, []);

  return null;
}
