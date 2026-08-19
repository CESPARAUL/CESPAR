import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import type { ResearchContributor } from "@/data/content";

export function ContributorAvatars({
  contributors,
  max = 3,
  size = "h-9 w-9",
  ringClassName = "ring-space-900",
}: {
  contributors: ResearchContributor[];
  max?: number;
  size?: string;
  ringClassName?: string;
}) {
  const shown = contributors.slice(0, max);
  const remaining = contributors.length - shown.length;

  return (
    <div className="flex items-center">
      {shown.map((contributor, i) => (
        <div
          key={contributor.name + i}
          title={contributor.name}
          className={cn(
            size,
            "relative shrink-0 overflow-hidden rounded-full ring-2",
            ringClassName,
            i > 0 && "-ml-2.5"
          )}
          style={{ zIndex: shown.length - i }}
        >
          <Avatar
            src={contributor.photo}
            name={contributor.name}
            fallbackTextClassName="text-xs"
          />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            size,
            "relative -ml-2.5 flex shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white/80 ring-2",
            ringClassName
          )}
          style={{ zIndex: 0 }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
