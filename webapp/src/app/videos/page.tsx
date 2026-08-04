import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { videos } from "@/data/content";
import { getYoutubeVideoId } from "@/lib/utils";

export const metadata: Metadata = { title: "Videos | CESPAR" };

export default function VideosPage() {
  return (
    <>
      <PageHero
        eyebrow="Videos"
        title="CESPAR on video"
        description="Facilities, research and people at the Centre for Space Research — in their own words."
      />

      <section className="bg-space-950 py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => {
              const videoId = getYoutubeVideoId(video.youtubeUrl);
              if (!videoId) return null;
              return (
                <div key={video.youtubeUrl}>
                  <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-xl shadow-black/30">
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-white">
                    {video.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
