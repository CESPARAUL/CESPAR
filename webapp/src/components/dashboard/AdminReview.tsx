"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Clock, X } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { DataRequest } from "@/types";

type AdminRequest = DataRequest & { user: { id: string; name: string; email: string; institution: string | null } };

// Admins only: data requests waiting for a decision. Approving a
// Magnetometer request gives the researcher the charts and CSV download
// straight away and emails them a link to it.
export function AdminReview({ token }: { token: string }) {
  const [requests, setRequests] = useState<AdminRequest[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .get<{ requests: AdminRequest[] }>("/requests", token)
      .then((res) => setRequests(res.requests.filter((r) => r.status === "PENDING")))
      .catch(() => setRequests([]));
  }, [token]);

  useEffect(load, [load]);

  async function decide(r: AdminRequest, status: "APPROVED" | "REJECTED") {
    let adminNote: string | undefined;
    if (status === "REJECTED") {
      const reason = window.prompt(`Why are you declining ${r.user.name}'s request? They'll see this note.`);
      if (reason === null) return;
      adminNote = reason.trim() || undefined;
    }
    setBusyId(r.id);
    setError(null);
    try {
      await api.patch(`/requests/${r.id}`, { status, ...(adminNote ? { adminNote } : {}) }, token);
      setRequests((prev) => (prev || []).filter((x) => x.id !== r.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't update that request. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-10 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-amber-400" />
        <h3 className="font-display text-lg font-bold text-white">
          Requests to review{requests && requests.length ? ` (${requests.length})` : ""}
        </h3>
      </div>
      {error && <p className="mt-3 text-sm text-cespar-red-light">{error}</p>}
      {requests === null ? (
        <p className="mt-4 text-sm text-white/50">Loading…</p>
      ) : requests.length === 0 ? (
        <p className="mt-4 text-sm text-white/60">Nothing waiting for review.</p>
      ) : (
        <ul className="mt-4 divide-y divide-white/10">
          {requests.map((r) => (
            <li key={r.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-white">
                  {r.user.name} <span className="font-normal text-white/50">· {r.user.email}</span>
                </p>
                <p className="mt-0.5 text-xs text-white/60">
                  {r.dataset.title}
                  {r.user.institution ? ` · ${r.user.institution}` : ""} ·{" "}
                  {new Date(r.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p className="mt-2 max-w-2xl text-sm text-white/80">{r.purpose}</p>
                {(r.dateRangeFrom || r.dateRangeTo) && (
                  <p className="mt-1 text-xs text-white/50">
                    Dates asked for: {r.dateRangeFrom || "…"} to {r.dateRangeTo || "…"}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => decide(r, "APPROVED")}
                  disabled={busyId === r.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={() => decide(r, "REJECTED")}
                  disabled={busyId === r.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:border-cespar-red hover:text-white disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
