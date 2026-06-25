"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Mail } from "lucide-react";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/admin/nova-senha`,
      }
    );

    setLoading(false);

    if (resetError) {
      setError("Não foi possível enviar o e-mail. Tente novamente.");
      return;
    }

    setSent(true);
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-outline bg-white p-8 shadow-sm">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 text-sm text-on-surface/60 hover:text-on-surface mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar para o login
        </Link>

        <h1 className="text-3xl font-serif text-on-surface mb-2">
          Recuperar senha
        </h1>

        {sent ? (
          <div className="mt-4">
            <div className="flex items-center gap-3 rounded-xl border border-outline bg-surface p-4 mb-4">
              <Mail size={20} className="text-primary shrink-0" />
              <p className="text-sm text-on-surface">
                Enviamos um link de redefinição para{" "}
                <span className="font-medium">{email}</span>. Verifique sua
                caixa de entrada (e o spam).
              </p>
            </div>
            <p className="text-xs text-on-surface/50">
              O link expira em 1 hora. Caso não receba, confira o e-mail
              digitado e tente novamente.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-on-surface/70 mb-6">
              Digite o e-mail da sua conta e enviaremos um link para você
              criar uma nova senha.
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-outline px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="voce@menuzn.com.br"
                />
              </div>

              {error ? (
                <p className="text-sm text-error">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary text-white py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Enviar link de redefinição"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
