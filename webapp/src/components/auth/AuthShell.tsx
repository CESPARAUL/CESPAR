import { StarField } from "@/components/ui/StarField";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-[calc(100vh-4.5rem)] items-center overflow-hidden bg-space-950 py-16">
      <StarField className="pointer-events-none absolute inset-0 h-full w-full" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, rgba(36,57,154,0.25), transparent 60%)",
        }}
      />
      <Container className="relative flex justify-center">
        <div className="w-full max-w-md rounded-2xl border border-navy-400/40 bg-gradient-to-br from-navy-500/85 to-navy-500/55 p-8 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-9">
          <div className="flex flex-col items-center text-center">
            <Logo large className="flex-col items-center gap-2 text-center" />
            <h1 className="mt-4 font-display text-2xl font-bold text-white">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-white/55">{subtitle}</p>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </Container>
    </section>
  );
}
