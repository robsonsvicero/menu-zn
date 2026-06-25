"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const allowedManagerRoles = new Set(["super_admin", "admin"]);
const assignableRoles = new Set(["super_admin", "admin", "editor", "viewer"]);

async function ensureUserManagerAccess() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data: roleRows, error: rolesError } = await supabase
    .from("user_roles")
    .select("roles(code)")
    .eq("user_id", user.id);

  if (rolesError) {
    throw new Error(rolesError.message);
  }

  const roleCodes = (roleRows ?? [])
    .map((row) => (row as { roles?: { code?: string } | null }).roles?.code)
    .filter((code): code is string => Boolean(code));

  const hasAccess = roleCodes.some((code) => allowedManagerRoles.has(code));

  if (!hasAccess) {
    throw new Error("Acesso negado.");
  }

  return { supabase, user, roleCodes };
}

export async function updateUserRoleAction(formData: FormData) {
  const { user, roleCodes } = await ensureUserManagerAccess();
  const adminClient = createAdminClient();

  const userId = String(formData.get("user_id") ?? "").trim();
  const roleCode = String(formData.get("role_code") ?? "").trim();

  if (!userId || !assignableRoles.has(roleCode)) {
    throw new Error("Dados inválidos para atualização de role.");
  }

  if (roleCode === "super_admin" && !roleCodes.includes("super_admin")) {
    throw new Error("Apenas super_admin pode conceder super_admin.");
  }

  const { data: roleRow, error: roleError } = await adminClient
    .from("roles")
    .select("id, code")
    .eq("code", roleCode)
    .single();

  if (roleError || !roleRow) {
    throw new Error(roleError?.message ?? "Role não encontrada.");
  }

  const { error: deleteError } = await adminClient.from("user_roles").delete().eq("user_id", userId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const { error: insertError } = await adminClient.from("user_roles").insert({
    user_id: userId,
    role_id: roleRow.id,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  revalidatePath("/admin/usuarios");
}

export async function resetUserPasswordAction(formData: FormData) {
  await ensureUserManagerAccess();
  const adminClient = createAdminClient();

  const userId = String(formData.get("user_id") ?? "").trim();
  const newPassword = String(formData.get("new_password") ?? "").trim();

  if (!userId || newPassword.length < 8) {
    throw new Error("A nova senha deve ter pelo menos 8 caracteres.");
  }

  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/usuarios");
}

export async function updateUserProfileAction(formData: FormData) {
  const { user } = await ensureUserManagerAccess();
  const adminClient = createAdminClient();

  const userId = String(formData.get("user_id") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const roleCode = String(formData.get("role_code") ?? "").trim();
  const isActive = formData.get("is_active") === "on";
  const avatarFile = formData.get("avatar_file") as File | null;

  if (!userId) {
    throw new Error("Usuário inválido.");
  }

  if (!assignableRoles.has(roleCode)) {
    throw new Error("Role inválida.");
  }

  if (roleCode === "super_admin") {
    const { data: roleRows } = await adminClient
      .from("user_roles")
      .select("roles(code)")
      .eq("user_id", user.id);

    const currentRoleCodes = (roleRows ?? [])
      .map((row) => (row as { roles?: { code?: string } | null }).roles?.code)
      .filter((code): code is string => Boolean(code));

    if (!currentRoleCodes.includes("super_admin")) {
      throw new Error("Apenas super_admin pode conceder super_admin.");
    }
  }

  // Upload do avatar para o Supabase Storage se um arquivo foi enviado
  let avatarUrl: string | null = null;

  if (avatarFile && avatarFile.size > 0) {
    const ext = avatarFile.name.split(".").pop() ?? "jpg";
    const path = `${userId}/avatar.${ext}`;
    const buffer = Buffer.from(await avatarFile.arrayBuffer());

    const { error: uploadError } = await adminClient.storage
      .from("avatars")
      .upload(path, buffer, {
        contentType: avatarFile.type,
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Erro ao enviar avatar: ${uploadError.message}`);
    }

    const { data: publicUrlData } = adminClient.storage
      .from("avatars")
      .getPublicUrl(path);

    avatarUrl = publicUrlData.publicUrl;
  } else {
    // Mantém o avatar já salvo
    const { data: existing } = await adminClient
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .maybeSingle();
    avatarUrl = existing?.avatar_url ?? null;
  }

  const { error: profileError } = await adminClient.from("profiles").upsert({
    id: userId,
    full_name: fullName || null,
    avatar_url: avatarUrl,
    phone: phone || null,
    is_active: isActive,
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { data: roleRow, error: roleError } = await adminClient
    .from("roles")
    .select("id, code")
    .eq("code", roleCode)
    .single();

  if (roleError || !roleRow) {
    throw new Error(roleError?.message ?? "Role não encontrada.");
  }

  const { error: deleteError } = await adminClient
    .from("user_roles")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const { error: insertError } = await adminClient.from("user_roles").insert({
    user_id: userId,
    role_id: roleRow.id,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  revalidatePath("/admin/usuarios");
  revalidatePath(`/admin/usuarios/${userId}/editar`);
}

