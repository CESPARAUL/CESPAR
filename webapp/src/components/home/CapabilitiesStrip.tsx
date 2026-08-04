import { Database, Radio, SatelliteDish, Telescope, Magnet } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { capabilities } from "@/data/content";

const icons = {
  archive: Database,
  radio: Radio,
  satellite: SatelliteDish,
  magnetometer: Magnet,
  exploration: Telescope,
} as const;

export function CapabilitiesStrip() {
  return (
    <section className="relative border-y border-white/10 bg-space-900/85 py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[100rem] px-5 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {capabilities.map((cap) => {
            const Icon = icons[cap.key as keyof typeof icons];
            return (
              <div
                key={cap.key}
                className="group rounded-2xl border border-navy-400/30 bg-gradient-to-br from-navy-500/35 to-navy-500/15 p-5 shadow-inner shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-cespar-red/40 hover:from-navy-500/45 hover:to-navy-500/20 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-400/60 to-cespar-red/40 text-white ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-display text-base font-bold leading-tight text-white sm:text-lg">
                    {cap.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
