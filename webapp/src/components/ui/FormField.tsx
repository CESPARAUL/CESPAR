import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function FormField({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-white/80">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-white/40">{hint}</p>}
    </div>
  );
}

/** Wraps an input with a leading icon — pair with `inputClasses` (which reserves the left padding). */
export function InputIcon({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-space-950/40" />
      {children}
    </div>
  );
}

export const inputClasses = cn(
  "w-full rounded-lg border border-transparent bg-white px-3.5 py-2.5 text-sm text-space-950 placeholder:text-space-950/35",
  "focus:border-cespar-red/60 focus:outline-none focus:ring-2 focus:ring-cespar-red/30",
  "transition-colors"
);

/** Use with `InputIcon` — reserves left padding for the icon. */
export const inputWithIconClasses = cn(inputClasses, "pl-10");
