"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { StarField } from "@/components/ui/StarField";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function SettingsPage() {
  const { user, loading, updateProfile, changePassword } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setInstitution(user.institution ?? "");
  }, [user]);

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("institution", institution);
      if (avatarFile) formData.append("avatar", avatarFile);
      await updateProfile(formData);
      setAvatarFile(null);
      setPreviewUrl(null);
      setProfileSuccess(true);
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : "Could not update your profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update your password.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) {
    return (
      <Container className="py-24 text-center text-sm text-white/50">
        Loading settings…
      </Container>
    );
  }

  return (
    <section className="relative overflow-hidden bg-space-950 py-16 sm:py-20">
      <StarField className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
      <Container className="relative max-w-2xl">
        <SectionHeading
          eyebrow="Settings"
          title="Account Settings"
          description="Manage your profile, account details and security."
        />

        <div className="mt-10 rounded-2xl border border-navy-400/40 bg-gradient-to-br from-navy-500/85 to-navy-500/55 p-6">
          <h3 className="font-display text-base font-semibold text-white">Profile</h3>

          <form onSubmit={handleProfileSubmit} className="mt-5 flex flex-col gap-4">
            {profileError && (
              <p className="rounded-lg border border-cespar-red/30 bg-cespar-red/10 px-3.5 py-2.5 text-sm text-cespar-red-light">
                {profileError}
              </p>
            )}
            {profileSuccess && (
              <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-2.5 text-sm text-emerald-300">
                Profile updated successfully.
              </p>
            )}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-white/20"
                aria-label="Change profile picture"
              >
                <Avatar src={previewUrl ?? user.avatar} name={user.name} />
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="h-6 w-6 text-white" />
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onPickFile}
                className="hidden"
              />
            </div>

            <FormField label="Full name" htmlFor="profile-name">
              <input
                id="profile-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
              />
            </FormField>

            <FormField label="Institution" htmlFor="profile-institution">
              <input
                id="profile-institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className={inputClasses}
                placeholder="University or organisation"
              />
            </FormField>

            <Button type="submit" disabled={savingProfile} className="mt-2 self-start">
              {savingProfile ? "Saving..." : "Save profile"}
            </Button>
          </form>
        </div>

        <div className="mt-6 rounded-2xl border border-navy-400/40 bg-gradient-to-br from-navy-500/85 to-navy-500/55 p-6">
          <h3 className="font-display text-base font-semibold text-white">Account</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-white/50">Email</dt>
              <dd className="text-white">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/50">Email verified</dt>
              <dd className="text-white">{user.emailVerified ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 rounded-2xl border border-navy-400/40 bg-gradient-to-br from-navy-500/85 to-navy-500/55 p-6">
          <h3 className="font-display text-base font-semibold text-white">Change password</h3>

          <form onSubmit={handlePasswordSubmit} className="mt-5 flex flex-col gap-4">
            {error && (
              <p className="rounded-lg border border-cespar-red/30 bg-cespar-red/10 px-3.5 py-2.5 text-sm text-cespar-red-light">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-2.5 text-sm text-emerald-300">
                Password updated successfully.
              </p>
            )}

            <FormField label="Current password" htmlFor="current-password">
              <input
                id="current-password"
                type="password"
                required
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClasses}
              />
            </FormField>

            <FormField label="New password" htmlFor="new-password" hint="At least 8 characters">
              <input
                id="new-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClasses}
              />
            </FormField>

            <FormField label="Confirm new password" htmlFor="confirm-password">
              <input
                id="confirm-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClasses}
              />
            </FormField>

            <Button type="submit" disabled={submitting} className="mt-2 self-start">
              {submitting ? "Updating..." : "Update password"}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
