"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { primaryNav } from "@/data/content";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-black/[0.06] bg-white/95 backdrop-blur-md",
        open && "border-black/10"
      )}
    >
      <Container className="flex h-18 items-center justify-between py-3">
        <Link href="/" className="group">
          <Logo light large />
        </Link>

        <nav className="hidden lg:flex lg:items-center lg:gap-1">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative px-4 py-2 text-sm font-medium text-space-950/65 transition-colors hover:text-space-950"
            >
              {item.label}
              <span className="pointer-events-none absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-cespar-red transition-transform duration-200 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/donate"
            className="inline-flex items-center gap-1.5 rounded-full border border-cespar-red/40 px-4 py-2.5 text-sm font-semibold text-cespar-red transition-colors hover:border-transparent hover:bg-cespar-red hover:text-white"
          >
            <Heart className="h-4 w-4" />
            Donate
          </Link>
          {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-space-950/65 transition-colors hover:bg-black/[0.04] hover:text-space-950"
              >
                <span className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
                  <Avatar src={user.avatar} name={user.name} fallbackTextClassName="text-sm" />
                </span>
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-full border border-cespar-red/40 px-4 py-2.5 text-sm font-medium text-cespar-red transition-colors hover:border-transparent hover:bg-cespar-red hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2.5 text-sm font-medium text-space-950/65 transition-colors hover:bg-black/[0.04] hover:text-space-950"
              >
                Log in
              </Link>
              <Button href="/request-data" variant="primary" size="md" className="uppercase">
                Request Data
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-space-950 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-black/[0.06] bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-5">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-space-950/80 hover:bg-black/[0.04]"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2.5 border-t border-black/[0.06] pt-4">
              <Link
                href="/donate"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-cespar-red/40 px-4 py-3 text-center text-sm font-semibold text-cespar-red"
              >
                <Heart className="h-4 w-4" />
                Donate
              </Link>
              {!loading && user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-black/10 px-4 py-3 text-center text-sm font-semibold text-space-950/80"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="rounded-full px-4 py-3 text-center text-sm font-semibold text-space-950/50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-black/10 px-4 py-3 text-center text-sm font-semibold text-space-950/80"
                  >
                    Log in
                  </Link>
                  <Button href="/request-data" variant="primary" size="lg" className="uppercase">
                    Request Data
                  </Button>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
