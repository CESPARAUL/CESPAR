import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { publications } from "@/data/content";

export const metadata: Metadata = { title: "Publications | CESPAR" };

export default function PublicationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Publications"
        title="Peer-Reviewed Research"
        description="A selection of papers published by CESPAR researchers in international journals and conferences."
      />
      <section className="bg-space-950 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <ul className="space-y-5">
            {publications.map((pub, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <FileText className="mt-1 h-5 w-5 shrink-0 text-cespar-red-light" />
                <div>
                  <p className="text-sm font-medium text-white/50">{pub.authors}</p>
                  <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-white">
                    {pub.title}
                  </h3>
                  <p className="mt-1.5 text-sm italic text-white/50">{pub.citation}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
