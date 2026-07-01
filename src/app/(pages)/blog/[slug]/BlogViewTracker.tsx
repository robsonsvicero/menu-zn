"use client";

import { Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatViewCount } from "@/lib/blog-format";

type BlogViewTrackerProps = {
  slug: string;
  initialViewCount: number | null;
  className?: string;
};

export function BlogViewTracker({
  slug,
  initialViewCount,
  className,
}: BlogViewTrackerProps) {
  const [viewCount, setViewCount] = useState(initialViewCount ?? 0);
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) {
      return;
    }

    hasTracked.current = true;

    fetch("/api/blog/views", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { view_count?: number } | null) => {
        if (typeof data?.view_count === "number") {
          setViewCount(data.view_count);
        }
      })
      .catch((error) => {
        console.error("Falha ao registrar visualização", error);
      });
  }, [slug]);

  return (
    <span className={`inline-flex items-center gap-1.5 ${className ?? ""}`}>
      <Eye size={14} aria-hidden="true" />
      {formatViewCount(viewCount)}
    </span>
  );
}
