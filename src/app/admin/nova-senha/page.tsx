"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function NovaSenhaPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // "waiting" → aguardando evento | "ready" → sessão recovery ativa | "invalid" → link inválido/expirado
  const [status, setStatus] = useState<"waiting" | "ready" | "invalid">("waiting");

  useEffect(() => {
    const supabase = createClient();

    // O Supabase troca o token de recuperação da URL (hash ou PKCE) por uma
    // sessão e dispara o evento PASSWORD_RECOVERY. Esse é o único sinal
    // confiável de que a sessão tem permissão para chamar updateUser.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setStatus("ready");
        }
      }
    );

    // Fallback: se o usuário chegar aqui sem um token válido (link expirado
    // ou navegação direta), marcamos como inválido após um breve delay para
    // deixar o SDK processar o hash antes de decidir.
    const timer = setTimeout(() => {
      setStatus((prev) => (prev === "waiting" ? "invalid" : prev));
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("Não foi possível atualizar a senha. Tente novamente.");
      return;
    }

    // Encerra a sessão de recovery para forçar login limpo
    await supabase.auth.signOut();
    router.push("/admin/login?senha_atualizada=1");
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-outline bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-serif text-on-surface mb-2">Nova senha</h1>
        <p className="text-sm text-on-surface/70 mb-6">
          Escolha uma nova senha para sua conta.
        </p>

        {status === "waiting" && (
          <p className="text-sm text-on-surface/60">Verificando link...</p>
        )}

        {status === "invalid" && (
          <div className="space-y-4">
            <p className="text-sm text-error">
              Link inválido ou expirado. Solicite um novo link de recuperação.
            </p>
            <a
              href="/admin/recuperar-senha"
              className="inline-block text-sm text-primary hover:underline"
            >
              Solicitar novo link
            </a>
          </div>
        )}

        {status === "ready" && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nova senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-outline pl-3 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/60 hover:text-on-surface"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Confirmar senha</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full rounded-xl border border-outline px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="********"
              />
            </div>

            {error ? <p className="text-sm text-error">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary text-white py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
