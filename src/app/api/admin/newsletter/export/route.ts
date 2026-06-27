import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Generates an XLS (HTML-table-based spreadsheet) file for newsletter subscribers.
 * This format is universally supported by Excel, LibreOffice, and Google Sheets.
 */
export async function GET() {
  const supabase = await createClient();

  // Verify the user is authenticated and has admin access
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data: roleRows } = await supabase
    .from("user_roles")
    .select("roles(code)")
    .eq("user_id", user.id);

  const allowedRoles = new Set(["super_admin", "admin", "editor"]);
  const roleCodes = (roleRows ?? [])
    .map((row) => (row as { roles?: { code?: string } | null }).roles?.code)
    .filter((code): code is string => Boolean(code));

  const hasAccess = roleCodes.some((code) => allowedRoles.has(code));

  if (!hasAccess) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  // Fetch all subscribers
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Erro ao buscar inscritos" },
      { status: 500 }
    );
  }

  const subscribers = data ?? [];

  // Build an HTML table that Excel/LibreOffice/Google Sheets can open as XLS
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  let html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8">
<!--[if gte mso 9]>
<xml>
<x:ExcelWorkbook>
<x:ExcelWorksheets>
<x:ExcelWorksheet>
<x:Name>Newsletter</x:Name>
<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
</x:ExcelWorksheet>
</x:ExcelWorksheets>
</x:ExcelWorkbook>
</xml>
<![endif]-->
<style>
  td, th { mso-number-format:"\\@"; }
</style>
</head>
<body>
<table border="1">
  <thead>
    <tr>
      <th style="background-color:#f0f0f0;font-weight:bold;padding:8px">#</th>
      <th style="background-color:#f0f0f0;font-weight:bold;padding:8px">E-mail</th>
      <th style="background-color:#f0f0f0;font-weight:bold;padding:8px">Data de Inscrição</th>
    </tr>
  </thead>
  <tbody>`;

  subscribers.forEach((sub, i) => {
    html += `
    <tr>
      <td style="padding:4px">${i + 1}</td>
      <td style="padding:4px">${sub.email}</td>
      <td style="padding:4px">${formatDate(sub.created_at)}</td>
    </tr>`;
  });

  html += `
  </tbody>
</table>
</body>
</html>`;

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");

  return new NextResponse(html, {
    headers: {
      "Content-Type": "application/vnd.ms-excel",
      "Content-Disposition": `attachment; filename="newsletter_inscritos_${dateStr}.xls"`,
    },
  });
}
