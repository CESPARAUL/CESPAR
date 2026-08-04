import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { team } from "@/data/content";

export const metadata: Metadata = { title: "Our Team | CESPAR" };

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

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Team"
        title="Scientists, engineers and technologists"
        description="The researchers and technical staff behind CESPAR's ground-based facilities and ongoing publications."
      />
      <section className="bg-space-950 py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {team.map((member) => (
              <div
                key={member.name}
                className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] p-2.5"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white/5">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                      className="object-cover"
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
    </>
  );
}
