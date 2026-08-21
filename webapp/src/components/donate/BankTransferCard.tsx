"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import { donationInfo } from "@/data/content";

function CopyableRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4 last:border-0">
      <div>
        <p className="label-mono text-[11px] text-white/45">{label}</p>
        <p className="mt-1 font-display text-lg font-semibold text-white">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-white/70 transition-colors hover:border-cespar-red-light/50 hover:text-white"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-cespar-red-light" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}

export function BankTransferCard() {
  const { bankTransfer, note } = donationInfo;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.02] px-6 py-5 sm:px-8">
        <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
          <Image
            src={bankTransfer.bankLogo}
            alt={bankTransfer.bankName}
            fill
            className="object-cover"
          />
        </span>
        <h2 className="font-display text-base font-semibold text-white">Bank Transfer</h2>
      </div>
      <div className="px-6 py-2 sm:px-8">
        <CopyableRow label="Account Name" value={bankTransfer.accountName} />
        <CopyableRow label="Bank" value={bankTransfer.bankName} />
        <CopyableRow label="Account Number" value={bankTransfer.accountNumber} />
      </div>
      <p className="border-t border-white/10 bg-white/[0.02] px-6 py-4 text-xs leading-relaxed text-white/50 sm:px-8">
        {note}
      </p>
    </div>
  );
}
