"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteNewsletterSubscriber } from "@/app/admin/(protected)/newsletter/actions";

type Props = {
  id: string;
  email: string;
};

export default function NewsletterDeleteButton({ id, email }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Tem certeza que deseja remover "${email}" da newsletter?`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteNewsletterSubscriber(id);
      if (!result.success) {
        alert(`Erro ao remover: ${result.message}`);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-lg border border-outline px-2.5 py-1 text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
    >
      <Trash2 size={12} />
      {isPending ? "Removendo..." : "Remover"}
    </button>
  );
}
