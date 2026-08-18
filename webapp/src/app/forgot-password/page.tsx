"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormField, InputIcon, inputWithIconClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await forgotPassword(email);
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send a reset code");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your account email and we'll send you a code to reset it."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <p className="rounded-lg border border-cespar-red/30 bg-cespar-red/10 px-3.5 py-2.5 text-sm text-cespar-red-light">
            {error}
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

        <Button type="submit" size="lg" disabled={submitting} className="mt-2 w-full">
          {submitting ? "Sending..." : "Send reset code"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-cespar-red-light hover:text-cespar-red">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
