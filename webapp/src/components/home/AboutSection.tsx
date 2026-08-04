import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { aboutCespar } from "@/data/content";

export function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-space-950/90 py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 opacity-[0.07] sm:h-[520px] sm:w-[520px] lg:h-[620px] lg:w-[620px]"
      >
        <Image src="/images/logo.png" alt="" fill className="object-contain" />
      </div>
      <Container className="relative grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="About Us"
            title={aboutCespar.title}
            className="max-w-none"
          />
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cespar-red-light hover:text-cespar-red"
          >
            Read our full story
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-5 lg:col-span-7">
          {aboutCespar.paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-white/65">
              {p}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
