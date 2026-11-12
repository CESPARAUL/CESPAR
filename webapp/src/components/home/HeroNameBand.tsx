"use client";

import { useEffect, useState } from "react";
import { heroContent } from "@/data/content";

// The full name, in a dark translucent band at the top of the hero (inside
// its top padding, so it adds no height). It settles in once with a
// blur-and-tracking reveal, then a soft light sheen passes across it at
// random intervals - no scrolling, no obvious loop.
export function HeroNameBand() {
  const [sweep, setSweep] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = (first = false) => {
      const wait = (first ? 1500 : 3000) + Math.random() * 4000;
      timer = setTimeout(() => {
        setSweep((n) => n + 1);
        schedule();
      }, wait);
    };
    schedule(true);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-x-0 top-0 z-10 border-b border-white/10 bg-space-950/55 backdrop-blur-md">
      <p className="flex h-12 items-center justify-center px-4 sm:h-16">
        <span
          // Re-keying restarts the sheen animation on each random tick.
          key={sweep}
          className={`name-band-text font-display text-lg font-extrabold uppercase text-transparent sm:text-2xl lg:text-[1.75rem] ${
            sweep > 0 ? "name-band-sweep" : ""
          }`}
        >
          <span className="sr-only">CESPAR: </span>
          {heroContent.fullName}
          <span className="hidden font-light md:inline">
            <span aria-hidden className="mx-6 text-cespar-red-light/80 lg:mx-8">
              ✦
            </span>
            {heroContent.institution}
          </span>
        </span>
      </p>
    </div>
  );
}
