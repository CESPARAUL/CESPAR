import Image from "next/image";
import { FileText, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { bulletins } from "@/data/content";

// Static list (see `bulletins` in content.ts) with a cover image per PDF,
// rather than live PDF previews: those downloaded every PDF in full - 160 MB
// with the magazine - just to open this page.
export default function BulletinsPage() {
  return (
    <>
      <PageHero
        eyebrow="Bulletins"
        title="Bulletins Published by CESPAR"
        description="Click a bulletin to open the full PDF."
      />
      <section className="bg-space-950 py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {bulletins.map((bulletin) => (
              <a
                key={bulletin.pdf}
                href={bulletin.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/3 transition-colors hover:border-cespar-red/40"
              >
                <div className="relative aspect-3/4 w-full overflow-hidden border-b border-white/10 bg-white">
                  <Image
                    src={bulletin.cover}
                    alt={`${bulletin.title} cover`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end justify-end bg-linear-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-space-950">
                      <ExternalLink className="h-3.5 w-3.5" />
                      View PDF
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-cespar-red-light" />
                  <div>
                    <h3 className="font-display text-sm font-semibold leading-snug text-white">
                      {bulletin.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/50">
                      {bulletin.date} · PDF, {bulletin.size}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
