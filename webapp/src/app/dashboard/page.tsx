"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, CheckCircle2, XCircle, PackageCheck, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { StarField } from "@/components/ui/StarField";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { getPendingRequest } from "@/lib/utils";
import type { DataRequest, RequestStatus } from "@/types";

const statusConfig: Record<
  RequestStatus,
  { label: string; icon: typeof Clock; className: string }
> = {
  PENDING: { label: "Pending review", icon: Clock, className: "text-amber-400 bg-amber-400/10 border-amber-400/25" },
  APPROVED: { label: "Approved", icon: CheckCircle2, className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25" },
  REJECTED: { label: "Rejected", icon: XCircle, className: "text-cespar-red-light bg-cespar-red/10 border-cespar-red/25" },
  FULFILLED: { label: "Fulfilled", icon: PackageCheck, className: "text-navy-400 bg-navy-500/15 border-navy-400/30" },
};

export default function DashboardPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<DataRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [pending, setPending] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) setPending(getPendingRequest());
  }, [user]);

  useEffect(() => {
    if (!token) return;
    api
      .get<{ requests: DataRequest[] }>("/requests/me", token)
      .then((res) => setRequests(res.requests))
      .finally(() => setLoadingRequests(false));
  }, [token]);

  if (loading || !user) {
    return (
      <Container className="py-24 text-center text-sm text-white/50">
        Loading your dashboard…
      </Container>
    );
  }

  return (
    <section className="relative overflow-hidden bg-space-950 py-16 sm:py-20">
      <StarField className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
      <Container className="relative">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={`Welcome, ${user.name.split(" ")[0]}`}
            title="Your Data Requests"
            description="Track the status of every research data request you've submitted to CESPAR."
            className="max-w-xl"
          />
          <Button href="/request-data" size="lg" className="shrink-0">
            New Request
          </Button>
        </div>

        {pending && (
          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-cespar-red/30 bg-cespar-red/10 p-5 sm:flex-row sm:items-center">
            <p className="text-sm text-white/80">
              You were requesting <span className="font-semibold text-white">&ldquo;{pending.title}&rdquo;</span> before signing in — pick up where you left off.
            </p>
            <Button
              href={`/request-data?dataset=${pending.id}`}
              variant="outline"
              size="md"
              className="shrink-0"
            >
              Continue request
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="mt-10 overflow-hidden rounded-2xl border border-navy-400/40 bg-gradient-to-br from-navy-500/85 to-navy-500/55">
          {loadingRequests ? (
            <p className="p-8 text-center text-sm text-white/50">Loading requests…</p>
          ) : requests.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-white/70">
                You haven&apos;t requested any datasets yet.
              </p>
              <Button href="/request-data" variant="outline" className="mt-4">
                Browse the catalogue
              </Button>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="label-mono bg-black/15 text-[10px] text-white/50">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Dataset</th>
                  <th className="hidden px-5 py-3.5 font-medium sm:table-cell">Requested</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {requests.map((r) => {
                  const status = statusConfig[r.status];
                  return (
                    <tr key={r.id}>
                      <td className="px-5 py-4">
                        <div className="font-medium text-white">{r.dataset.title}</div>
                        <div className="mt-1 max-w-sm truncate text-xs text-white/60">
                          {r.purpose}
                        </div>
                        {r.adminNote && (
                          <div className="mt-1 text-xs italic text-white/50">
                            Note: {r.adminNote}
                          </div>
                        )}
                      </td>
                      <td className="hidden px-5 py-4 text-white/70 sm:table-cell">
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                        >
                          <status.icon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Container>
    </section>
  );
}
