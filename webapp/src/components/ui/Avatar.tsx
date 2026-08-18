import { cn } from "@/lib/utils";

export function Avatar({
  src,
  name,
  className,
  fallbackTextClassName = "text-3xl",
}: {
  src?: string | null;
  name: string;
  className?: string;
  /** Font size for the initials fallback — scale this to match the avatar's own size. */
  fallbackTextClassName?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- remote, runtime-configurable backend origin
    return (
      <img
        src={src}
        alt={name}
        className={cn("h-full w-full rounded-full object-cover", className)}
      />
    );
  }
  return (
    <span
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-navy-400 to-cespar-red font-semibold text-white",
        fallbackTextClassName,
        className
      )}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
