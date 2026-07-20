import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const allowedAdminRoles = new Set(["super_admin", "admin", "editor"]);
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const maxFileSize = 5 * 1024 * 1024;

function safeFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "imagem";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Usu?rio n?o autenticado." }, { status: 401 });
  }

  const { data: roleRows, error: rolesError } = await supabase
    .from("user_roles")
    .select("roles(code)")
    .eq("user_id", user.id);

  if (rolesError) {
    return Response.json({ error: "N?o foi poss?vel validar seu acesso." }, { status: 500 });
  }

  const hasAccess = (roleRows ?? []).some((row) => {
    const code = (row as { roles?: { code?: string } | null }).roles?.code;
    return Boolean(code && allowedAdminRoles.has(code));
  });

  if (!hasAccess) {
    return Response.json({ error: "Acesso negado." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    return Response.json({ error: "Selecione uma imagem." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return Response.json({ error: "Formato inv?lido. Use JPG, PNG, WebP, GIF ou AVIF." }, { status: 400 });
  }

  if (file.size > maxFileSize) {
    return Response.json({ error: "A imagem deve ter no m?ximo 5 MB." }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || file.type.split("/").pop() || "jpg";
  const path = `blog-posts/content/${Date.now()}-${crypto.randomUUID()}-${safeFileName(file.name)}.${extension}`;
  const adminClient = createAdminClient();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media-public";
  const { error: uploadError } = await adminClient.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    return Response.json({ error: `Falha no upload: ${uploadError.message}` }, { status: 500 });
  }

  const { data } = adminClient.storage.from(bucket).getPublicUrl(path);
  return Response.json({ url: data.publicUrl });
}
