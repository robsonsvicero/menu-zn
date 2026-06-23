"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { addNeighborhoodAction } from "./actions";

interface NeighborhoodDialogProps {
  onNeighborhoodAdded?: () => void;
}

export function NeighborhoodDialog({ onNeighborhoodAdded }: NeighborhoodDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const handleOpenDialog = () => {
    setIsOpen(true);
    setError(null);
    dialogRef.current?.showModal();
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    dialogRef.current?.close();
    if (nameRef.current) {
      nameRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError(null);

    const name = nameRef.current?.value.trim();

    if (!name) {
      setError("Nome do bairro é obrigatório");
      return;
    }

    setIsLoading(true);

    try {
      await addNeighborhoodAction(name);
      handleCloseDialog();
      // Recarrega dados do servidor sem limpar formulário
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar bairro");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      const name = nameRef.current?.value.trim();
      if (name) {
        handleSubmit(e as any);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenDialog}
        className="rounded-xl bg-background border border-outline px-3 py-2 text-sm font-medium hover:bg-surface transition-colors"
      >
        + Novo bairro
      </button>

      <dialog
        ref={dialogRef}
        className="backdrop:bg-black/50 rounded-2xl border border-outline shadow-lg max-w-sm w-full p-0"
      >
        <div className="p-6">
          <h3 className="text-lg font-serif mb-4">Adicionar novo bairro</h3>

          <div onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nome do bairro *</label>
              <input
                ref={nameRef}
                name="neighborhood_name"
                type="text"
                autoFocus
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
                placeholder="ex: Centro, Zona Sul..."
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => handleSubmit(e as any)}
                disabled={isLoading}
                className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? "Criando..." : "Criar bairro"}
              </button>
              <button
                type="button"
                onClick={handleCloseDialog}
                disabled={isLoading}
                className="flex-1 rounded-xl bg-surface border border-outline px-4 py-2 text-sm font-medium hover:bg-surface/80 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
