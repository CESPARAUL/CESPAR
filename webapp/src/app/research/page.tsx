import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { researchResources } from "@/data/content";

export const metadata: Metadata = { title: "Research | CESPAR" };

export default function ResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research"
        title={researchResources.title}
        description={researchResources.intro}
      />
      <section className="bg-space-950 py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2">
            {researchResources.items.map((item) => (
              <div
                key={item.title}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-500/40 text-white ring-1 ring-white/10">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                Want to collaborate or access our data?
              </h3>
              <p className="mt-1 text-sm text-white/55">
                Submit a request and our research team will follow up.
              </p>
            </div>
            <Button href="/request-data" size="lg" className="shrink-0">
              Request Data
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
