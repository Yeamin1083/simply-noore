"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Menu,
  X,
  Heart,
  ShoppingBag,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  ChevronRight,
  PhoneCall,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { QuickSearchModal } from "@/components/search/QuickSearchModal";

export function Navbar() {
  const pathname = usePathname();
  const {
    theme,
    toggleTheme,
    lang,
    toggleLang,
    cartCount,
    wishlist,
    setIsCartOpen,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHide, setIsHide] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 20);

      if (y > lastY + 8 && y > 140) {
        setIsHide(true);
      } else if (y < lastY - 8 || y < 140) {
        setIsHide(false);
      }
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (cartCount > 0) {
      setIsPopping(true);
      const t = setTimeout(() => setIsPopping(false), 300);
      return () => clearTimeout(t);
    }
  }, [cartCount]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.documentElement.classList.add("lock");
    } else {
      document.documentElement.classList.remove("lock");
    }
    return () => document.documentElement.classList.remove("lock");
  }, [mobileMenuOpen]);

  // Separate Admin navigation from Storefront navigation (after all hooks)
  if (pathname?.includes("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 pointer-events-none px-3 sm:px-6 pt-3 sm:pt-4 ${
          isHide ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <nav
          className={`pointer-events-auto max-w-6xl mx-auto rounded-full transition-all duration-300 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 ${
            isScrolled
              ? "bg-[#1C2620]/90 dark:bg-[#121614]/90 text-white shadow-2xl backdrop-blur-xl border border-white/15 dark:border-white/10"
              : "bg-[#24332A]/85 dark:bg-[#141816]/85 text-[#F6F3EA] dark:text-[#F7F7F4] shadow-xl backdrop-blur-lg border border-white/10"
          }`}
          aria-label="Main Navigation"
        >
          {/* Left: Mobile Menu Trigger + Desktop Nav Links */}
          <div className="flex items-center gap-1 sm:gap-6">
            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 text-[12px] font-medium tracking-[0.14em] uppercase">
              <Link
                href="/women"
                className={`transition-colors hover:text-accent dark:hover:text-[#DFCA9B] relative py-1 ${
                  pathname === "/women" ? "text-accent dark:text-[#DFCA9B] font-semibold" : "opacity-90"
                }`}
              >
                {lang === "bn" ? "নারী" : "Women"}
                {pathname === "/women" && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent dark:bg-[#DFCA9B] rounded-full" />
                )}
              </Link>

              <Link
                href="/shop"
                className={`transition-colors hover:text-accent dark:hover:text-[#DFCA9B] relative py-1 ${
                  pathname === "/shop" ? "text-accent dark:text-[#DFCA9B] font-semibold" : "opacity-90"
                }`}
              >
                {lang === "bn" ? "কালেকশন" : "Collections"}
                {pathname === "/shop" && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent dark:bg-[#DFCA9B] rounded-full" />
                )}
              </Link>

              <Link
                href="/journal"
                className={`transition-colors hover:text-accent dark:hover:text-[#DFCA9B] relative py-1 ${
                  pathname === "/journal" ? "text-accent dark:text-[#DFCA9B] font-semibold" : "opacity-90"
                }`}
              >
                {lang === "bn" ? "জার্নাল" : "Journal"}
                {pathname === "/journal" && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent dark:bg-[#DFCA9B] rounded-full" />
                )}
              </Link>

              <Link
                href="/style-finder"
                className="inline-flex items-center gap-1 text-[#DFCA9B] hover:text-white transition-colors"
              >
                <Sparkles className="w-3 h-3 text-[#DFCA9B]" />
                <span>{lang === "bn" ? "স্টাইল এডিট" : "Edit Finder"}</span>
              </Link>
            </div>
          </div>

          {/* Center: Iconic Luxury Logo */}
          <Link
            href="/"
            className="font-serif text-2xl sm:text-3xl font-medium tracking-tight hover:opacity-90 transition-opacity flex items-center justify-center py-0.5"
            aria-label="Simply Nooré Homepage"
          >
            <span>Simply</span>
            <em className="font-serif italic font-normal ml-1.5 text-accent dark:text-[#DFCA9B]">Nooré</em>
          </Link>

          {/* Right: Curated Utility Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Quick Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 sm:p-2.5 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Search collections"
              title="Search atelier collections"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="hidden sm:inline-flex items-center text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
              aria-label="Switch language"
            >
              {lang === "en" ? "EN | বাং" : "বাং | EN"}
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-full hover:bg-white/10 transition-transform active:scale-90"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-[#DFCA9B]" />
              ) : (
                <Sun className="w-4 h-4 text-amber-300" />
              )}
            </button>

            {/* Admin Badge link (Desktop) */}
            <Link
              href="/admin"
              className="hidden xl:inline-flex items-center text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/20 hover:bg-white/10 opacity-75 hover:opacity-100 transition-opacity"
              title="Atelier Admin Portal"
            >
              Admin
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden sm:flex relative p-2 sm:p-2.5 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Wishlist"
              title="Saved Pieces"
            >
              <Heart
                className="w-4 h-4"
                fill={wishlist.length > 0 ? "currentColor" : "none"}
              />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#DFCA9B] text-espresso font-bold text-[9px] rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Open your selection bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span
                  className={`absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-[#DFCA9B] text-[#0C0F0E] font-bold text-[10px] rounded-full flex items-center justify-center shadow-lg transition-transform ${
                    isPopping ? "scale-125" : "scale-100"
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE FULL-EXPERIENCE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm h-full bg-surface dark:bg-[#121614] text-text border-r border-border shadow-2xl flex flex-col justify-between p-6 z-10 animate-in slide-in-from-left duration-300 overflow-y-auto">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-border/60">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-2xl font-medium"
                >
                  Simply <em className="italic text-accent-ink dark:text-[#DFCA9B]">Nooré</em>
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-muted"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Search Bar inside Mobile Drawer */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-surface-2/60 border border-border/60 text-muted text-xs tracking-wide my-6 hover:text-text"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 opacity-70" />
                  <span>{lang === "bn" ? "পোশাক বা ফেব্রিক খুঁজুন..." : "Search pieces or fabrics..."}</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
                  Find
                </span>
              </button>

              {/* Navigation Links */}
              <nav className="space-y-1 text-sm tracking-wide">
                <Link
                  href="/women"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-2/60 font-medium transition-colors"
                >
                  <span>{lang === "bn" ? "নারী সমগ্র সম্ভার" : "Women (Full Edit)"}</span>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </Link>

                <Link
                  href="/category/abayas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-2/60 transition-colors"
                >
                  <span className="pl-2">{lang === "bn" ? "আবায়া কালেকশন" : "Abayas & Robes"}</span>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </Link>

                <Link
                  href="/category/three-piece-sets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-2/60 transition-colors"
                >
                  <span className="pl-2">{lang === "bn" ? "থ্রি পিস সেট" : "Three Piece Sets"}</span>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </Link>

                <Link
                  href="/category/corsets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-2/60 transition-colors"
                >
                  <span className="pl-2">{lang === "bn" ? "করসেট ও বেল্ট" : "Corsets & Belts"}</span>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </Link>

                <Link
                  href="/style-finder"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-2/60 text-accent-ink dark:text-[#DFCA9B] font-medium transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{lang === "bn" ? "স্টাইল ফাইন্ডার ✦" : "Nooré Style Finder ✦"}</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/journal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-2/60 transition-colors"
                >
                  <span>{lang === "bn" ? "এটেলিয়ার জার্নাল" : "Atelier Journal"}</span>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </Link>

                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-2/60 transition-colors"
                >
                  <span>{lang === "bn" ? "পছন্দের তালিকা" : "Wishlist"}</span>
                  <span className="text-xs text-muted">({wishlist.length})</span>
                </Link>

                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-2/60 transition-colors"
                >
                  <span>{lang === "bn" ? "অর্ডার ট্র্যাক করুন" : "Track Order"}</span>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </Link>
              </nav>
            </div>

            {/* Bottom Controls */}
            <div className="pt-6 border-t border-border/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted">
                  {lang === "bn" ? "ভাষা পরিবর্তন:" : "Language:"}
                </span>
                <button
                  onClick={toggleLang}
                  className="px-3 py-1 rounded-full border border-border text-xs font-medium hover:bg-surface-2"
                >
                  {lang === "en" ? "English" : "বাংলা"}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted">
                  {lang === "bn" ? "থিম মোড:" : "Appearance:"}
                </span>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs font-medium hover:bg-surface-2"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="w-3.5 h-3.5" />
                      <span>Dark Noir</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5" />
                      <span>Light Ivory</span>
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp Concierge direct button */}
              <a
                href="https://wa.me/8801700000000?text=Hi%2C%20I'd%20like%20help%20choosing%20an%20outfit."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-espresso text-bg dark:bg-[#DFCA9B] dark:text-[#0C0F0E] text-xs uppercase tracking-widest font-semibold shadow-md"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Atelier Concierge</span>
              </a>

              <div className="text-center pt-1">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[10px] font-mono text-muted uppercase tracking-widest hover:underline"
                >
                  Atelier Admin Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK SEARCH MODAL */}
      <QuickSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
