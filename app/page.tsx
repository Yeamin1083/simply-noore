"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Plus,
  Sparkles,
  ShoppingBag,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  RotateCcw,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { PRODUCTS, CATEGORIES, MOMENTS } from "@/lib/data";
import { formatBDT } from "@/lib/utils";
import { AnnouncementRibbon } from "@/components/home/AnnouncementRibbon";
import { CinematicVideoPlayer } from "@/components/home/CinematicVideoPlayer";

interface EditItem {
  title: string;
  price: number;
  image: string;
  tag: string;
}

const EDIT_DATA: Record<string, EditItem[]> = {
  Everyday: [
    {
      title: "Linen-Blend Fluid Abaya",
      price: 4850,
      image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=900&auto=format&fit=crop",
      tag: "Statement Piece",
    },
    {
      title: "Soft Modal Jersey Hijab",
      price: 750,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop",
      tag: "The Match",
    },
    {
      title: "Everyday Structured Tote",
      price: 2900,
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop",
      tag: "Finishing Touch",
    },
  ],
  Office: [
    {
      title: "Executive Minimalist Crepe Abaya",
      price: 5400,
      image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=900&auto=format&fit=crop",
      tag: "Statement Piece",
    },
    {
      title: "Georgette Hijab with Magnet Snaps",
      price: 850,
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=900&auto=format&fit=crop",
      tag: "The Match",
    },
    {
      title: "Slim Document Folio in Ink",
      price: 2400,
      image: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=900&auto=format&fit=crop",
      tag: "Finishing Touch",
    },
  ],
  Eid: [
    {
      title: "Rawdah Embroidered Nida Abaya",
      price: 7800,
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=900&auto=format&fit=crop",
      tag: "Statement Piece",
    },
    {
      title: "Tonal Silk Chiffon Hijab",
      price: 1200,
      image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=900&auto=format&fit=crop",
      tag: "The Match",
    },
    {
      title: "Embossed Evening Minaudière",
      price: 3200,
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop",
      tag: "Finishing Touch",
    },
  ],
  Wedding: [
    {
      title: "Zeina Layered Kaftan Ensemble",
      price: 10500,
      image: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=900&auto=format&fit=crop",
      tag: "Statement Piece",
    },
    {
      title: "Beaded Edge Medina Scarf",
      price: 1650,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop",
      tag: "The Match",
    },
    {
      title: "Atelier Champagne Gold Waist Cincher",
      price: 3600,
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop",
      tag: "Finishing Touch",
    },
  ],
  Ramadan: [
    {
      title: "Light Nida Cocoon Abaya",
      price: 4600,
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=900&auto=format&fit=crop",
      tag: "Statement Piece",
    },
    {
      title: "Organic Cotton Prayer Set",
      price: 2500,
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=900&auto=format&fit=crop",
      tag: "The Match",
    },
    {
      title: "Velvet Tasbih Pouch & Scent",
      price: 1100,
      image: "https://images.unsplash.com/photo-1513094735237-8f2714d57c13?q=80&w=900&auto=format&fit=crop",
      tag: "Finishing Touch",
    },
  ],
};

const LOOK_PIECES = [
  {
    name: "Pure Silk Chiffon Hijab",
    variant: "Oat Sand · 185×70 cm",
    price: 950,
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "The Sage Drape Abaya",
    variant: "Sage Mist · Korean Nida Crepe",
    price: 4850,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Architectural Structured Bag",
    variant: "Deep Obsidian Leather",
    price: 3100,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop",
  },
];

