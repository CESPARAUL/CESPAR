import Image from "next/image";
import { FileText } from "lucide-react";
import { ContributorAvatars } from "@/components/research/ContributorAvatars";
import type { CompletedResearch } from "@/data/content";

export function ResearchCard({ research }: { research: CompletedResearch }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-cespar-red-light/40">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-space-800">
        {research.thumbnail ? (
          <Image
            src={research.thumbnail}
            alt={research.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-500 to-cespar-red">
            <FileText className="h-10 w-10 text-white/70" />
          </div>
        )}
        {research.featured && (
          <span className="label-mono absolute left-3 top-3 rounded-full bg-space-950/80 px-2.5 py-1 text-[10px] text-cespar-red-light ring-1 ring-white/15 backdrop-blur-sm">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-white/45">{research.authors}</p>
        <h3 className="mt-2 font-display text-base font-semibold leading-snug text-white">
          {research.title}
        </h3>
        <p className="mt-2 text-xs italic leading-relaxed text-white/45">
          {research.citation}
        </p>
        <div className="mt-4 pt-1">
          <ContributorAvatars
            contributors={research.contributors}
            size="h-8 w-8"
            ringClassName="ring-space-950"
          />
        </div>
      </div>
    </div>
  );
}
