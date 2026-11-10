"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { useStore } from "@/lib/store";

export function AnnouncementRibbon() {
  const { lang, siteSettings } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-40 bg-[#16201A] dark:bg-[#0A0D0C] text-[#F4F1EA] dark:text-[#EAE5D9] border-b border-white/10 py-2.5 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 text-[#DFCA9B] flex-shrink-0 animate-pulse" />
          <span className="font-medium tracking-wide truncate">
            {siteSettings?.announcementText ||
              (lang === "bn"
                ? "ঈদ বিশেষ ডেলিভারি: সময়মতো পৌঁছাতে ১২ মার্চের মধ্যে অর্ডার করুন"
                : "Occasion Cutoff: Order by 12 March for guaranteed pre-Eid delivery")}
          </span>
          <span className="hidden md:inline text-white/40">•</span>
          <span className="hidden md:inline text-white/80 text-[11px]">
            {siteSettings?.announcementSubtext ||
              (lang === "bn"
                ? "সারা দেশে ক্যাশ অন ডেলিভারি এবং ঢাকা সিটিতে ২৪ ঘণ্টায় ডেলিভারি"
                : "Complimentary courier dispatch on all atelier orders over ৳10,000")}
          </span>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-[#DFCA9B] hover:text-white underline underline-offset-4 font-semibold text-[11px] uppercase tracking-wider ml-1"
          >
            <span>{lang === "bn" ? "দেখুন" : "Shop"}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
