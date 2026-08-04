import { StarField } from "@/components/ui/StarField";

/**
 * Fixed, viewport-pinned starfield that sits behind every homepage section.
 * Sections use semi-transparent dark backgrounds so the drifting stars stay
 * visible as the page scrolls, reading as continuous movement through space
 * rather than a hero-only effect.
 */
export function CosmicBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-space-950">
      <StarField className="absolute inset-0 h-full w-full" density={1.8} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 85% 0%, rgba(216,30,44,0.12), transparent 60%), radial-gradient(45% 40% at 5% 25%, rgba(36,57,154,0.2), transparent 60%)",
        }}
      />
    </div>
  );
}
