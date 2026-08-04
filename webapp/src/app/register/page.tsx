"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Building2, Lock } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormField, InputIcon, inputWithIconClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    institution: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(form);
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 502) {
        // Account was created but the verification email failed to send
        // (e.g. SMTP not configured yet) — still let them reach the verify
        // screen so they can use "Resend code" once SMTP is fixed.
        router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
        return;
      }
      setError(err instanceof ApiError ? err.message : "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Register to request access to CESPAR research data."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <p className="rounded-lg border border-cespar-red/30 bg-cespar-red/10 px-3.5 py-2.5 text-sm text-cespar-red-light">
            {error}
          </p>
        )}

        <FormField label="Full name" htmlFor="name">
          <InputIcon icon={User}>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputWithIconClasses}
              placeholder="Ada Lovelace"
            />
          </InputIcon>
        </FormField>

        <FormField label="Email" htmlFor="email">
          <InputIcon icon={Mail}>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputWithIconClasses}
              placeholder="you@institution.edu"
            />
          </InputIcon>
        </FormField>

        <FormField label="Institution" htmlFor="institution" hint="Optional, but helps us review requests faster">
          <InputIcon icon={Building2}>
            <input
              id="institution"
              value={form.institution}
              onChange={(e) => update("institution", e.target.value)}
              className={inputWithIconClasses}
              placeholder="University or organisation"
            />
          </InputIcon>
        </FormField>

        <FormField label="Password" htmlFor="password" hint="At least 8 characters">
          <InputIcon icon={Lock}>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className={inputWithIconClasses}
              placeholder="••••••••"
            />
          </InputIcon>
        </FormField>

        <Button type="submit" size="lg" disabled={submitting} className="mt-2 w-full">
          {submitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-cespar-red-light hover:text-cespar-red">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
