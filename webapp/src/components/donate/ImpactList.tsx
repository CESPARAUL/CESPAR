import { Award, Globe, GraduationCap, Radio, Rocket } from "lucide-react";
import { donationInfo } from "@/data/content";

const icons = {
  radio: Radio,
  graduation: GraduationCap,
  globe: Globe,
  award: Award,
  rocket: Rocket,
} as const;

export function ImpactList() {
  return (
    <div className="mb-10">
      <h2 className="label-mono text-[11px] text-cespar-red-light">
        Your Donation Enables
      </h2>
      <div className="mt-5 space-y-4">
        {donationInfo.impact.map((item) => {
          const Icon = icons[item.icon as keyof typeof icons];
          return (
            <div
              key={item.title}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-400/60 to-cespar-red/40 text-white ring-1 ring-white/15">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="font-display text-sm font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
