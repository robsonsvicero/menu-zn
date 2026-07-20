"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Facebook01Icon,
  InstagramIcon,
  Link01Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";

type BlogShareBarProps = {
  title: string;
  url: string;
};

export function BlogShareBar({ title, url }: BlogShareBarProps) {
  const [copied, setCopied] = useState(false);
  const shareText = `${title} | Menu Zona Norte`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function shareOnInstagram() {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    await copyLink();
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  }

  const iconClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <section
      aria-labelledby="share-post-title"
      className="mt-12 flex flex-col gap-4 rounded-xl bg-[#292929] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <h2
        id="share-post-title"
        className="font-sans text-sm font-extrabold uppercase tracking-[-0.01em] text-white sm:text-base"
      >
        Compartilhe em suas redes
      </h2>

      <div className="flex items-center gap-1 sm:gap-2">
        <a
          href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Compartilhar no WhatsApp"
          title="Compartilhar no WhatsApp"
          className={iconClass}
        >
          <HugeiconsIcon icon={WhatsappIcon} size={23} strokeWidth={1.8} />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Compartilhar no Facebook"
          title="Compartilhar no Facebook"
          className={iconClass}
        >
          <HugeiconsIcon icon={Facebook01Icon} size={22} strokeWidth={1.8} />
        </a>
        <button
          type="button"
          onClick={shareOnInstagram}
          aria-label="Compartilhar no Instagram"
          title="Compartilhar no Instagram"
          className={iconClass}
        >
          <HugeiconsIcon icon={InstagramIcon} size={22} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          onClick={copyLink}
          aria-label={copied ? "Link copiado" : "Copiar link do post"}
          title={copied ? "Link copiado" : "Copiar link"}
          className={iconClass}
        >
          <HugeiconsIcon icon={Link01Icon} size={23} strokeWidth={1.8} />
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? "Link copiado para a área de transferência." : ""}
        </span>
      </div>
    </section>
  );
}
