import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { team } from "@/data/content";

function initials(name: string) {
  const cleaned = name.replace(/^(Dr\.|Mr\.|Mrs\.|Prof\.|Engr\.|Late)\s+/i, "");
  return cleaned
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TeamPreview() {
  const featured = team.slice(0, 5);

  return (
    <section className="bg-space-900/85 py-20 sm:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Team" title="Meet Our Team" className="max-w-none" />
          <Link
            href="/team"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-cespar-red-light hover:text-cespar-red"
          >
            See all team members
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {featured.map((member) => (
            <div
              key={member.name}
              className="group overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] p-2.5 transition-colors duration-300 hover:border-cespar-red-light/50"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white/5">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-500 to-cespar-red text-4xl font-bold text-white">
                    {initials(member.name)}
                  </div>
                )}
              </div>
              <div className="px-1.5 pb-1 pt-3">
                <h3 className="text-sm font-bold leading-snug text-white sm:text-base">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs leading-snug text-white/50">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
