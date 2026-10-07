"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteBlogPostAction } from "./actions";

type DeleteBlogPostButtonProps = {
  id: string;
  title: string;
};

export function DeleteBlogPostButton({ id, title }: DeleteBlogPostButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Tem certeza que deseja excluir o artigo "${title}"?`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteBlogPostAction(id);

      if (!result.success) {
        alert(`Erro ao excluir: ${result.message}`);
        return;
      }

      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-lg border border-outline px-2.5 py-1 text-xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      <Trash2 size={12} aria-hidden="true" />
      {isPending ? "Excluindo..." : "Excluir"}
    </button>
  );
}
