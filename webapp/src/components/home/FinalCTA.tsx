import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-space-900/85 py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(216,30,44,0.16), rgba(36,57,154,0.22))",
        }}
      />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl font-display text-2xl font-bold text-white sm:text-3xl">
          Let&apos;s get in touch. Collaborate with CESPAR on your next research project.
        </h2>
        <p className="max-w-xl text-sm text-white/60 sm:text-base">
          Whether you need atmospheric data, want to explore a partnership, or
          are simply curious about our work — we&apos;d love to hear from you.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/contact" size="lg">Contact Us</Button>
          <Button href="/request-data" variant="secondary" size="lg">
            Request Data
          </Button>
        </div>
      </Container>
    </section>
  );
}
