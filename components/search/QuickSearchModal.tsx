"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { PRODUCTS } from "@/lib/data";
import { formatBDT } from "@/lib/utils";
import { useStore } from "@/lib/store";

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { lang, setQuickViewProduct, products } = useStore();
  const allProducts = products && products.length > 0 ? products : PRODUCTS;

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("lock");
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.documentElement.classList.remove("lock");
    }
    return () => document.documentElement.classList.remove("lock");
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? allProducts.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          (p.titleBn && p.titleBn.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          (p.fabricName && p.fabricName.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
          (p.occasions && p.occasions.some((o) => o.toLowerCase().includes(q)))
        );
      })
    : allProducts.slice(0, 4);

  const popularKeywords = ["Abayas", "Korean Nida", "Three Piece", "Corsets", "Eid Edit", "Linen"];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search Atelier Collections"
        className="relative w-full max-w-2xl bg-surface/95 dark:bg-[#141816]/95 border border-border/80 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60 dark:border-white/10 bg-bg/40">
          <Search className="w-5 h-5 text-accent-ink dark:text-accent opacity-80" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "bn" ? "পোশাক, ফেব্রিক বা ক্যাটাগরি খুঁজুন..." : "Search pieces, fabrics, or edits..."}
            className="flex-1 bg-transparent border-0 outline-none text-text dark:text-gray-100 placeholder:text-muted text-base tracking-wide"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted transition-colors"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-widest px-2.5 py-1 rounded-full border border-border text-muted hover:text-text transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-3 border-b border-border/40 dark:border-white/5 bg-surface-2/30 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted tracking-wider uppercase text-[10px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-accent-ink dark:text-accent" />
            {lang === "bn" ? "জনপ্রিয়:" : "Trending:"}
          </span>
          {popularKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setQuery(kw)}
              className="px-2.5 py-1 rounded-full bg-surface dark:bg-[#1B211E] hover:bg-accent/20 border border-border/50 text-text/80 text-[11px] transition-colors"
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-muted">
              <p className="text-sm">
                {lang === "bn"
                  ? `"${query}" এর জন্য কোনো পোশাক পাওয়া যায়নি`
                  : `No pieces found matching "${query}"`}
              </p>
              <p className="text-xs mt-1 opacity-70">
                {lang === "bn"
                  ? "অন্য কোনো শব্দ দিয়ে চেষ্টা করুন যেমন Abaya, Nida বা Silk"
                  : "Try searching for 'Abaya', 'Nida', 'Three Piece', or 'Silk'"}
              </p>
            </div>
          ) : (
            <>
              <div className="px-2 pb-1 text-[11px] uppercase tracking-widest text-muted">
                {query ? (lang === "bn" ? "ফলাফল" : "Results") : (lang === "bn" ? "জনপ্রিয় পোশাক" : "Featured Pieces")}
              </div>
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-2/60 dark:hover:bg-[#1B211E] transition-colors group"
                >
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3.5 flex-1 min-w-0"
                  >
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0 border border-border/40">
                      <img
                        src={p.variants[0]?.image || ""}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif text-base font-medium text-text dark:text-gray-100 group-hover:text-accent-ink dark:group-hover:text-accent truncate">
                        {lang === "bn" ? p.titleBn : p.title}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {p.fabricName} · {p.categoryLabel}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-3 pl-3">
                    <span className="font-serif text-sm font-semibold text-text dark:text-champagne">
                      {formatBDT(p.price)}
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        setQuickViewProduct(p);
                      }}
                      className="px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full border border-border/80 hover:bg-accent-ink hover:text-white dark:hover:bg-accent dark:hover:text-bg transition-colors"
                    >
                      {lang === "bn" ? "প্রিভিউ" : "Quick View"}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-border/40 dark:border-white/5 bg-surface-2/20 text-center">
          <Link
            href="/shop"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-accent-ink dark:text-accent hover:underline font-medium"
          >
            <span>{lang === "bn" ? "সকল সম্ভার দেখুন" : "View Entire Collection"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
