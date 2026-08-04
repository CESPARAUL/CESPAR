import {
  ClipboardList,
  UserPlus,
  ShieldCheck,
  DownloadCloud,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const steps = [
  {
    icon: ClipboardList,
    title: "Browse the catalogue",
    description:
      "Explore dataset metadata — coverage, format and instrumentation — with no account required.",
  },
  {
    icon: UserPlus,
    title: "Create a free account",
    description:
      "Register with your name, email and institution to submit a data request.",
  },
  {
    icon: ShieldCheck,
    title: "Get admin approval",
    description:
      "Our team reviews each request and approves access based on research purpose.",
  },
  {
    icon: DownloadCloud,
    title: "Download your dataset",
    description:
      "Once approved, track the request from your dashboard and download the data.",
  },
];

export function DataRequestCTA() {
  return (
    <section
      id="request-data"
      className="relative overflow-hidden bg-space-900/85 py-20 sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 60% at 90% 10%, rgba(216,30,44,0.14), transparent 60%)",
        }}
      />
      <Container className="relative">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Available Space Data"
            title="Request Space data for research"
            description="We're building a regional database for atmospheric and space science. Metadata is open to everyone; full datasets are released to registered researchers through a simple approval workflow."
            className="max-w-xl"
          />
          <Button href="/request-data" size="lg" className="shrink-0">
            Request Research Data
          </Button>
        </div>

        <div className="relative mt-16">
          {/* Connecting track linking the numbered nodes into one flow. */}
          <div className="pointer-events-none absolute inset-x-6 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-cespar-red/0 via-cespar-red/50 to-cespar-red/0 lg:block" />
          {[25, 50, 75].map((pct, idx) => (
            <ArrowRight
              key={pct}
              className="pointer-events-none absolute top-1/2 z-10 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-cespar-red-light lg:block"
              style={{
                left: `${pct}%`,
                animation: `flow-arrow 1.8s ease-in-out ${idx * 0.3}s infinite`,
              }}
            />
          ))}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-navy-400/35 bg-gradient-to-br from-navy-500/70 to-navy-500/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cespar-red-light/40"
              >
                <span className="absolute -top-3 left-6 flex h-6 w-6 items-center justify-center rounded-full bg-cespar-red text-xs font-bold text-white ring-4 ring-space-900">
                  {i + 1}
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-400/60 to-navy-500/50 ring-1 ring-white/15">
                    <step.icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
