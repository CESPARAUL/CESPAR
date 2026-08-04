"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { siteMeta } from "@/data/content";
import { cn, toWhatsAppNumber } from "@/lib/utils";

const SHOW_AFTER_PX = 400;

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={`https://wa.me/${toWhatsAppNumber(siteMeta.whatsapp)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/40",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <MessageCircle className="h-5 w-5" strokeWidth={2} />
      Chat Admin
    </a>
  );
}
