"use client";

import { useEffect, useMemo, useRef } from "react";

export type Advertisement = {
  id: string;
  title: string;
  image_url: string;
  target_url: string;
};

type Props = {
  advertisements: Advertisement[];
  placement?: "article" | "hero";
};

export function AdCarousel({ advertisements, placement = "article" }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pausedByPointerRef = useRef(false);
  const pausedByFocusRef = useRef(false);
  const pausedByVisibilityRef = useRef(false);
  const isInViewportRef = useRef(true);
  const loopedAdvertisements = useMemo(() => {
    const clone = advertisements.length > 1
      ? advertisements.slice(0, 1).map((advertisement) => ({
          ...advertisement,
          id: `${advertisement.id}-loop`,
        }))
      : [];

    return [
      ...advertisements,
      ...clone,
    ];
  }, [advertisements]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = viewport?.firstElementChild;

    if (!(viewport instanceof HTMLDivElement) || !(track instanceof HTMLDivElement)) {
      return;
    }

    const firstSlide = track.firstElementChild;
    if (!(firstSlide instanceof HTMLElement)) {
      return;
    }

    let position = 0;
    let resetTimeout: number | undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let step = 0;
    const measureStep = () => {
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      step = firstSlide.getBoundingClientRect().width + gap;
      viewport.scrollLeft = 0;
      position = 0;
    };
    measureStep();

    if (advertisements.length <= 1) {
      return;
    }

    const resizeObserver = new ResizeObserver(measureStep);
    resizeObserver.observe(viewport);
    resizeObserver.observe(firstSlide);

    isInViewportRef.current = true;
    pausedByVisibilityRef.current = document.hidden;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isInViewportRef.current = entry.isIntersecting;
      pausedByVisibilityRef.current =
        document.hidden || !isInViewportRef.current;
    });
    visibilityObserver.observe(viewport);

    const updateVisibility = () => {
      pausedByVisibilityRef.current =
        document.hidden || !isInViewportRef.current;
    };
    document.addEventListener("visibilitychange", updateVisibility);

    const interval = window.setInterval(() => {
      if (
        pausedByPointerRef.current ||
        pausedByFocusRef.current ||
        pausedByVisibilityRef.current ||
        step <= 0
      ) {
        return;
      }

      viewport.scrollBy({
        left: step,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
      position += 1;

      if (position === advertisements.length) {
        resetTimeout = window.setTimeout(() => {
          viewport.scrollLeft = 0;
          position = 0;
        }, reducedMotion.matches ? 0 : 800);
      }
    }, 15000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(resetTimeout);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [advertisements.length]);

  if (advertisements.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Anúncios dos parceiros"
      aria-roledescription="carrossel"
      role="region"
      className={`blog-ad-carousel mx-auto w-full ${
        placement === "hero" ? "mb-8 mt-0" : "my-14 md:my-20"
      }`}
      onPointerEnter={() => {
        pausedByPointerRef.current = true;
      }}
      onPointerLeave={() => {
        pausedByPointerRef.current = false;
      }}
      onFocusCapture={() => {
        pausedByFocusRef.current = true;
      }}
      onBlurCapture={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          pausedByFocusRef.current = false;
        }
      }}
    >
      <div
        ref={viewportRef}
        className="blog-ad-carousel__viewport mx-auto"
        tabIndex={advertisements.length > 1 ? 0 : undefined}
      >
        <div className="blog-ad-carousel__track">
          {loopedAdvertisements.map((advertisement, index) => {
            const isClone = index >= advertisements.length;

            return (
              <a
                key={advertisement.id}
                href={advertisement.target_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${advertisement.title || "Publicidade"} — abre em nova aba`}
                aria-hidden={isClone}
                tabIndex={isClone ? -1 : undefined}
                className="blog-ad-carousel__card group relative flex shrink-0 items-end overflow-hidden rounded-2xl text-white shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white"
                data-carousel-slide
              >
                <span
                  aria-hidden="true"
                  className="blog-ad-carousel__image absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.04]"
                  style={{ backgroundImage: `url("${advertisement.image_url}")` }}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                />
                <span className="absolute right-4 top-4 rounded-full bg-black/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                  Publicidade
                </span>
                <span className="relative z-10 line-clamp-2 px-5 pb-5 pt-14 font-serif text-sm sm:text-2xl leading-tight text-white drop-shadow-sm">
                  {advertisement.title}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
