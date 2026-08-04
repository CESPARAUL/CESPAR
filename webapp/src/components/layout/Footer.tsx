import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { siteMeta, footerQuickLinks } from "@/data/content";

export function Footer() {
  return (
    <footer className="relative border-t border-navy-400/40 bg-gradient-to-br from-navy-500/90 to-navy-500/65">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            {siteMeta.description}
          </p>
        </div>

        <div>
          <h3 className="label-mono text-[11px] font-semibold text-white/80">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5">
            {footerQuickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/55 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label-mono text-[11px] font-semibold text-white/80">
            Get In Touch
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/55">
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cespar-red-light" />
              <a href={`mailto:${siteMeta.email}`} className="hover:text-white">
                {siteMeta.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-cespar-red-light" />
              <a href={`tel:${siteMeta.phone.replace(/[^\d+]/g, "")}`} className="hover:text-white">
                {siteMeta.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cespar-red-light" />
              <span>{siteMeta.hours}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="label-mono text-[11px] font-semibold text-white/80">
            Centre Address
          </h3>
          <p className="mt-4 flex gap-2.5 text-sm leading-relaxed text-white/55">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cespar-red-light" />
            {siteMeta.address}
          </p>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteMeta.fullName}, {siteMeta.institution}. All rights reserved.
          </p>
          <p>Built for open research data access.</p>
        </Container>
      </div>
    </footer>
  );
}
