"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteStorefrontAction } from "./actions";

export function DeleteStorefrontButton({
  id,
  title,
  className,
}: {
  id: string;
  title: string;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (
      !confirm(
        `Tem certeza que deseja excluir a vitrine "${title}" e todos os seus produtos associados?`
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteStorefrontAction(id);
      if (!result.success) {
        alert(result.message);
        return;
      }
      router.push("/admin/vitrines");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
      }
    >
      <Trash2 size={14} aria-hidden="true" />
      {isPending ? "Excluindo..." : "Excluir vitrine"}
    </button>
  );
}
