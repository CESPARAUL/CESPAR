import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { ResearchCard } from "@/components/research/ResearchCard";
import { completedResearch } from "@/data/content";

export const metadata: Metadata = { title: "Completed Research | CESPAR" };

export default function CompletedResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research Impact"
        title="Completed Research"
        description="Published research and dissertations produced using CESPAR's facilities and data — from the Centre's own researchers and the students and collaborators trained here."
      />
      <section className="bg-space-950 py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {completedResearch.map((research) => (
              <ResearchCard key={research.title} research={research} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
