import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { StarField } from "@/components/ui/StarField";
import { HeroSatelliteMonitor } from "@/components/home/HeroSatelliteMonitor";
import { HeroEarth } from "@/components/home/HeroEarth";
import { heroContent, capabilities } from "@/data/content";

const stats = [
  { value: `${capabilities.length}`, label: "Research Areas" },
  { value: "8+", label: "Years of Data" },
  { value: "24/7", label: "Uptime" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-space-950">
      {/* Drifting starfield, as though the viewpoint is moving through space. */}
      <StarField className="absolute inset-0 h-full w-full" density={2.2} />

      {/* Distant sun — a bright, strong glow in the upper-right, the main light
          source for the scene so the hero doesn't read as flatly dark. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(32% 38% at 94% 2%, rgba(255,255,255,0.95), transparent 38%), radial-gradient(46% 48% at 92% 4%, rgba(255,226,196,0.9), transparent 55%), radial-gradient(65% 60% at 88% 8%, rgba(246,144,111,0.55), transparent 70%)",
        }}
      />
      {/* Cool rim glow, lower-left, for depth/contrast against the sun. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 45% at 6% 100%, rgba(36,57,154,0.28), transparent 65%)",
        }}
      />

      {/* Left-to-right darkening, confined to the text column, so copy stays
          legible without flattening the brighter sun/satellite side. */}
      <div className="absolute inset-0 bg-gradient-to-r from-space-950 via-space-950/75 to-transparent sm:via-space-950/70" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-space-950" />

      {/* Earth, cropped in the bottom-left corner, distant and slowly
          rotating — rendered above the darkening overlay so it still reads. */}
      <HeroEarth />

      <div className="pointer-events-none absolute inset-0 bg-grid-space opacity-10 [mask-image:radial-gradient(ellipse_70%_60%_at_30%_0%,black,transparent)]" />

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
          <div>
            <span className="live-badge label-mono inline-flex items-center gap-2 rounded-full border border-cespar-red-light/40 bg-cespar-red/10 px-4 py-1.5 text-[11px]">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-cespar-red-light" />
              {heroContent.badge}
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
              {heroContent.headlineStart}{" "}
              <span className="font-accent italic font-normal text-ember">
                {heroContent.headlineAccent}
              </span>{" "}
              {heroContent.headlineEnd}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
              {heroContent.body}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href={heroContent.primaryCta.href}
                size="lg"
                className="w-full uppercase sm:w-auto"
              >
                {heroContent.primaryCta.label}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Link
                href={heroContent.secondaryCta.href}
                className="group inline-flex items-center justify-center gap-1.5 text-center text-sm font-semibold text-white/70 transition-colors hover:text-white sm:justify-start"
              >
                {heroContent.secondaryCta.label}
                <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8 sm:max-w-lg">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-2xl font-bold text-white sm:text-3xl">
                    {stat.value}
                  </dd>
                  <dd className="label-mono mt-1.5 text-[10px] text-white/45 sm:text-[11px]">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="aspect-[600/520] w-full">
            <HeroSatelliteMonitor />
          </div>
        </div>
      </Container>
    </section>
  );
}
