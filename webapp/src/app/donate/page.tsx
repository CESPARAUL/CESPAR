import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { BankTransferCard } from "@/components/donate/BankTransferCard";
import { ImpactList } from "@/components/donate/ImpactList";
import { donationInfo } from "@/data/content";

export const metadata: Metadata = { title: "Donate | CESPAR" };

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Support Our Work"
        title="Donate to CESPAR"
        description={donationInfo.intro}
      />
      <section className="bg-space-950 py-16 sm:py-20">
        <Container className="max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <BankTransferCard />
            <ImpactList />
          </div>
        </Container>
      </section>
    </>
  );
}
