"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X, ChevronLeft, ChevronRight, Tag, Check } from "lucide-react";
import { useStore } from "@/lib/store";

interface NewsItem {
  id: string;
  badgeEn: string;
  badgeBn: string;
  textEn: string;
  textBn: string;
  ctaEn: string;
  ctaBn: string;
  href: string;
  couponCode?: string;
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "coupon",
    badgeEn: "10% Privilege Off",
    badgeBn: "১০% বিশেষ ছাড়",
    textEn: "Order with privilege code NOORE10 at checkout to receive 10% off your order",
    textBn: "অর্ডার করার সময় কুপন কোড NOORE10 ব্যবহার করে উপভোগ করুন ১০% বিশেষ ছাড়",
    ctaEn: "Apply Code",
    ctaBn: "কোড প্রয়োগ",
    href: "/shop",
    couponCode: "NOORE10",
  },
  {
    id: "eid",
    badgeEn: "Occasion Cutoff",
    badgeBn: "ঈদ ডেলিভারি",
    textEn: "Order by 12 March for guaranteed pre-Eid delivery across Bangladesh",
    textBn: "সময়মতো ঈদ ডেলিভারি পেতে ১২ মার্চের মধ্যে আপনার অর্ডার কনফার্ম করুন",
    ctaEn: "Shop Eid Edits",
    ctaBn: "ঈদ কালেকশন",
    href: "/shop",
  },
  {
    id: "shipping",
    badgeEn: "Complimentary Shipping",
    badgeBn: "ফ্রি ডেলিভারি",
    textEn: "Complimentary luxury courier dispatch on all atelier orders over ৳10,000",
    textBn: "৳১০,০০০-এর বেশি সব অর্ডারে সারা দেশে ফ্রি প্রিমিয়াম ডেলিভারি",
    ctaEn: "Explore",
    ctaBn: "কালেকশন",
    href: "/shop",
  },
  {
    id: "express",
    badgeEn: "Dhaka 24H Express",
    badgeBn: "২৪ ঘণ্টা এক্সপ্রেস",
    textEn: "Same-day VIP concierge delivery available within Dhaka Metropolitan",
    textBn: "ঢাকা সিটিতে ২৪ ঘণ্টায় ভিআইপি কনসিয়ার্জ ও এক্সপ্রেস হোম ডেলিভারি",
    ctaEn: "Details",
    ctaBn: "বিস্তারিত",
    href: "/delivery-returns",
  },
  {
    id: "cod",
    badgeEn: "Nationwide COD",
    badgeBn: "ক্যাশ অন ডেলিভারি",
    textEn: "Cash on delivery available across all 64 districts with parcel inspection",
    textBn: "সারা দেশের ৬৪ জেলায় ক্যাশ অন ডেলিভারি ও পার্সেল চেক করে নেয়ার সুবিধা",
    ctaEn: "Coverage",
    ctaBn: "তথ্য",
    href: "/delivery-returns",
  },
  {
    id: "drops",
    badgeEn: "New Drop",
    badgeBn: "নতুন ড্রপ",
    textEn: "Volume IV: Handcrafted Korean Nida & Pure Silk Abayas now released",
    textBn: "ভলিউম ৪: নতুন কোরিয়ান নিদা ও পিওর সিল্ক আবায়া কালেকশন এখন উপলব্ধ",
    ctaEn: "View Drop",
    ctaBn: "ড্রপ দেখুন",
    href: "/drops",
  },
];

export function AnnouncementRibbon() {
  const { lang, applyCoupon } = useStore();
  const [dismissed, setDismissed] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Auto-cycle single spotlight every 5.5 seconds when not paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % NEWS_ITEMS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  if (dismissed) return null;

  const currentItem = NEWS_ITEMS[activeIdx];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? NEWS_ITEMS.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % NEWS_ITEMS.length);
  };

  const handleApplyCoupon = (code: string) => {
    applyCoupon(code);
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div
      className="relative z-40 bg-[#141C17] dark:bg-[#0A0E0C] text-[#F5F2EB] dark:text-[#EAE5D9] border-b border-white/10 text-xs overflow-hidden select-none transition-colors"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      role="region"
      aria-label="Atelier News and Announcements"
    >
      {/* Ambient gold glow accent */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#DFCA9B]/40 to-transparent pointer-events-none" />

      {/* Main bar container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: badge & stepper */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full bg-[#DFCA9B]/15 text-[#DFCA9B] border border-[#DFCA9B]/25 font-semibold text-[10px] tracking-wider uppercase whitespace-nowrap">
            {currentItem.couponCode ? (
              <Tag className="w-3 h-3 sm:w-2.5 sm:h-2.5 text-[#DFCA9B]" />
            ) : (
              <Sparkles className="w-3 h-3 sm:w-2.5 sm:h-2.5 animate-pulse text-[#DFCA9B]" />
            )}
            {/* label hidden on mobile so it never wraps */}
            <span className="hidden sm:inline">
              {lang === "bn" ? currentItem.badgeBn : currentItem.badgeEn}
            </span>
          </span>

          {/* Stepper buttons */}
          <div className="hidden sm:flex items-center gap-0.5 text-white/50">
            <button
              onClick={handlePrev}
              className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
              aria-label="Previous announcement"
              title="Previous news"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono tracking-tighter px-1 text-white/70">
              {activeIdx + 1}/{NEWS_ITEMS.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
              aria-label="Next announcement"
              title="Next news"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: one line, text truncates, CTA never shrinks */}
        <div className="flex-1 min-w-0 px-0 sm:px-4">
          <div
            key={currentItem.id}
            className="flex items-center justify-start sm:justify-center gap-2 min-w-0 animate-fadeIn"
          >
            <span className="min-w-0 truncate text-white/95 font-medium tracking-wide text-[11px] sm:text-xs leading-none">
              {lang === "bn" ? currentItem.textBn : currentItem.textEn}
            </span>

            {currentItem.couponCode ? (
              <button
                type="button"
                onClick={() => handleApplyCoupon(currentItem.couponCode!)}
                className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#DFCA9B] text-black font-semibold text-[10px] uppercase tracking-wider hover:bg-[#edd8a9] transition-all"
                title="Click to apply and copy code"
              >
                {copiedCode === currentItem.couponCode ? (
                  <>
                    <Check className="w-3 h-3 text-black" />
                    <span>{lang === "bn" ? "প্রয়োগ হয়েছে" : "Applied!"}</span>
                  </>
                ) : (
                  <>
                    <Tag className="w-3 h-3 text-black" />
                    <span>{currentItem.couponCode}</span>
                  </>
                )}
              </button>
            ) : (
              <Link
                href={currentItem.href}
                aria-label={lang === "bn" ? currentItem.ctaBn : currentItem.ctaEn}
                className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1 text-[#DFCA9B] hover:text-white font-semibold text-[11px] uppercase tracking-wider transition-colors sm:underline sm:underline-offset-4"
              >
                {/* text CTA only on sm+, arrow-only on mobile */}
                <span className="hidden sm:inline">
                  {lang === "bn" ? currentItem.ctaBn : currentItem.ctaEn}
                </span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Right: dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Dismiss announcement ribbon"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}