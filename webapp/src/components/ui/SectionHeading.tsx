import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="label-mono inline-flex items-center gap-2 text-[11px] text-cespar-red-light">
          <span className="h-1.5 w-1.5 rounded-full bg-cespar-red" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl",
          light ? "text-white" : "text-white"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-white/65">
          {description}
        </p>
      )}
    </div>
  );
}
