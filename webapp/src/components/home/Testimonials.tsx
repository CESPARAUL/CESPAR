"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/content";

const SPEED_PX_PER_SEC = 38;
const RESUME_DELAY_MS = 900;

export function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame: number;
    let last = 0;
    let inView = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(el);

    function step(time: number) {
      if (!last) last = time;
      const dt = Math.min((time - last) / 1000, 0.1);
      last = time;

      if (!pausedRef.current && inView && el!.scrollWidth > el!.clientWidth) {
        const halfWidth = el!.scrollWidth / 2;
        el!.scrollLeft += SPEED_PX_PER_SEC * dt;
        if (el!.scrollLeft >= halfWidth) {
          el!.scrollLeft -= halfWidth;
        }
      }
      frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  function pause() {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }
  function scheduleResume() {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY_MS);
  }

  const looped = [...testimonials, ...testimonials];

  return (
    <section className="relative border-y border-white/10 bg-space-900/85 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="What Others Are Saying"
          align="center"
          className="mx-auto"
        />

        <div
          ref={scrollerRef}
          onMouseEnter={pause}
          onMouseLeave={scheduleResume}
          onTouchStart={pause}
          onTouchEnd={scheduleResume}
          onWheel={(e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
              pause();
              scheduleResume();
            }
          }}
          className="no-scrollbar mt-12 flex overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
        >
          <div className="flex gap-6 pb-1 pr-6">
            {looped.map((t, i) => (
              <figure
                key={`${t.name}-${i}`}
                className="flex w-[320px] shrink-0 flex-col justify-between gap-6 rounded-2xl border border-navy-400/30 bg-gradient-to-br from-navy-500/35 to-navy-500/15 p-6 sm:w-[380px] sm:p-7"
              >
                <div>
                  <h3 className="font-display text-lg font-bold text-cespar-red-light">
                    {t.heading}
                  </h3>
                  <blockquote className="mt-3 text-lg italic leading-relaxed text-white/80">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
                <div className="flex items-center gap-3 border-t border-white/10 pt-5">
                  {t.photo && (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10">
                      <Image
                        src={t.photo}
                        alt={t.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-white">
                      {t.name}
                    </div>
                    <div className="text-sm text-white/50">{t.role}</div>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
