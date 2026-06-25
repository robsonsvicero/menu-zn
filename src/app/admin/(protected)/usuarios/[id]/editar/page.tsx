import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { resetUserPasswordAction, updateUserProfileAction } from "../../actions";
import EditarUsuarioForm from "./EditarUsuarioForm";

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

  const hasManagerAccess = currentRoleCodes.some((code) =>
    allowedManagerRoles.has(code)
  );

  if (!hasManagerAccess) {
    return (
      <section>
        <h2 className="text-3xl font-serif mb-2">Usuários</h2>
        <p className="text-sm text-on-surface/70">Acesso restrito a super_admin e admin.</p>
      </section>
    );
  }

  const [
    { data: authUserResult },
    { data: profile },
    { data: roles },
    { data: roleOptions },
  ] = await Promise.all([
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
        <p className="text-sm text-on-surface/70 mt-1">
          Atualize dados públicos do perfil, status e role administrativa.
        </p>
      </div>

      <EditarUsuarioForm
        userProfile={userProfile}
        availableRoles={availableRoles}
        resetPasswordAction={resetUserPasswordAction}
      />
    </section>
  );
}
