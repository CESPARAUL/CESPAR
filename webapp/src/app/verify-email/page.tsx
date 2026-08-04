"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormField, InputIcon, inputClasses, inputWithIconClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

const RESEND_COOLDOWN_SECONDS = 60;

function VerifyEmailForm() {
  const { verifyEmail, resendOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailFromQuery);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      await verifyEmail(email, code);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not verify that code");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (!email || cooldown > 0) return;
    setError(null);
    setNotice(null);
    setResending(true);
    try {
      await resendOtp(email);
      setNotice("A new code has been sent to your email.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend the code");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthShell
      title="Verify your email"
      subtitle="Enter the 6-digit code we sent to your inbox to finish creating your account."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <p className="rounded-lg border border-cespar-red/30 bg-cespar-red/10 px-3.5 py-2.5 text-sm text-cespar-red-light">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-2.5 text-sm text-emerald-300">
            {notice}
          </p>
        )}

        <FormField label="Email" htmlFor="email">
          <InputIcon icon={Mail}>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputWithIconClasses}
              placeholder="you@institution.edu"
            />
          </InputIcon>
        </FormField>

        <FormField label="Verification code" htmlFor="code" hint="Check your inbox — the code expires in 10 minutes">
          <input
            id="code"
            required
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className={`${inputClasses} font-mono text-center text-lg tracking-[0.4em]`}
            placeholder="000000"
          />
        </FormField>

        <Button type="submit" size="lg" disabled={submitting || code.length !== 6} className="mt-2 w-full">
          {submitting ? "Verifying..." : "Verify & Continue"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-white/50">
        Didn&apos;t get a code?{" "}
        <button
          onClick={handleResend}
          disabled={resending || cooldown > 0 || !email}
          className="font-semibold text-cespar-red-light hover:text-cespar-red disabled:cursor-not-allowed disabled:text-white/30"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? "Sending..." : "Resend code"}
        </button>
      </div>

      <p className="mt-3 text-center text-sm text-white/40">
        Wrong email?{" "}
        <Link href="/register" className="font-semibold text-cespar-red-light hover:text-cespar-red">
          Start over
        </Link>
      </p>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
