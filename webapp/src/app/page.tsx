import { CosmicBackground } from "@/components/home/CosmicBackground";
import { Hero } from "@/components/home/Hero";
import { CapabilitiesStrip } from "@/components/home/CapabilitiesStrip";
import { AboutSection } from "@/components/home/AboutSection";
import { LatestNews } from "@/components/home/LatestNews";
import { DataRequestCTA } from "@/components/home/DataRequestCTA";
import { TeamPreview } from "@/components/home/TeamPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <CosmicBackground />
      <div className="relative z-10">
        <Hero />
        <CapabilitiesStrip />
        <AboutSection />
        <LatestNews />
        <DataRequestCTA />
        <TeamPreview />
        <Testimonials />
        <FinalCTA />
      </div>
    </>
  );
}
