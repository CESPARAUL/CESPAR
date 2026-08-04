"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Database, Radio, SatelliteDish, Archive, Magnet, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { inputClasses, FormField } from "@/components/ui/FormField";
import { StarField } from "@/components/ui/StarField";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api";
import type { Dataset } from "@/types";

const categoryIcons: Record<string, typeof Database> = {
  ARCHIVE: Archive,
  RADIO: Radio,
  WEATHER: Database,
  SATELLITE: SatelliteDish,
  MAGNETOMETER: Magnet,
};

export default function RequestDataPage() {
  const { user, token, loading } = useAuth();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);
  const [selected, setSelected] = useState<Dataset | null>(null);
  const [purpose, setPurpose] = useState("");
  const [dateRangeFrom, setDateRangeFrom] = useState("");
  const [dateRangeTo, setDateRangeTo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api
      .get<{ datasets: Dataset[] }>("/datasets")
      .then((res) => setDatasets(res.datasets))
      .catch(() => setError("Could not load the dataset catalogue right now."))
      .finally(() => setLoadingDatasets(false));
  }, []);

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !token) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.post(
        "/requests",
        { datasetId: selected.id, purpose, dateRangeFrom, dateRangeTo },
        token
      );
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit your request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-space-950 py-16 sm:py-20">
      <StarField className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Data Catalogue"
          title="Request Research Data"
          description="Browse dataset metadata below — no account needed. To submit a request and download data, sign in or create a free researcher account."
          className="max-w-2xl"
        />

        {loadingDatasets ? (
          <p className="mt-10 text-sm text-white/50">Loading datasets…</p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {datasets.map((dataset) => {
              const Icon = categoryIcons[dataset.category] ?? Database;
              return (
                <div
                  key={dataset.id}
                  className="flex flex-col rounded-2xl border border-navy-400/40 bg-gradient-to-br from-navy-500/85 to-navy-500/55 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cespar-red/40"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-400/60 to-cespar-red/40 text-white ring-1 ring-white/15">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                    <h3 className="font-display text-xl font-bold text-white">
                      {dataset.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">
                    {dataset.description}
                  </p>
                  <dl className="mt-4 space-y-1 text-xs text-white/50">
                    <div className="flex gap-1.5">
                      <dt className="font-medium text-white/70">Coverage:</dt>
                      <dd>{dataset.coverage}</dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="font-medium text-white/70">Format:</dt>
                      <dd>{dataset.format}</dd>
                    </div>
                  </dl>

                  <div className="mt-5">
                    {!loading && user ? (
                      <Button
                        variant="outline"
                        size="md"
                        className="w-full"
                        onClick={() => {
                          setSelected(dataset);
                          setSuccess(false);
                          setError(null);
                        }}
                      >
                        Request this dataset
                      </Button>
                    ) : (
                      <Button href="/register" variant="outline" size="md" className="w-full">
                        Create an account to request
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-navy-400/40 bg-gradient-to-br from-navy-500/90 to-navy-500/65 p-7 shadow-2xl">
              {success ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                  <h3 className="mt-4 font-display text-xl font-bold text-white">
                    Request submitted
                  </h3>
                  <p className="mt-2 text-sm text-white/60">
                    Our team will review your request for &ldquo;{selected.title}&rdquo; and notify you once it&apos;s approved.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelected(null);
                        setSuccess(false);
                        setPurpose("");
                        setDateRangeFrom("");
                        setDateRangeTo("");
                      }}
                    >
                      Close
                    </Button>
                    <Link href="/dashboard">
                      <Button>View Dashboard</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-lg font-bold text-white">
                    Request: {selected.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/50">
                    Tell us about your research so we can review your request.
                  </p>

                  <form onSubmit={submitRequest} className="mt-6 flex flex-col gap-4">
                    {error && (
                      <p className="rounded-lg border border-cespar-red/30 bg-cespar-red/10 px-3.5 py-2.5 text-sm text-cespar-red-light">
                        {error}
                      </p>
                    )}

                    <FormField label="Research purpose" htmlFor="purpose">
                      <textarea
                        id="purpose"
                        required
                        minLength={10}
                        rows={4}
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className={inputClasses}
                        placeholder="Describe what you're researching and how this dataset will be used…"
                      />
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="From (optional)" htmlFor="from">
                        <input
                          id="from"
                          type="date"
                          value={dateRangeFrom}
                          onChange={(e) => setDateRangeFrom(e.target.value)}
                          className={inputClasses}
                        />
                      </FormField>
                      <FormField label="To (optional)" htmlFor="to">
                        <input
                          id="to"
                          type="date"
                          value={dateRangeTo}
                          onChange={(e) => setDateRangeTo(e.target.value)}
                          className={inputClasses}
                        />
                      </FormField>
                    </div>

                    <div className="mt-2 flex gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setSelected(null)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting} className="flex-1">
                        {submitting ? "Submitting..." : "Submit Request"}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
