import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import {
  aboutCespar,
  aboutMilestones,
  aboutPower,
  aboutMemoriam,
  aboutAUL,
} from "@/data/content";

export const metadata: Metadata = { title: "About | CESPAR" };

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Advancing space science from Lagos, for the world"
      />

      <section id="cespar" className="scroll-mt-24 bg-space-950 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-white">
            {aboutCespar.title}
          </h2>
          <div className="mt-5 space-y-5">
            {aboutCespar.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-white/65">
                {p}
              </p>
            ))}
          </div>

          {aboutCespar.photo && (
            <figure className="mt-8 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] p-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                <Image
                  src={aboutCespar.photo.src}
                  alt={aboutCespar.photo.caption}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-1.5 pb-1 pt-3 text-xs leading-snug text-white/50">
                {aboutCespar.photo.caption}
              </figcaption>
            </figure>
          )}
        </Container>
      </section>

      <section
        id="milestones"
        className="scroll-mt-24 border-t border-white/10 bg-space-900 py-16 sm:py-20"
      >
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-white">
            {aboutMilestones.title}
          </h2>
          <div className="mt-5 space-y-5">
            {aboutMilestones.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-white/65">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {aboutMilestones.photos.map((photo) => (
              <figure
                key={photo.src}
                className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] p-2"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="px-1.5 pb-1 pt-3 text-xs leading-snug text-white/50">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section
        id="power"
        className="scroll-mt-24 border-t border-white/10 bg-space-950 py-16 sm:py-20"
      >
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-white">
            {aboutPower.title}
          </h2>
          <div className="mt-5 space-y-5">
            {aboutPower.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-white/65">
                {p}
              </p>
            ))}
          </div>

          <figure className="mt-8 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] p-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <Image
                src={aboutPower.heroPhoto.src}
                alt={aboutPower.heroPhoto.caption}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            <figcaption className="px-1.5 pb-1 pt-3 text-xs leading-snug text-white/50">
              {aboutPower.heroPhoto.caption}
            </figcaption>
          </figure>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {aboutPower.photos.map((photo) => (
              <figure
                key={photo.src}
                className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] p-2"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="px-1.5 pb-1 pt-3 text-xs leading-snug text-white/50">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section
        id="memoriam"
        className="scroll-mt-24 border-t border-white/10 bg-space-900 py-16 sm:py-20"
      >
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-white">
            {aboutMemoriam.title}
          </h2>

          <div className="mt-6 flex flex-col gap-8 sm:flex-row">
            <figure className="shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] p-2 sm:w-64">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                <Image
                  src={aboutMemoriam.photo.src}
                  alt={aboutMemoriam.photo.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, 256px"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-1.5 pb-1 pt-3 text-xs leading-snug text-white/50">
                {aboutMemoriam.photo.caption}
              </figcaption>
            </figure>

            <div className="space-y-5">
              {aboutMemoriam.paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-white/65">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <blockquote className="mt-8 border-l-2 border-cespar-red-light/50 pl-5 text-base italic leading-relaxed text-white/70">
            &ldquo;{aboutMemoriam.tribute.quote}&rdquo;
            <footer className="mt-2 text-sm not-italic text-white/50">
              — {aboutMemoriam.tribute.attribution}
            </footer>
          </blockquote>
        </Container>
      </section>

      <section id="aul" className="scroll-mt-24 border-t border-white/10 bg-space-950 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-white">
            {aboutAUL.title}
          </h2>
          <div className="mt-5 space-y-5">
            {aboutAUL.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-white/65">
                {p}
              </p>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
