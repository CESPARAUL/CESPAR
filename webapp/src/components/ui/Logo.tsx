import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  light = false,
  large = false,
  className,
}: {
  light?: boolean;
  large?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center",
          large ? "h-14 w-14" : "h-10 w-10"
        )}
      >
        <Image
          src="/images/logo.png"
          alt="CESPAR logo"
          fill
          sizes={large ? "56px" : "40px"}
          className="object-contain"
          loading="eager"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-extrabold tracking-tight",
            large ? "text-2xl" : "text-xl",
            light ? "text-space-950" : "text-white"
          )}
        >
          CESPAR
        </span>
        <span
          className={cn(
            "label-mono mt-1 hidden tracking-[0.16em] sm:block",
            large ? "text-[9px]" : "text-[7.5px]",
            light ? "text-space-950/45" : "text-white/45"
          )}
        >
          Anchor University Lagos
        </span>
      </span>
    </span>
  );
}
