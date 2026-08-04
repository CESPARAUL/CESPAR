import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { siteMeta } from "@/data/content";

export const metadata: Metadata = { title: "Contact | CESPAR" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's get in touch"
        description="Have a question about our research, data access, or a potential collaboration? Reach out."
      />
      <section className="bg-space-950 py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-cespar-red-light" />
              <div>
                <p className="text-sm font-medium text-white">Email</p>
                <a href={`mailto:${siteMeta.email}`} className="text-sm text-white/60 hover:text-white">
                  {siteMeta.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-cespar-red-light" />
              <div>
                <p className="text-sm font-medium text-white">Phone</p>
                <a href={`tel:${siteMeta.phone.replace(/[^\d+]/g, "")}`} className="text-sm text-white/60 hover:text-white">
                  {siteMeta.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-cespar-red-light" />
              <div>
                <p className="text-sm font-medium text-white">Hours</p>
                <p className="text-sm text-white/60">{siteMeta.hours}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-cespar-red-light" />
              <div>
                <p className="text-sm font-medium text-white">Address</p>
                <p className="text-sm text-white/60">{siteMeta.address}</p>
              </div>
            </div>
          </div>

          <form
            action={`mailto:${siteMeta.email}`}
            method="post"
            encType="text/plain"
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-7"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="firstName" className="text-sm font-medium text-white/80">First name</label>
                <input id="firstName" name="First name" required className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-cespar-red/60 focus:outline-none focus:ring-2 focus:ring-cespar-red/25" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lastName" className="text-sm font-medium text-white/80">Last name</label>
                <input id="lastName" name="Last name" required className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-cespar-red/60 focus:outline-none focus:ring-2 focus:ring-cespar-red/25" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-white/80">Email</label>
              <input id="email" type="email" name="Email" required className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-cespar-red/60 focus:outline-none focus:ring-2 focus:ring-cespar-red/25" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-medium text-white/80">Message</label>
              <textarea id="message" name="Message" required rows={5} className="w-full rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-cespar-red/60 focus:outline-none focus:ring-2 focus:ring-cespar-red/25" />
            </div>
            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-cespar-red px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-colors hover:bg-cespar-red-dark"
            >
              Send Message
            </button>
          </form>
        </Container>
      </section>
    </>
  );
}
