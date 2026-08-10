"use client";

import { Navigation } from "lucide-react";

interface MapEmbedProps {
  address: string;
  establishmentName: string;
}

export function MapEmbed({ address, establishmentName }: MapEmbedProps) {
  const encodedAddress = encodeURIComponent(address);
  const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  return (
    <article className="rounded-[28px] border border-outline/20 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
        <h2 className="font-serif text-2xl">Localização</h2>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[rgb(148_53_21)] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[rgb(128_43_11)] shadow-sm"
        >
          <Navigation size={14} />
          Traçar Rota
        </a>
      </div>

      <p className="text-sm text-on-surface/65 mb-4">{address}</p>

      <div className="overflow-hidden rounded-2xl border border-outline/10">
        <iframe
          title={`Mapa de ${establishmentName}`}
          src={mapSrc}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        />
      </div>
    </article>
  );
}
