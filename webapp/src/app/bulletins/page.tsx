"use client";

import { useEffect, useState } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { api } from "@/lib/api";
import type { Bulletin } from "@/types";

export default function BulletinsPage() {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ bulletins: Bulletin[] }>("/bulletins")
      .then((res) => setBulletins(res.bulletins))
      .catch(() => setError("Could not load bulletins right now."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Bulletins"
        title="Bulletins Published by CESPAR"
        description="Click a bulletin to open the full PDF."
      />
      <section className="bg-space-950 py-16 sm:py-20">
        <Container>
          {loading ? (
            <p className="text-center text-white/50">Loading bulletins…</p>
          ) : error ? (
            <p className="text-center text-white/50">{error}</p>
          ) : bulletins.length === 0 ? (
            <p className="text-center text-white/50">
              No bulletins published yet.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {bulletins.map((bulletin) => (
                <a
                  key={bulletin.id}
                  href={bulletin.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-cespar-red/40"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden border-b border-white/10 bg-white">
                    <iframe
                      src={`${bulletin.pdf}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                      className="pointer-events-none h-full w-full"
                      title={`${bulletin.title} preview`}
                      tabIndex={-1}
                    />
                    <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
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
                      {bulletin.date && (
                        <p className="mt-1 text-xs text-white/50">
                          {bulletin.date}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
