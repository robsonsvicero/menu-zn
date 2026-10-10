"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteAdvertisementAction } from "./actions";

type Props = {
  id: string;
  title: string;
  className?: string;
};

export function DeleteAdvertisementButton({ id, title, className }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Tem certeza que deseja excluir o anúncio "${title}"?`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAdvertisementAction(id);

      if (!result.success) {
        alert(result.message);
        return;
      }

      if (result.warning) {
        alert(`${result.message} ${result.warning}`);
      }

      router.push("/admin/anuncios?deleted=1");
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
        "inline-flex items-center gap-1.5 rounded-lg border border-outline px-3 py-2 text-xs font-medium transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
      }
    >
      <Trash2 size={14} aria-hidden="true" />
      {isPending ? "Excluindo..." : "Excluir"}
    </button>
  );
}
