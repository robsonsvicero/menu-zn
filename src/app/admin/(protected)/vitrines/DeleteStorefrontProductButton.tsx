"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteStorefrontProductAction } from "./actions";

export function DeleteStorefrontProductButton({ id, name, slug }: { id: string; name: string; slug: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Excluir o produto "${name}"?`)) return;
    startTransition(async () => {
      const result = await deleteStorefrontProductAction(id, slug);
      if (!result.success) {
        alert(result.message);
        return;
      }
      if (result.message !== "Produto excluído.") alert(result.message);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-lg border border-outline px-3 py-2 text-xs font-medium text-red-700 hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 size={14} aria-hidden="true" />
      {isPending ? "Excluindo..." : "Excluir"}
    </button>
  );
}
