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
