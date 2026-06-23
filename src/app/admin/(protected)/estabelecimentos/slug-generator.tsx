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

export function SlugGenerator() {
  useEffect(() => {
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;

    if (!nameInput || !slugInput) return;

    let isSlugManuallyEdited = Boolean(slugInput.value.trim());

    const handleNameChange = () => {
      if (!isSlugManuallyEdited) {
        slugInput.value = slugify(nameInput.value);
      }
    };

    const handleSlugChange = () => {
      const generatedSlug = slugify(nameInput.value);
      const currentSlug = slugInput.value.trim();

      if (!currentSlug) {
        isSlugManuallyEdited = false;
        return;
      }

      isSlugManuallyEdited = currentSlug !== generatedSlug;
    };

    nameInput.addEventListener("input", handleNameChange);
    slugInput.addEventListener("input", handleSlugChange);

    // Sincroniza o slug inicial quando o campo slug estiver vazio.
    handleNameChange();

    return () => {
      nameInput.removeEventListener("input", handleNameChange);
      slugInput.removeEventListener("input", handleSlugChange);
    };
  }, []);

  return null;
}
