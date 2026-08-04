import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { researchResources } from "@/data/content";

export function ResearchResources() {
  return (
    <section className="bg-space-950/90 py-20 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Research With Us"
            title={researchResources.title}
            description={researchResources.intro}
            className="max-w-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {researchResources.items.map((item) => (
            <div
              key={item.title}
              className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-500/40 text-white ring-1 ring-white/10">
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="font-display text-sm font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-white/55">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