export default function HomePage() {
  const { lang, addToCart, setQuickViewProduct } = useStore();

  // Swatch / Tone state for hero piece
  const [activeSwatch, setActiveSwatch] = useState(0);
  const swatches = [
    { name: "Sage Mist", hex: "#8CA283" },
    { name: "Warm Oat", hex: "#C9B696" },
    { name: "Smoked Obsidian", hex: "#26302A" },
  ];

  // Active Look Piece
  const [activeLookPiece, setActiveLookPiece] = useState(1);
  const [lookAdded, setLookAdded] = useState(false);

  // Edit Finder
  const [activeOccasion, setActiveOccasion] = useState("Everyday");

  // Countdown timer for Drop
  const [timeLeft, setTimeLeft] = useState({ h: "03", m: "42", s: "19" });

  // Word Reveal scroll progress
  const [wordProgress, setWordProgress] = useState(0);

  // Statement section intersection
  const [statementIn, setStatementIn] = useState(false);
  const statementRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  // Countdown effect
  useEffect(() => {
    const end = Date.now() + (3 * 3600 + 42 * 60 + 19) * 1000;
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = () => {
      const diff = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setTimeLeft({
        h: pad(Math.floor(diff / 3600)),
        m: pad(Math.floor((diff % 3600) / 60)),
        s: pad(diff % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll effect for word reveal & statement
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;

      // Word reveal calculation
      const wrEl = document.getElementById("wr1");
      if (wrEl) {
        const rect = wrEl.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.88 - rect.top) / (vh * 0.55)));
        setWordProgress(p);
      }

      // Statement section reveal
      if (statementRef.current) {
        const r = statementRef.current.getBoundingClientRect();
        if (r.top < vh * 0.8 && r.bottom > 0) {
          setStatementIn(true);
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const editorialText =
    "We design for the woman who dresses with intention. Every abaya is cut for movement, draped for calm and made to be worn from the first prayer of the day to the last conversation of the night.";
  const editorialWords = editorialText.split(" ");

  const handleAddHeroPiece = () => {
    const heroProduct = PRODUCTS[0];
    const variant = heroProduct.variants[activeSwatch] || heroProduct.variants[0];

    addToCart({
      productId: heroProduct.id,
      variantId: variant.id,
      slug: heroProduct.slug,
      title: heroProduct.title,
      colorName: variant.colorName,
      size: "54",
      price: heroProduct.price,
      image: variant.image,
      quantity: 1,
    });
  };

  const handleAddLook = () => {
    LOOK_PIECES.forEach((piece, idx) => {
      addToCart({
        productId: `bundle-piece-${idx}`,
        variantId: `bundle-var-${idx}`,
        slug: "the-sage-drape-abaya",
        title: piece.name,
        colorName: piece.variant,
        size: "Standard",
        price: piece.price,
        image: piece.image,
        quantity: 1,
      });
    });

    setLookAdded(true);
    setTimeout(() => setLookAdded(false), 2500);
  };

  const scrollRail = (offset: number) => {
    if (railRef.current) {
      railRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative pt-20 sm:pt-24">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <AnnouncementRibbon />

      {/* 2. HERO HEADLINE INTRO */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Background Subtle Luxury Glow */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent/15 dark:bg-[#DFCA9B]/10 rounded-full blur-[140px] pointer-events-none -z-10"
        />

        {/* <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border/80 dark:border-white/15 bg-surface/60 dark:bg-white/5 backdrop-blur-md text-[11px] uppercase tracking-[0.2em] font-semibold text-accent-ink dark:text-[#DFCA9B] mb-4">
          <Sparkles className="w-3 h-3 text-[#DFCA9B]" />
          <span>{lang === "bn" ? "ফার্স্ট লাইট এডিট ২০২৬" : "The First Light Edit · 2026"}</span>
        </div> */}

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-text leading-[1.08]">
          <span>{lang === "bn" ? "শালীনতা," : "Modesty,"}</span>{" "}
          <em className="italic font-normal text-accent-ink dark:text-[#DFCA9B]">
            {lang === "bn" ? "নতুন রূপে।" : "Redefined."}
          </em>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-muted max-w-xl mx-auto leading-relaxed">
          {lang === "bn"
            ? "চলাফেরার জন্য কাটা, প্রশান্তির জন্য ড্রেপ করা। ঢাকায় তৈরি আধুনিক ও অভিজাত শালীন পোশাক শিল্প।"
            : "Cut for movement, draped for calm. Sculptural abayas and three-piece duster ensembles crafted with intentional fluidity."}
        </p>
      </section>

      {/* 3. WIDESCREEN EDITORIAL CINEMA (PURE SEAMLESS VIDEO) */}
      <CinematicVideoPlayer />

      {/* 4. FEATURED ATELIER PIECE & CRAFTSMANSHIP */}
      <section className="relative py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-3xl bg-surface/70 dark:bg-[#141816]/70 border border-border/70 dark:border-white/10 backdrop-blur-xl">
          {/* Left: Product Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DFCA9B]" />
              <span>01 / Featured Hero Piece</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-text">
              {lang === "bn" ? PRODUCTS[0].titleBn : PRODUCTS[0].title}
            </h2>

            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              {lang === "bn" ? PRODUCTS[0].descriptionBn : PRODUCTS[0].description}
            </p>

            {/* Price & Fabric */}
            <div className="flex items-center gap-4 pt-1">
              <span className="font-serif text-2xl sm:text-3xl font-medium text-text dark:text-[#DFCA9B]">
                {formatBDT(PRODUCTS[0].price)}
              </span>
              <span className="text-xs uppercase tracking-wider text-muted">
                {PRODUCTS[0].fabricName}
              </span>
            </div>

            {/* Swatch Switcher */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-muted block mb-2">
                {lang === "bn" ? "রং নির্বাচন:" : "Palette Shade:"}{" "}
                <strong className="text-text font-medium">{swatches[activeSwatch].name}</strong>
              </span>
              <div className="flex items-center gap-3">
                {swatches.map((swatch, idx) => (
                  <button
                    key={swatch.name}
                    onClick={() => setActiveSwatch(idx)}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      activeSwatch === idx
                        ? "ring-2 ring-offset-2 ring-espresso dark:ring-[#DFCA9B] scale-110"
                        : "opacity-75 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                    aria-label={swatch.name}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={handleAddHeroPiece}
                className="h-11 px-6 rounded-full bg-espresso text-bg dark:bg-[#DFCA9B] dark:text-[#0C0F0E] font-medium text-xs uppercase tracking-widest shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === "bn" ? "ব্যাগে যোগ করুন" : "Add to Selection"}</span>
              </button>

              <button
                onClick={() => setQuickViewProduct(PRODUCTS[0])}
                className="h-11 px-5 rounded-full border border-border hover:border-text text-text font-medium text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all hover:bg-black/5 dark:hover:bg-white/5"
              >
                <Eye className="w-4 h-4" />
                <span>{lang === "bn" ? "প্রিভিউ" : "Quick View"}</span>
              </button>

              <Link
                href={`/product/${PRODUCTS[0].slug}`}
                className="h-11 px-5 rounded-full text-text hover:text-accent-ink dark:hover:text-[#DFCA9B] text-xs uppercase tracking-widest font-medium flex items-center gap-1 transition-colors"
              >
                <span>{lang === "bn" ? "বিস্তারিত" : "Details"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: Rich Garment Photography Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/40 group shadow-md">
              <img
                src={PRODUCTS[0].variants[activeSwatch]?.image || PRODUCTS[0].variants[0].image}
                alt={PRODUCTS[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-wider">
                Full Silhouette
              </span>
            </div>

            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/40 group shadow-md">
              <img
                src={PRODUCTS[1].variants[0].image}
                alt="Ensemble Layering"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-wider">
                Cadence & Drape
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EDITORIAL WORD REVEAL SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-border/40 bg-surface/30 dark:bg-[#101412]/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Editorial Arch Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border/60 group">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop"
                alt="Editorial Silhouette"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-surface/90 dark:bg-[#121614]/90 backdrop-blur-md text-text text-[10px] uppercase tracking-widest font-semibold">
                02 / Atelier Silhouette
              </span>
            </div>
          </div>

          {/* Word Reveal Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-ink dark:text-[#DFCA9B]">
              {lang === "bn" ? "তিনটি অনুভূতিতে" : "A feeling, in three notes"}
            </p>

            <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-text leading-tight">
              {lang === "bn" ? "পোশাকের গভীরতা ও প্রশান্তি।" : "The Quiet Art of Draping."}
            </h2>

            {/* Dynamic Word Reveal Paragraph */}
            <p className="font-serif text-xl sm:text-2xl md:text-3xl leading-relaxed text-text" id="wr1">
              <span className="sr-only">{editorialText}</span>
              {editorialWords.map((word, i) => {
                const n = editorialWords.length;
                const opacity = Math.min(1, Math.max(0.25, 0.25 + 0.75 * (wordProgress * n * 1.1 - i)));
                return (
                  <span
                    key={i}
                    className="transition-opacity duration-300 inline-block mr-1.5"
                    style={{ opacity }}
                  >
                    {word}
                  </span>
                );
              })}
            </p>

            {/* Three Notes Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <span className="px-4 py-2 rounded-full border border-border/80 text-xs uppercase tracking-widest text-muted">
                Drape
              </span>
              <span className="px-4 py-2 rounded-full border border-border/80 text-xs uppercase tracking-widest text-muted">
                Stillness
              </span>
              <span className="px-4 py-2 rounded-full border border-border/80 text-xs uppercase tracking-widest text-muted">
                Light
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOP THE LOOK (WEAR IT WHOLE) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Ensemble Model Photography with Interactive Pinned Hotspots */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-border/60">
              <img
                src={LOOK_PIECES[activeLookPiece].image}
                alt="Model Ensemble"
                className="w-full h-full object-cover transition-all duration-700"
              />

              {/* Hotspot 01: Hijab */}
              <button
                onClick={() => setActiveLookPiece(0)}
                className={`absolute top-[18%] left-[50%] -translate-x-1/2 w-8 h-8 rounded-full border border-white shadow-xl flex items-center justify-center text-xs font-bold transition-all ${
                  activeLookPiece === 0
                    ? "bg-[#DFCA9B] text-black scale-125"
                    : "bg-black/60 text-white hover:scale-110"
                }`}
                aria-label="Hijab Piece"
              >
                01
              </button>

              {/* Hotspot 02: Abaya */}
              <button
                onClick={() => setActiveLookPiece(1)}
                className={`absolute top-[52%] left-[46%] -translate-x-1/2 w-8 h-8 rounded-full border border-white shadow-xl flex items-center justify-center text-xs font-bold transition-all ${
                  activeLookPiece === 1
                    ? "bg-[#DFCA9B] text-black scale-125"
                    : "bg-black/60 text-white hover:scale-110"
                }`}
                aria-label="Abaya Piece"
              >
                02
              </button>

              {/* Hotspot 03: Bag */}
              <button
                onClick={() => setActiveLookPiece(2)}
                className={`absolute top-[78%] left-[28%] -translate-x-1/2 w-8 h-8 rounded-full border border-white shadow-xl flex items-center justify-center text-xs font-bold transition-all ${
                  activeLookPiece === 2
                    ? "bg-[#DFCA9B] text-black scale-125"
                    : "bg-black/60 text-white hover:scale-110"
                }`}
                aria-label="Bag Piece"
              >
                03
              </button>
            </div>
          </div>

          {/* Right: Look Pieces Bundle Selector */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-ink dark:text-[#DFCA9B] mb-2">
                03 / Complete Ensemble
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-text">
                Wear it <em>whole.</em>
              </h2>
              <p className="text-sm text-muted mt-2">
                Tap a numbered point on the silhouette, or select a piece below. Add the harmonized look in one tap.
              </p>
            </div>

            {/* Piece Buttons List */}
            <div className="space-y-3">
              {LOOK_PIECES.map((piece, idx) => {
                const isActive = activeLookPiece === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveLookPiece(idx)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                      isActive
                        ? "bg-surface-2/80 dark:bg-[#1B211E] border-espresso dark:border-[#DFCA9B] shadow-sm"
                        : "bg-surface/50 dark:bg-white/5 border-border hover:border-text/40"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-14 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0 border border-border/40">
                        <img
                          src={piece.image}
                          alt={piece.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <b className="text-sm font-serif font-medium text-text block">{piece.name}</b>
                        <small className="text-xs text-muted block">{piece.variant}</small>
                      </div>
                    </div>
                    <span className="font-serif text-base font-medium text-text dark:text-[#DFCA9B]">
                      {formatBDT(piece.price)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bundle Checkout Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border/60">
              <div>
                <div className="font-serif text-3xl font-medium text-text dark:text-[#DFCA9B]">
                  ৳8,900
                </div>
                <small className="text-xs uppercase tracking-wider text-muted">
                  Curated 3-Piece Bundle Total
                </small>
              </div>

              <button
                onClick={handleAddLook}
                className="h-12 px-7 rounded-full bg-espresso text-bg dark:bg-[#DFCA9B] dark:text-[#0C0F0E] font-medium text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                {lookAdded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Entire Look</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHOP BY DEPARTMENT */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-surface/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-ink dark:text-[#DFCA9B] mb-1">
                04 / Departments
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-text">
                Shop by <em>department</em>
              </h2>
            </div>

            <Link
              href="/women"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border hover:border-text text-xs uppercase tracking-widest font-semibold transition-colors w-fit"
            >
              <span>{lang === "bn" ? "সকল দেখুন" : "View All"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative rounded-3xl overflow-hidden bg-surface dark:bg-[#141816] border border-border/60 hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl font-medium text-text group-hover:text-accent-ink dark:group-hover:text-[#DFCA9B] transition-colors flex items-center justify-between">
                    <span>{lang === "bn" ? cat.nameBn : cat.name}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-muted mt-2 leading-relaxed">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FIND YOUR NOORÉ EDIT */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-ink dark:text-[#DFCA9B] mb-1">
              05 / Interactive Stylist
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-text">
              What are you <em>dressing for?</em>
            </h2>
            <p className="text-sm text-muted mt-2">
              Select an occasion and our atelier curates the statement piece, matching drape, and finishing note.
            </p>

            {/* Occasion Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-6">
              {Object.keys(EDIT_DATA).map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setActiveOccasion(occ)}
                  className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${
                    activeOccasion === occ
                      ? "bg-espresso text-bg dark:bg-[#DFCA9B] dark:text-[#0C0F0E] shadow-sm scale-105"
                      : "bg-surface-2/60 dark:bg-white/5 border border-border/60 text-muted hover:text-text hover:bg-black/5"
                  }`}
                  aria-pressed={activeOccasion === occ}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* 3-Piece Curated Result Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            {EDIT_DATA[activeOccasion].map((item, i) => (
              <div
                key={`${activeOccasion}-${i}`}
                className="rounded-2xl overflow-hidden bg-surface dark:bg-[#141816] border border-border/60 p-4 space-y-3 group"
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-2">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#DFCA9B] font-semibold block">
                    0{i + 1} · {item.tag}
                  </span>
                  <h4 className="font-serif text-lg font-medium text-text truncate">{item.title}</h4>
                  <p className="font-serif text-sm font-semibold text-text dark:text-[#DFCA9B]">
                    {formatBDT(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SHOP BY MOMENT (HORIZONTAL RAIL) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-surface/20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-ink dark:text-[#DFCA9B] mb-1">
                06 / Moments
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-text">
                Collected in <em>soft light.</em>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollRail(-340)}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-surface-2 transition-colors"
                aria-label="Previous moments"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollRail(340)}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-surface-2 transition-colors"
                aria-label="Next moments"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Rail */}
          <div
            ref={railRef}
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
          >
            {MOMENTS.map((moment) => (
              <Link
                key={moment.id}
                href={`/moment/${moment.slug}`}
                className="min-w-[260px] sm:min-w-[300px] snap-start rounded-3xl overflow-hidden bg-surface dark:bg-[#141816] border border-border/60 group shadow-sm hover:shadow-md transition-all flex-shrink-0"
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img
                    src={moment.image}
                    alt={moment.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 left-3 text-white font-serif text-xl font-medium">
                    {lang === "bn" ? moment.nameBn : moment.name}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted line-clamp-2">{moment.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STATEMENT SECTION */}
      <section
        ref={statementRef}
        className="relative py-24 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#101412] dark:bg-[#080B0A] text-white text-center overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#DFCA9B]/15 via-transparent to-transparent pointer-events-none"
        />

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#DFCA9B] font-semibold">
            07 / For moments that stay
          </p>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-tight">
            Leave a little of yourself in{" "}
            <em className="italic font-normal text-[#DFCA9B]">every room.</em>
          </h2>

          <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto">
            Explore our curated silhouettes and personalized style edit.
          </p>

          <div className="pt-4">
            <Link
              href="/style-finder"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#DFCA9B] text-[#0C0F0E] font-semibold text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <span>{lang === "bn" ? "আপনার এডিট খুঁজুন" : "Find Your Edit"}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. NOORÉ DROPS (COUNTDOWN) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center p-8 sm:p-12 rounded-3xl bg-surface dark:bg-[#141816] border border-border/80 dark:border-white/10 shadow-lg">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent-ink dark:text-[#DFCA9B]">
              08 / Nooré Drops
            </p>

            <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-text">
              The First Light <em>Drop</em>
            </h2>

            <p className="text-sm text-muted">
              Eight pieces, one quiet palette. Crafted in limited quantities at our Dhaka atelier.
            </p>

            {/* Countdown Clock */}
            <div className="flex items-center gap-3 sm:gap-4 font-mono text-center">
              <div className="p-3 sm:p-4 rounded-2xl bg-surface-2 dark:bg-[#1B211E] border border-border min-w-[70px]">
                <span className="text-2xl sm:text-3xl font-bold text-text dark:text-[#DFCA9B] block">
                  {timeLeft.h}
                </span>
                <small className="text-[10px] uppercase text-muted tracking-wider">Hours</small>
              </div>
              <span className="text-xl font-bold text-muted">:</span>
              <div className="p-3 sm:p-4 rounded-2xl bg-surface-2 dark:bg-[#1B211E] border border-border min-w-[70px]">
                <span className="text-2xl sm:text-3xl font-bold text-text dark:text-[#DFCA9B] block">
                  {timeLeft.m}
                </span>
                <small className="text-[10px] uppercase text-muted tracking-wider">Minutes</small>
              </div>
              <span className="text-xl font-bold text-muted">:</span>
              <div className="p-3 sm:p-4 rounded-2xl bg-surface-2 dark:bg-[#1B211E] border border-border min-w-[70px]">
                <span className="text-2xl sm:text-3xl font-bold text-text dark:text-[#DFCA9B] block">
                  {timeLeft.s}
                </span>
                <small className="text-[10px] uppercase text-muted tracking-wider">Seconds</small>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/drops"
                className="inline-flex items-center gap-2 h-11 px-7 rounded-full bg-espresso text-bg dark:bg-[#DFCA9B] dark:text-[#0C0F0E] font-medium text-xs uppercase tracking-widest shadow-md hover:scale-105 transition-all"
              >
                <span>{lang === "bn" ? "আমাকে মনে করিয়ে দিন" : "Remind Me"}</span>
                <Plus className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative aspect-[3/4] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-border/60">
              <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=900&auto=format&fit=crop"
                alt="Drop Hero Silhouette"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-widest">
                Upcoming Atelier Release
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. TRUST & CONCIERGE GRID */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-surface/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-medium text-text">Cash on Delivery</h3>
            <p className="text-xs text-muted leading-relaxed">
              Pay upon doorstep inspection, or securely via bKash and Nagad.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-medium text-text">Priority Delivery</h3>
            <p className="text-xs text-muted leading-relaxed">
              Dhaka 24-48h dispatch. Nationwide delivery to all 64 districts.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-medium text-text">Exchanges & Care</h3>
            <p className="text-xs text-muted leading-relaxed">
              Easy 7-day size adjustments via Track Order portal.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-medium text-text">Atelier Concierge</h3>
            <p className="text-xs text-muted leading-relaxed">
              Direct personal styling consultations via WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border/60 bg-surface dark:bg-[#0E1110] text-text">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h4 className="font-serif text-base font-medium text-text">Collections</h4>
              <ul className="space-y-2 text-xs text-muted">
                <li><Link href="/category/abayas" className="hover:text-text">Abayas & Robes</Link></li>
                <li><Link href="/category/three-piece-sets" className="hover:text-text">Three Piece Sets</Link></li>
                <li><Link href="/category/corsets" className="hover:text-text">Corsets & Belts</Link></li>
                <li><Link href="/shop" className="hover:text-text">All Pieces</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-base font-medium text-text">Moments</h4>
              <ul className="space-y-2 text-xs text-muted">
                <li><Link href="/moment/eid" className="hover:text-text">Eid Soirée</Link></li>
                <li><Link href="/moment/wedding-guest" className="hover:text-text">Wedding Guest</Link></li>
                <li><Link href="/moment/ramadan" className="hover:text-text">Ramadan Nights</Link></li>
                <li><Link href="/moment/everyday" className="hover:text-text">Everyday Ease</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-base font-medium text-text">Client Care</h4>
              <ul className="space-y-2 text-xs text-muted">
                <li><Link href="/track-order" className="hover:text-text">Track Your Order</Link></li>
                <li><Link href="/size-guide" className="hover:text-text">Size & Length Guide</Link></li>
                <li><Link href="/delivery-returns" className="hover:text-text">Delivery & Returns</Link></li>
                <li><Link href="/contact" className="hover:text-text">Contact Atelier</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-base font-medium text-text">Atelier</h4>
              <ul className="space-y-2 text-xs text-muted">
                <li><Link href="/journal" className="hover:text-text">The Nooré Journal</Link></li>
                <li><Link href="/fabrics" className="hover:text-text">Our Fabrics & Silks</Link></li>
                <li><Link href="/about" className="hover:text-text">About the House</Link></li>
                <li><Link href="/privacy" className="hover:text-text">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/40 text-xs text-muted">
            <p>© 2026 Simply Nooré. Modesty, Redefined. Dhaka, Bangladesh.</p>
            <p>Priority courier service dispatched across all 64 districts.</p>
          </div>
        </div>
      </footer>

      {/* FLOATING CONCIERGE WHATSAPP TRIGGER */}
      <a
        href="https://wa.me/8801700000000?text=Hi%2C%20I'd%20like%20help%20choosing%20an%20outfit."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#1A2620] text-[#F7F7F4] dark:bg-[#DFCA9B] dark:text-[#0C0F0E] shadow-2xl border border-white/20 hover:scale-105 active:scale-95 transition-all text-xs font-semibold uppercase tracking-wider"
        aria-label="Contact Concierge"
      >
        <PhoneCall className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Concierge</span>
      </a>

      {/* REPLAY INTRO FLOATING TRIGGER */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          type="button"
          onClick={() => {
            try {
              sessionStorage.removeItem("sn-intro-seen");
            } catch (e) {}
            document.body.classList.remove("entered");
            window.location.reload();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/80 dark:bg-[#141816]/80 text-muted hover:text-text border border-border backdrop-blur-md text-[10px] uppercase tracking-wider transition-colors shadow-md"
          aria-label="Replay brand introduction"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Replay Intro</span>
        </button>
      </div>
    </div>
  );
}
