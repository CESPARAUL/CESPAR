import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Converts a display phone number (e.g. "+234 703 341 2059") to the digits-only form wa.me expects. */
export function toWhatsAppNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Extracts the video ID from a youtu.be/youtube.com URL, or returns null if unrecognized. */
export function getYoutubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1) || null;
    }
    if (parsed.hostname.endsWith("youtube.com")) {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.replace("/embed/", "");
      }
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.replace("/shorts/", "");
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Remembers which dataset a signed-out visitor tried to request, so the
// intent survives the register/verify-email/login detour and can be
// resumed once they're authenticated.
const PENDING_REQUEST_KEY = "cespar_pending_request";

export function setPendingRequest(dataset: { id: string; title: string }) {
  window.localStorage.setItem(PENDING_REQUEST_KEY, JSON.stringify(dataset));
}

export function getPendingRequest(): { id: string; title: string } | null {
  const raw = window.localStorage.getItem(PENDING_REQUEST_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPendingRequest() {
  window.localStorage.removeItem(PENDING_REQUEST_KEY);
}
