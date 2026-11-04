"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check, Clock, Download, Gauge, Hourglass, LayoutGrid, Loader2, Moon, Rows3, Sun, XCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { inputClasses, FormField } from "@/components/ui/FormField";
import { StarField } from "@/components/ui/StarField";
import { Magnetogram } from "@/components/magnetometer/Magnetogram";
import { FieldChart } from "@/components/magnetometer/FieldChart";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError, API_BASE_URL } from "@/lib/api";
import type { Dataset, DataRequest, MagnetometerStatus, MagnetometerLatest } from "@/types";

type Theme = "dark" | "light";
const THEME_STORAGE_KEY = "cespar_mag_theme";
// Stacked = observatory-style magnetogram (shared time axis); grid = one
// card per component. The viewer's last choice is remembered.
type ChartView = "stacked" | "grid";
const VIEW_STORAGE_KEY = "cespar_mag_view";

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

// "1 Jun 2026" for a station day (YYYY-MM-DD), read as a calendar date.
function dayLabel(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function utcTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC",
  }) + " UTC";
}

function timeAgo(iso: string) {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return null; // older than a day: show the date instead
}

export default function MagnetometerPage() {
  const { user, token, loading } = useAuth();

  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);
  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const [view, setView] = useState<ChartView>("stacked");
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
      if (stored === "stacked" || stored === "grid") setView(stored);
    } catch {}
  }, []);
  const chooseView = (next: ChartView) => {
    setView(next);
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, next);
    } catch {}
  };

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [myRequest, setMyRequest] = useState<DataRequest | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [status, setStatus] = useState<MagnetometerStatus | null>(null);

  // Station day shown in the charts (null until the day list loads, then
  // the most recent day on record).
  const [day, setDay] = useState<string | null>(null);
  const [latest, setLatest] = useState<MagnetometerLatest | null>(null);
  const [loadingChart, setLoadingChart] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const [fromDate, setFromDate] = useState(() => isoDate(new Date(Date.now() - 7 * 86400_000)));
  const [toDate, setToDate] = useState(() => isoDate(new Date()));
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ dataset: Dataset }>("/datasets/magnetometer-data")
      .then((res) => setDataset(res.dataset))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!token) {
      setCheckingAccess(false);
      return;
    }
    api
      .get<{ requests: DataRequest[] }>("/requests/me", token)
      .then((res) => {
        setMyRequest(res.requests.find((r) => r.dataset.slug === "magnetometer-data") ?? null);
      })
      .finally(() => setCheckingAccess(false));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    api
      .get<MagnetometerStatus>("/magnetometer/status", token)
      .then((res) => {
        setStatus(res);
        const newest = res.days?.[0];
        if (newest) {
          setDay((current) => current ?? newest.date);
          setFromDate(isoDate(new Date(newest.start)));
          setToDate(isoDate(new Date(newest.end)));
        }
      })
      .catch(() => {});
  }, [token]);

  const hasAccess =
    user?.role === "ADMIN" || myRequest?.status === "APPROVED" || myRequest?.status === "FULFILLED";

  useEffect(() => {
    if (!token || !hasAccess || !day) return;
    setLoadingChart(true);
    setChartError(null);
    api
      .get<MagnetometerLatest>(`/magnetometer/latest?day=${day}`, token)
      .then(setLatest)
      .catch((err) => setChartError(err instanceof ApiError ? err.message : "Could not load chart data."))
      .finally(() => setLoadingChart(false));
  }, [token, hasAccess, day, retryCount]);

  const handleDownload = useCallback(async () => {
    if (!token) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/magnetometer/download?from=${fromDate}&to=${toDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "Download failed.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cespar_magnetometer_${fromDate}_${toDate}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setDownloading(false);
    }
  }, [token, fromDate, toDate]);

  return (
    <section className="mag-scope relative overflow-hidden bg-[var(--mag-bg)] py-16 sm:py-20" data-theme={theme}>
      {theme === "dark" && <StarField className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />}
      <Container className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-2xl">
            <span className="label-mono inline-flex items-center gap-2 text-[11px] text-cespar-red-light">
              <span className="h-1.5 w-1.5 rounded-full bg-cespar-red" />
              Live Data
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--mag-text-primary)] sm:text-4xl">
              Magnetometer
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--mag-text-secondary)]">
              Ground-based measurements of Earth&apos;s magnetic field from the CESPAR station at Anchor University
              Lagos.
            </p>
          </div>
          <ThemeToggle theme={theme} onChange={setTheme} />
        </div>

        {loading || checkingAccess ? (
          <LoadingSteps
            steps={[
              { label: "Verifying your session", done: !loading },
              { label: "Checking data access", done: !loading && !checkingAccess },
            ]}
          />
        ) : !user ? (
          <SignInPrompt />
        ) : !hasAccess ? (
          <AccessGate dataset={dataset} request={myRequest} status={status} token={token} theme={theme} />
        ) : (
          <div className="mt-10 flex flex-col gap-8">
            <StatusBar status={status} />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[var(--mag-text-primary)]">Station day</h3>
                {latest?.start && latest?.end && (
                  <p className="mt-0.5 text-xs text-[var(--mag-text-faint)]">
                    {utcTime(latest.start)} – {utcTime(latest.end)}
                  </p>
                )}
              </div>
              <div className="inline-flex max-w-full flex-wrap gap-1 rounded-2xl border border-[var(--mag-panel-border)] bg-[var(--mag-card-bg)] p-1">
                {(status?.days ?? []).map((d) => (
                  <button
                    key={d.date}
                    onClick={() => {
                      setDay(d.date);
                      setFromDate(isoDate(new Date(d.start)));
                      setToDate(isoDate(new Date(d.end)));
                    }}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      day === d.date
                        ? "bg-cespar-red text-white"
                        : "text-[var(--mag-text-secondary)] hover:text-[var(--mag-text-primary)]"
                    }`}
                  >
                    {dayLabel(d.date)}
                  </button>
                ))}
              </div>
            </div>

            {chartError ? (
              <div className="rounded-lg border border-cespar-red/30 bg-cespar-red/10 px-3.5 py-2.5 text-sm text-cespar-red-light">
                <p>{chartError}</p>
                <button
                  onClick={() => setRetryCount((c) => c + 1)}
                  className="mt-2 font-medium underline underline-offset-2 hover:text-[var(--mag-text-primary)]"
                >
                  Retry
                </button>
              </div>
            ) : loadingChart ? (
              <ChartSkeleton label="Magnetogram" />
            ) : (
              <>
                <div className="-mb-3 flex justify-end">
                  <div className="inline-flex rounded-full border border-[var(--mag-panel-border)] bg-[var(--mag-card-bg)] p-1" role="tablist" aria-label="Chart layout">
                    {([
                      ["stacked", "Stacked", Rows3],
                      ["grid", "Grid", LayoutGrid],
                    ] as const).map(([key, label, Icon]) => (
                      <button
                        key={key}
                        role="tab"
                        aria-selected={view === key}
                        onClick={() => chooseView(key)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                          view === key ? "bg-cespar-red text-white" : "text-[var(--mag-text-secondary)] hover:text-[var(--mag-text-primary)]"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {view === "stacked" ? (
                  <Magnetogram points={latest?.points ?? []} theme={theme} />
                ) : (
                  <div className="grid gap-5 lg:grid-cols-2">
                    <FieldChart points={latest?.points ?? []} field="f" label="Total Field (F)" color="var(--color-cespar-red)" theme={theme} />
                    <FieldChart points={latest?.points ?? []} field="x" label="X component" color="var(--color-navy-400)" theme={theme} />
                    <FieldChart points={latest?.points ?? []} field="y" label="Y component" color={theme === "dark" ? "#6ee7b7" : "#0d9488"} theme={theme} />
                    <FieldChart points={latest?.points ?? []} field="z" label="Z component" color={theme === "dark" ? "#facc15" : "#b45309"} theme={theme} />
                  </div>
                )}
              </>
            )}
            <p className="text-xs text-[var(--mag-text-faint)]">
              1-minute averages, outliers rejected within each minute. Full-resolution raw samples are included in
              the CSV download below.
            </p>

            <div className="rounded-2xl border border-[var(--mag-panel-border)] bg-[var(--mag-panel-bg)] p-6">
              <div className="flex items-center gap-2.5">
                <Download className="h-5 w-5 text-cespar-red-light" />
                <h3 className="font-display text-lg font-bold text-[var(--mag-text-primary)]">Download raw data</h3>
              </div>
              <p className="mt-1 text-sm text-[var(--mag-text-secondary)]">
                Full-resolution CSV (about one reading every 8 seconds) for a date range, up to 90 days per
                request, timestamps in UTC. The dates below are set to the station day shown above.
              </p>

              {downloadError && (
                <p className="mt-4 rounded-lg border border-cespar-red/30 bg-cespar-red/10 px-3.5 py-2.5 text-sm text-cespar-red-light">
                  {downloadError}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-end gap-4">
                <FormField label="From" htmlFor="from">
                  <input
                    id="from"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className={inputClasses}
                  />
                </FormField>
                <FormField label="To" htmlFor="to">
                  <input
                    id="to"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className={inputClasses}
                  />
                </FormField>
                <Button onClick={handleDownload} disabled={downloading}>
                  <Download className="h-4 w-4" />
                  {downloading ? "Preparing…" : "Download CSV"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--mag-panel-border)] bg-[var(--mag-card-bg)] p-1">
      <button
        onClick={() => onChange("dark")}
        aria-label="Dark mode"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          theme === "dark" ? "bg-cespar-red text-white" : "text-[var(--mag-text-secondary)] hover:text-[var(--mag-text-primary)]"
        }`}
      >
        <Moon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Dark</span>
      </button>
      <button
        onClick={() => onChange("light")}
        aria-label="Light mode"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          theme === "light" ? "bg-cespar-red text-white" : "text-[var(--mag-text-secondary)] hover:text-[var(--mag-text-primary)]"
        }`}
      >
        <Sun className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Light</span>
      </button>
    </div>
  );
}

function LoadingSteps({ steps }: { steps: { label: string; done: boolean }[] }) {
  return (
    <div className="mt-10 max-w-sm rounded-2xl border border-[var(--mag-panel-border)] bg-[var(--mag-panel-bg)] p-6">
      <ul className="flex flex-col gap-3">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-3 text-sm">
            {step.done ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-500" />
            ) : (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[var(--mag-text-tertiary)]" />
            )}
            <span
              className={
                step.done ? "text-[var(--mag-text-tertiary)] line-through" : "text-[var(--mag-text-primary)]"
              }
            >
              {step.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChartSkeleton({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-[var(--mag-card-border)] bg-[var(--mag-card-bg)] p-4">
      <div className="flex items-center justify-between">
        <span className="label-mono text-[11px] text-[var(--mag-text-faint)]">{label}</span>
        <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--mag-text-faint)]" />
      </div>
      <div className="mt-2 h-[360px] animate-pulse rounded-lg bg-[var(--mag-skeleton-bg)]" />
    </div>
  );
}

function SignInPrompt() {
  return (
    <div className="mt-10 rounded-2xl border border-[var(--mag-panel-border)] bg-[var(--mag-panel-bg)] p-8 text-center">
      <p className="text-sm text-[var(--mag-text-secondary)]">
        Sign in to view live magnetometer data and request access.
      </p>
      <div className="mt-5 flex justify-center gap-3">
        <Button href="/login" variant="outline">
          Log in
        </Button>
        <Button href="/register">Create Account</Button>
      </div>
    </div>
  );
}

function StatusBar({ status }: { status: MagnetometerStatus | null }) {
  if (!status || !status.latestReading) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-[var(--mag-panel-border)] bg-[var(--mag-panel-bg)] px-6 py-4">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full bg-[var(--mag-active-color)]"
          style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
        />
        <span className="label-mono text-[11px] text-[var(--mag-active-color)]">STATION AUL · ACTIVE</span>
      </div>
      <div className="flex items-center gap-1.5 text-sm text-[var(--mag-text-secondary)]">
        <Clock className="h-4 w-4 text-[var(--mag-text-faint)]" />
        Latest reading {timeAgo(status.latestReading) ?? utcTime(status.latestReading)}
      </div>
      <div className="flex items-center gap-1.5 text-sm text-[var(--mag-text-secondary)]">
        <Gauge className="h-4 w-4 text-[var(--mag-text-faint)]" />
        {status.totalReadings.toLocaleString()} readings archived
      </div>
      {status.earliestReading && (
        <div className="flex items-center gap-1.5 text-sm text-[var(--mag-text-secondary)]">
          <Hourglass className="h-4 w-4 text-[var(--mag-text-faint)]" />
          Since{" "}
          {new Date(status.earliestReading).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      )}
    </div>
  );
}

function AccessGate({
  dataset,
  request,
  status,
  token,
  theme,
}: {
  dataset: Dataset | null;
  request: DataRequest | null;
  status: MagnetometerStatus | null;
  token: string | null;
  theme: Theme;
}) {
  // While a request is pending: the latest station day at 10-minute
  // resolution, so researchers can see what they're asking for.
  const [preview, setPreview] = useState<MagnetometerLatest | null>(null);
  useEffect(() => {
    if (!token || request?.status !== "PENDING") return;
    api
      .get<MagnetometerLatest>("/magnetometer/preview", token)
      .then(setPreview)
      .catch(() => {});
  }, [token, request?.status]);

  return (
    <div className="mt-10 flex flex-col gap-6">
      <StatusBar status={status} />
      <div className="rounded-2xl border border-[var(--mag-panel-border)] bg-[var(--mag-panel-bg)] p-8">
        {request?.status === "PENDING" && (
          <>
            <div className="flex items-center gap-2 text-amber-500">
              <Clock className="h-5 w-5" />
              <span className="font-display text-lg font-bold">Request pending review</span>
            </div>
            <p className="mt-2 text-sm text-[var(--mag-text-secondary)]">
              Your access request for Magnetometer Data is awaiting admin approval. You&apos;ll be able to view the
              live chart and download data here as soon as it&apos;s approved.
            </p>
          </>
        )}
        {request?.status === "PENDING" && preview && preview.points.length > 0 && (
          <div className="mt-6">
            <p className="label-mono mb-2 text-[11px] text-[var(--mag-text-faint)]">
              Preview · {preview.day ? new Date(`${preview.day}T12:00:00Z`).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : ""} · 10-minute averages
            </p>
            <Magnetogram points={preview.points} theme={theme} />
            <p className="mt-2 text-xs text-[var(--mag-text-faint)]">
              Every station day, 1-minute detail and full-resolution CSV downloads unlock once your request is approved.
            </p>
          </div>
        )}

        {request?.status === "REJECTED" && (
          <>
            <div className="flex items-center gap-2 text-cespar-red-light">
              <XCircle className="h-5 w-5" />
              <span className="font-display text-lg font-bold">Request declined</span>
            </div>
            {request.adminNote && (
              <p className="mt-2 text-sm italic text-[var(--mag-text-tertiary)]">Note: {request.adminNote}</p>
            )}
            <p className="mt-2 text-sm text-[var(--mag-text-secondary)]">
              You can submit a new request with more detail below.
            </p>
            <Button href={dataset ? `/request-data?dataset=${dataset.id}` : "/request-data"} className="mt-5">
              Submit a new request
            </Button>
          </>
        )}

        {!request && (
          <>
            <p className="font-display text-lg font-bold text-[var(--mag-text-primary)]">Access required</p>
            <p className="mt-2 text-sm text-[var(--mag-text-secondary)]">
              Magnetometer data is available to registered researchers once a request is approved. Live readings
              update continuously; approval typically covers full access to view and download the archive.
            </p>
            <Button href={dataset ? `/request-data?dataset=${dataset.id}` : "/request-data"} className="mt-5">
              Request access
            </Button>
          </>
        )}
      </div>
      {dataset && (
        <Link href="/request-data" className="text-sm text-[var(--mag-text-faint)] hover:text-[var(--mag-text-secondary)]">
          View full dataset catalogue →
        </Link>
      )}
    </div>
  );
}
