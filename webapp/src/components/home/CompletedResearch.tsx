import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContributorAvatars } from "@/components/research/ContributorAvatars";
import { completedResearch } from "@/data/content";

export function CompletedResearch() {
  const featured = completedResearch.find((r) => r.featured) ?? completedResearch[0];

  return (
    <section className="bg-space-950/90 py-20 sm:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Research Impact"
            title="Completed Research"
            description="Published research and dissertations produced using CESPAR's facilities and data."
            className="max-w-none"
          />
          <Link
            href="/research/completed"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-cespar-red-light hover:text-cespar-red"
          >
            See all completed research
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] lg:grid-cols-2">
          <div className="relative aspect-video w-full lg:aspect-auto">
            {featured.thumbnail ? (
              <Image
                src={featured.thumbnail}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[220px] w-full items-center justify-center bg-gradient-to-br from-navy-500 to-cespar-red">
                <FileText className="h-12 w-12 text-white/70" />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-medium text-white/50">{featured.authors}</p>
            <h3 className="mt-2 font-display text-xl font-bold leading-snug text-white sm:text-2xl">
              {featured.title}
            </h3>
            <p className="mt-3 text-sm italic text-white/50">{featured.citation}</p>
            <div className="mt-6">
              <ContributorAvatars contributors={featured.contributors} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
