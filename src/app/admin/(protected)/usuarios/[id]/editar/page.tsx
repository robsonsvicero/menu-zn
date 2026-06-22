import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { resetUserPasswordAction, updateUserProfileAction } from "../../actions";

export const dynamic = "force-dynamic";

type RoleOption = {
  code: string;
  name: string;
};

type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean | null;
  role_code: string;
};

const allowedManagerRoles = new Set(["super_admin", "admin"]);
const rolePriority = ["super_admin", "admin", "editor", "viewer"];

function getPrimaryRole(roleCodes: string[]) {
  return rolePriority.find((code) => roleCodes.includes(code)) ?? "viewer";
}

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: currentRoles } = await supabase
    .from("user_roles")
    .select("roles(code)")
    .eq("user_id", user.id);

  const currentRoleCodes = (currentRoles ?? [])
    .map((row) => (row as { roles?: { code?: string } | null }).roles?.code)
    .filter((code): code is string => Boolean(code));

  const hasManagerAccess = currentRoleCodes.some((code) => allowedManagerRoles.has(code));

  if (!hasManagerAccess) {
    return (
      <section>
        <h2 className="text-3xl font-serif mb-2">Usuários</h2>
        <p className="text-sm text-on-surface/70">Acesso restrito a super_admin e admin.</p>
      </section>
    );
  }

  const [{ data: authUserResult }, { data: profile }, { data: roles }, { data: roleOptions }] = await Promise.all([
    adminClient.auth.admin.getUserById(id),
    adminClient
      .from("profiles")
      .select("id, full_name, avatar_url, phone, is_active")
      .eq("id", id)
      .maybeSingle(),
    adminClient.from("user_roles").select("roles(code)").eq("user_id", id),
    adminClient.from("roles").select("code, name").order("name"),
  ]);

  const authUser = authUserResult?.user;

  if (!authUser) {
    notFound();
  }

  const userRoleCodes = (roles ?? [])
    .map((row) => (row as { roles?: { code?: string } | null }).roles?.code)
    .filter((code): code is string => Boolean(code));

  const userProfile = {
    id,
    email: authUser.email ?? "-",
    full_name: profile?.full_name ?? null,
    avatar_url: profile?.avatar_url ?? null,
    phone: profile?.phone ?? null,
    is_active: profile?.is_active ?? true,
    role_code: getPrimaryRole(userRoleCodes),
  } satisfies UserProfile;

  const availableRoles = (roleOptions ?? []) as RoleOption[];

  return (
    <section className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-3xl font-serif">Editar perfil</h2>
        <p className="text-sm text-on-surface/70 mt-1">Atualize dados públicos do perfil, status e role administrativa.</p>
      </div>

      <div className="mb-5 rounded-2xl border border-outline bg-white p-5 text-sm">
        <div className="font-medium">{userProfile.full_name ?? "Sem nome"}</div>
        <div className="text-on-surface/60">{userProfile.email}</div>
        <div className="text-xs text-on-surface/50 mt-1">ID: {userProfile.id}</div>
      </div>

      <form action={updateUserProfileAction} className="rounded-2xl border border-outline bg-white p-6 md:p-8 space-y-5">
        <input type="hidden" name="user_id" value={userProfile.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Nome completo</label>
            <input name="full_name" defaultValue={userProfile.full_name ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Avatar URL</label>
            <input name="avatar_url" defaultValue={userProfile.avatar_url ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Telefone</label>
            <input name="phone" defaultValue={userProfile.phone ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select name="role_code" defaultValue={userProfile.role_code} className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
              {availableRoles.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" defaultChecked={userProfile.is_active !== false} className="rounded border-outline" />
          Usuário ativo
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
            Salvar perfil
          </button>
          <Link href="/admin/usuarios" className="rounded-xl border border-outline px-5 py-2.5 text-sm hover:bg-background">
            Voltar
          </Link>
        </div>
      </form>

      <form action={resetUserPasswordAction} className="mt-5 rounded-2xl border border-outline bg-white p-6 md:p-8 space-y-4">
        <input type="hidden" name="user_id" value={userProfile.id} />
        <div>
          <h3 className="text-lg font-serif">Redefinir senha</h3>
          <p className="text-sm text-on-surface/70 mt-1">Defina uma nova senha com pelo menos 8 caracteres.</p>
        </div>

        <div className="max-w-md">
          <label className="block text-sm mb-1">Nova senha</label>
          <input name="new_password" type="password" minLength={8} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
        </div>

        <button type="submit" className="rounded-xl border border-outline px-5 py-2.5 text-sm hover:bg-background">
          Trocar senha
        </button>
      </form>
    </section>
  );
}
