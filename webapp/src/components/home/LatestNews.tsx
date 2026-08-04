import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { latestNews, videos } from "@/data/content";
import { getYoutubeVideoId } from "@/lib/utils";

export function LatestNews() {
  const featured = videos[0];
  const videoId = getYoutubeVideoId(featured.youtubeUrl);

  return (
    <section className="relative border-y border-white/10 bg-space-900/85 py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={latestNews.eyebrow}
            title={featured.title}
            description={latestNews.description}
            className="max-w-none"
          />
          <Link
            href="/videos"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-cespar-red-light hover:text-cespar-red"
          >
            See more videos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/40">
          {videoId ? (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1`}
              title={featured.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : null}
        </div>
      </Container>
    </section>
  );
}
