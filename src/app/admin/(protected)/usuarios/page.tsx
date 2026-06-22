import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { resetUserPasswordAction, updateUserRoleAction } from "./actions";

export const dynamic = "force-dynamic";

type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean | null;
  role_codes: string[];
  created_at: string;
  last_sign_in_at: string | null;
};

type SearchParams = {
  q?: string;
  role?: string;
  status?: string;
};

type RoleOption = {
  code: string;
  name: string;
};

type Params = {
  q?: string;
  role?: string;
  status?: string;
};

const allowedManagerRoles = new Set(["super_admin", "admin"]);
const rolePriority = ["super_admin", "admin", "editor", "viewer"];

function getPrimaryRole(roleCodes: string[]) {
  return rolePriority.find((code) => roleCodes.includes(code)) ?? "sem role";
}

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const searchTerm = (params.q ?? "").trim();
  const roleFilter = (params.role ?? "").trim();
  const statusFilter = (params.status ?? "").trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: roleRows } = await supabase
    .from("user_roles")
    .select("roles(code)")
    .eq("user_id", user.id);

  const currentRoleCodes = (roleRows ?? [])
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

  const [{ data: authUsers }, { data: profiles }, { data: roles }, { data: roleOptions }] = await Promise.all([
    adminClient.auth.admin.listUsers(),
    adminClient.from("profiles").select("id, full_name, is_active, created_at, last_login_at"),
    adminClient.from("user_roles").select("user_id, roles(code)"),
    adminClient.from("roles").select("code, name").order("name"),
  ]);

  const roleCodesByUser = new Map<string, string[]>();

  (roles ?? []).forEach((row) => {
    const userId = (row as { user_id?: string }).user_id;
    const roleCode = (row as { roles?: { code?: string } | null }).roles?.code;

    if (!userId || !roleCode) {
      return;
    }

    const existing = roleCodesByUser.get(userId) ?? [];
    roleCodesByUser.set(userId, Array.from(new Set([...existing, roleCode])));
  });

  const users: UserRow[] = (authUsers?.users ?? []).map((authUser) => {
    const profile = (profiles ?? []).find((item) => item.id === authUser.id) as
      | { full_name: string | null; is_active: boolean | null; created_at: string; last_login_at: string | null }
      | undefined;

    return {
      id: authUser.id,
      email: authUser.email ?? "-",
      full_name: profile?.full_name ?? null,
      is_active: profile?.is_active ?? null,
      role_codes: roleCodesByUser.get(authUser.id) ?? [],
      created_at: profile?.created_at ?? authUser.created_at,
      last_sign_in_at: authUser.last_sign_in_at ?? profile?.last_login_at ?? null,
    };
  });

  const filteredUsers = users.filter((item) => {
    const query = searchTerm.toLowerCase();
    const matchesQuery =
      query === "" ||
      item.email.toLowerCase().includes(query) ||
      (item.full_name ?? "").toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query);

    const matchesRole = !roleFilter || item.role_codes.includes(roleFilter);

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" && item.is_active !== false) ||
      (statusFilter === "inactive" && item.is_active === false);

    return matchesQuery && matchesRole && matchesStatus;
  });

  const roleFilterOptions = (roleOptions ?? []) as RoleOption[];

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-serif">Usuários</h2>
          <p className="text-sm text-on-surface/70 mt-1">Controle de perfis, roles e troca de senha do time administrativo.</p>
        </div>
      </div>

      <form method="get" className="mb-5 grid gap-3 rounded-2xl border border-outline bg-white p-4 md:grid-cols-[1fr_220px_180px_auto_auto]">
        <input
          type="text"
          name="q"
          defaultValue={searchTerm}
          placeholder="Buscar por nome, email ou ID"
          className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
        />

        <select name="role" defaultValue={roleFilter} className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
          <option value="">Todas as roles</option>
          {roleFilterOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>

        <select name="status" defaultValue={statusFilter} className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
          <option value="">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>

        <button type="submit" className="rounded-xl border border-outline px-4 py-2 text-sm hover:bg-background">
          Filtrar
        </button>

        <Link href="/admin/usuarios" className="rounded-xl border border-outline px-4 py-2 text-sm hover:bg-background text-center">
          Limpar
        </Link>
      </form>

      <p className="mb-4 text-xs text-on-surface/60">
        Exibindo {filteredUsers.length} de {users.length} usuários.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-outline bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-background text-on-surface/70">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Usuário</th>
              <th className="px-4 py-3 text-left font-medium">Role atual</th>
              <th className="px-4 py-3 text-left font-medium">Ativo</th>
              <th className="px-4 py-3 text-left font-medium">Último acesso</th>
              <th className="px-4 py-3 text-left font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((item) => (
              <tr key={item.id} className="border-t border-outline/60 align-top">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.full_name ?? "Sem nome"}</div>
                  <div className="text-xs text-on-surface/60">{item.email}</div>
                  <div className="text-[11px] text-on-surface/50 mt-1">ID: {item.id}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium">{getPrimaryRole(item.role_codes)}</div>
                  <div className="text-xs text-on-surface/60">{item.role_codes.length ? item.role_codes.join(", ") : "sem roles"}</div>
                </td>
                <td className="px-4 py-3">{item.is_active === false ? "Não" : "Sim"}</td>
                <td className="px-4 py-3 text-on-surface/70">{item.last_sign_in_at ? new Date(item.last_sign_in_at).toLocaleString("pt-BR") : "-"}</td>
                <td className="px-4 py-3">
                  <div className="space-y-3">
                    <Link
                      href={`/admin/usuarios/${item.id}/editar`}
                      className="inline-flex rounded-lg border border-outline px-3 py-2 text-xs hover:bg-background"
                    >
                      Editar perfil
                    </Link>

                    <form action={updateUserRoleAction} className="flex flex-wrap items-center gap-2">
                      <input type="hidden" name="user_id" value={item.id} />
                      <select name="role_code" defaultValue={getPrimaryRole(item.role_codes) === "sem role" ? "viewer" : getPrimaryRole(item.role_codes)} className="rounded-lg border border-outline px-3 py-2 text-xs bg-white">
                        <option value="super_admin">super_admin</option>
                        <option value="admin">admin</option>
                        <option value="editor">editor</option>
                        <option value="viewer">viewer</option>
                      </select>
                      <button type="submit" className="rounded-lg border border-outline px-3 py-2 text-xs hover:bg-background">
                        Salvar role
                      </button>
                    </form>

                    <form action={resetUserPasswordAction} className="flex flex-wrap items-center gap-2">
                      <input type="hidden" name="user_id" value={item.id} />
                      <input name="new_password" type="password" minLength={8} placeholder="Nova senha" className="rounded-lg border border-outline px-3 py-2 text-xs" />
                      <button type="submit" className="rounded-lg border border-outline px-3 py-2 text-xs hover:bg-background">
                        Trocar senha
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-on-surface/70">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-on-surface/70">
                  Nenhum usuário corresponde aos filtros informados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-on-surface/60">A troca de senha é feita via Supabase Auth com service role. O papel é controlado por user_roles.</p>
    </section>
  );
}
