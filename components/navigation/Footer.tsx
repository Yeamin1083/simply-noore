"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Heart } from "lucide-react";
import { useStore } from "@/lib/store";

export function Footer() {
  const { lang } = useStore();

  const handleReplayReveal = () => {
    try {
      sessionStorage.removeItem("sn-intro-seen");
      window.location.href = "/";
    } catch (e) {
      window.location.reload();
    }
  };

  return (
    <footer className="relative bg-[#141C17] dark:bg-[#0A0D0B] text-[#F5F2EB] dark:text-[#EAE5D9] border-t border-white/10 pt-16 md:pt-24 pb-12 overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#DFCA9B]/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Grand Brand Reveal Banner in Footer */}
        <div className="flex flex-col items-center text-center pb-16 mb-16 border-b border-white/10">
          <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-2">
            <span>Simply </span>
            <em className="font-serif italic font-normal text-[#DFCA9B]">Nooré</em>
          </h3>

          <p className="font-sans text-xs uppercase tracking-[0.28em] text-[#DFCA9B] font-medium mb-3">
            Modesty, Redefined.
          </p>

          <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed mb-6 font-light">
            {lang === "bn"
              ? "আধুনিক মার্জিত রুচি ও শৈল্পিক কারুকার্যের মেলবন্ধন। ঢাকা ও দুবাই অ্যাটেলিয়ারে তৈরি বিশেষ ফ্যাশন সম্ভার।"
              : "Sculptural silhouettes, intentional modesty, and artisanal tailoring crafted between Dhaka and Dubai."}
          </p>

          <button
            onClick={handleReplayReveal}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 hover:bg-[#DFCA9B]/20 border border-[#DFCA9B]/30 text-[#DFCA9B] hover:text-white text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Replay Brand Reveal</span>
          </button>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#DFCA9B] mb-4">
              {lang === "bn" ? "পোশাক সম্ভার" : "Collection"}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link href="/category/abayas" className="hover:text-white transition-colors">
                  {lang === "bn" ? "আবায়া" : "Abayas"}
                </Link>
              </li>
              <li>
                <Link href="/category/three-piece-sets" className="hover:text-white transition-colors">
                  {lang === "bn" ? "থ্রি পিস সেট" : "Three Piece Sets"}
                </Link>
              </li>
              <li>
                <Link href="/category/corsets" className="hover:text-white transition-colors">
                  {lang === "bn" ? "করসেট ও বেল্ট" : "Corsets & Belts"}
                </Link>
              </li>
              <li>
                <Link href="/drops" className="hover:text-white transition-colors">
                  {lang === "bn" ? "গোল্ডেন আওয়ার ড্রপ" : "Golden Hour Drop"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#DFCA9B] mb-4">
              {lang === "bn" ? "অনবদ্য সেবা" : "Curated"}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link href="/style-finder" className="hover:text-white transition-colors">
                  {lang === "bn" ? "স্টাইল ফাইন্ডার" : "The Style Edit ✦"}
                </Link>
              </li>
              <li>
                <Link href="/look-builder" className="hover:text-white transition-colors">
                  {lang === "bn" ? "লুক বিল্ডার" : "Look Builder"}
                </Link>
              </li>
              <li>
                <Link href="/fabrics" className="hover:text-white transition-colors">
                  {lang === "bn" ? "ফ্যাব্রিক লাইব্রেরি" : "Fabric Library"}
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-white transition-colors">
                  {lang === "bn" ? "জার্নাল" : "Editorial Journal"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#DFCA9B] mb-4">
              {lang === "bn" ? "গ্রাহক সহায়তা" : "Client Care"}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  {lang === "bn" ? "অর্ডার ট্র্যাকিং" : "Track Order"}
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  {lang === "bn" ? "সাইজ গাইড" : "Smart Size Assistant"}
                </Link>
              </li>
              <li>
                <Link href="/delivery-returns" className="hover:text-white transition-colors">
                  {lang === "bn" ? "ডেলিভারি ও রিটার্ন" : "Delivery & Returns"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {lang === "bn" ? "যোগাযোগ" : "Atelier Concierge"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#DFCA9B] mb-4">
              {lang === "bn" ? "আটেলিয়ার" : "Atelier"}
            </h4>
            <p className="text-sm text-white/70 mb-3 leading-relaxed">
              Dhaka Atelier, Gulshan-2, Dhaka 1212. Nationwide priority courier & cash on delivery.
            </p>
            <div className="text-xs uppercase tracking-widest text-white/60 space-y-1">
              <p>WhatsApp: +880 1700 000000</p>
              <p>Instagram: @simplynoore</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© 2026 Simply Nooré. Modesty, Redefined. Dhaka Atelier.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/delivery-returns" className="hover:text-white transition-colors">Delivery &amp; Returns</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Atelier Operations</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
