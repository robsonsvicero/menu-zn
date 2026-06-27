"use client";

import { Download } from "lucide-react";

export default function NewsletterExportButton() {
  const handleExport = async () => {
    try {
      const res = await fetch("/api/admin/newsletter/export");

      if (!res.ok) {
        throw new Error("Erro ao exportar");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
      a.download = `newsletter_inscritos_${dateStr}.xls`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erro ao exportar a listagem. Tente novamente.");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-[#222222] hover:bg-emerald-700 transition-colors"
    >
      <Download size={16} />
      Exportar XLS
    </button>
  );
}
