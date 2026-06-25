import Link from "next/link";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

type SortableHeaderProps = {
  label: string;
  column: string;
  currentSort: string;
  currentDir: string;
  baseUrl: string;
  /** Extra query params to preserve (e.g. q, status, category) */
  extraParams?: Record<string, string>;
};

export function SortableHeader({
  label,
  column,
  currentSort,
  currentDir,
  baseUrl,
  extraParams = {},
}: SortableHeaderProps) {
  const isActive = currentSort === column;
  const nextDir = isActive && currentDir === "asc" ? "desc" : "asc";

  const params = new URLSearchParams({
    ...extraParams,
    sort: column,
    dir: nextDir,
  });

  return (
    <th className="px-4 py-3 text-left font-medium">
      <Link
        href={`${baseUrl}?${params.toString()}`}
        className="group inline-flex items-center gap-1.5 hover:text-on-surface transition-colors"
      >
        {label}
        <span className="text-on-surface/30 group-hover:text-on-surface/60 transition-colors">
          {isActive ? (
            currentDir === "asc" ? (
              <ChevronUp size={14} className="text-primary" />
            ) : (
              <ChevronDown size={14} className="text-primary" />
            )
          ) : (
            <ChevronsUpDown size={14} />
          )}
        </span>
      </Link>
    </th>
  );
}
