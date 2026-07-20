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
  const storageKey = `menuzn:blog:viewed:${slug}`;

  useEffect(() => {
    if (hasTracked.current) {
      return;
    }

    try {
      if (window.localStorage.getItem(storageKey) === "1") {
        hasTracked.current = true;
        return;
      }
    } catch {
      // Ignore storage access issues and fall back to the network request.
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

          try {
            window.localStorage.setItem(storageKey, "1");
          } catch {
            // Ignore storage access issues after a successful count.
          }
        }
      })
      .catch((error) => {
        console.error("Falha ao registrar visualização", error);
      });
  }, [slug, storageKey]);

  return (
    <span className={`inline-flex items-center gap-1.5 ${className ?? ""}`}>
      <Eye size={14} aria-hidden="true" />
      {formatViewCount(viewCount)}
    </span>
  );
}
