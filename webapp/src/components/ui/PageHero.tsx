import { Container } from "@/components/ui/Container";
import { StarField } from "@/components/ui/StarField";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-space-950 py-14 sm:py-18">
      <StarField className="pointer-events-none absolute inset-0 h-full w-full opacity-50" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 15% 0%, rgba(216,30,44,0.14), transparent 60%)",
        }}
      />
      <Container className="relative">
        <span className="label-mono inline-flex items-center gap-2 text-[11px] text-cespar-red-light">
          <span className="h-1.5 w-1.5 rounded-full bg-cespar-red" />
          {eyebrow}
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
