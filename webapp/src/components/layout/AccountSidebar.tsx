"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Database, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

// Sidebar/tab bar only appears on the logged-in "app" pages, not the public
// marketing pages (Home, About, Research, ...).
export const ACCOUNT_PATHS = ["/dashboard", "/request-data", "/settings"];

// Solid (not translucent) navy background — the tab bar/sidebar must never
// let page content show through, so this is a flat color, not a gradient.
const SURFACE_BG = "bg-[#0c1436]";

type NavItem =
  | { label: string; icon: typeof Database; href: string }
  | { label: string; icon: typeof Database; action: "logout" };

// "Home" here means the account area's home screen (the dashboard), not the
// public marketing homepage — this sidebar only ever appears once logged in.
// Profile editing lives on the Settings page, not as its own nav item.
const navItems: NavItem[] = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Request Data", icon: Database, href: "/request-data" },
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Logout", icon: LogOut, action: "logout" },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!user || !ACCOUNT_PATHS.includes(pathname)) return null;

  function confirmLogout() {
    logout();
    setConfirmOpen(false);
    router.push("/");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-18 z-30 hidden w-56 flex-col overflow-y-auto border-r border-white/10 md:flex",
          SURFACE_BG
        )}
      >
        <Link
          href="/settings"
          className="flex flex-col items-center gap-2.5 border-b border-white/10 px-4 py-6 text-center transition-colors hover:bg-white/5"
        >
          <span className="h-24 w-24 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
            <Avatar src={user.avatar} name={user.name} />
          </span>
          <span className="flex min-w-0 flex-col items-center">
            <span className="truncate text-xl font-bold text-white">
              {user.name.split(" ")[0]}
            </span>
            <span className="truncate text-xs text-white/50">{user.email}</span>
          </span>
        </Link>

        <nav className="flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => {
            const active = "href" in item && pathname === item.href;
            const classes = cn(
              "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-cespar-red/15 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            );
            if ("href" in item) {
              return (
                <Link key={item.label} href={item.href} className={classes}>
                  <item.icon className="h-4.5 w-4.5" />
                  {item.label}
                </Link>
              );
            }
            return (
              <button
                key={item.label}
                onClick={() => setConfirmOpen(true)}
                className={classes}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 md:hidden",
          SURFACE_BG
        )}
      >
        {navItems.map((item) => {
          const active = "href" in item && pathname === item.href;
          const classes = cn(
            "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
            active ? "text-cespar-red-light" : "text-white/50"
          );
          if ("href" in item) {
            return (
              <Link key={item.label} href={item.href} className={classes}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          }
          return (
            <button
              key={item.label}
              onClick={() => setConfirmOpen(true)}
              className={classes}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Confirm logout */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-navy-400/40 bg-gradient-to-br from-navy-500/90 to-navy-500/65 p-7 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-white">Log out?</h3>
            <p className="mt-2 text-sm text-white/60">
              You&apos;ll need to sign in again to access your dashboard.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={confirmLogout} className="flex-1">
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Reserves layout space for the sidebar/tab bar — wrap each account page's outer section in this. */
export function AccountPageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const active = user && ACCOUNT_PATHS.includes(pathname);

  return (
    <div className={cn(active && "pb-20 md:pb-0 md:pl-56")}>{children}</div>
  );
}

/** Hides its children on the account/app pages (where the sidebar already covers navigation). */
export function HideOnAccountPage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  if (user && ACCOUNT_PATHS.includes(pathname)) return null;
  return <>{children}</>;
}
