"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteTestimonialAction } from "./actions";

type DeleteTestimonialButtonProps = {
  id: string;
  authorName: string;
  redirectAfterDelete?: boolean;
  className?: string;
};

export function DeleteTestimonialButton({
  id,
  authorName,
  redirectAfterDelete = false,
  className,
}: DeleteTestimonialButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Tem certeza que deseja excluir o depoimento de "${authorName}"?`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteTestimonialAction(id);

      if (!result.success) {
        alert(`Erro ao excluir: ${result.message}`);
        return;
      }

      if (redirectAfterDelete) {
        router.push("/admin/depoimentos");
        router.refresh();
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
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-lg border border-outline px-2.5 py-1 text-xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      }
    >
      <Trash2 size={12} aria-hidden="true" />
      {isPending ? "Excluindo..." : "Excluir"}
    </button>
  );
}
