"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { assetPath } from "@/lib/utils";

const VIDEOS = [
  {
    id: 0,
    src: assetPath("/videos/hero-editorial-1.mp4"),
  },
  {
    id: 1,
    src: assetPath("/videos/hero-editorial-2.mp4"),
  },
];

export function CinematicVideoPlayer() {
  const { lang } = useStore();
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  // Auto-play safely with browser autoplay compliance (muted, no controls)
  useEffect(() => {
    const playSafe = (v: HTMLVideoElement | null) => {
      if (v) {
        v.muted = true;
        v.play().catch(() => {
          v.muted = true;
          v.play().catch(() => {});
        });
      }
    };

    playSafe(videoRef1.current);
    playSafe(videoRef2.current);
  }, []);

  // Seamless auto-transition between both videos every 8.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideoIdx((prev) => (prev === 0 ? 1 : 0));
    }, 8500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 md:px-6 my-6 sm:my-10 select-none">
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[360px] sm:min-h-[460px] lg:min-h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-black border border-border/40 dark:border-white/10 group flex items-center justify-center">
        {/* Layer 1: Video 1 */}
        <video
          ref={videoRef1}
          src={VIDEOS[0].src}
          playsInline
          autoPlay
          muted
          loop
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: activeVideoIdx === 0 ? 1 : 0,
            zIndex: activeVideoIdx === 0 ? 2 : 1,
          }}
        />

        {/* Layer 2: Video 2 */}
        <video
          ref={videoRef2}
          src={VIDEOS[1].src}
          playsInline
          autoPlay
          muted
          loop
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: activeVideoIdx === 1 ? 1 : 0,
            zIndex: activeVideoIdx === 1 ? 2 : 1,
          }}
        />

        {/* Center: Subtle, dim Shop Collection button that lights up on hover/focus */}
        <div className="relative z-20 flex items-center justify-center">
          <Link
            href="/shop"
            className="group/btn relative inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full bg-black/35 hover:bg-black/80 active:bg-black/90 backdrop-blur-md text-white/60 hover:text-white border border-white/20 hover:border-[#DFCA9B] opacity-40 group-hover:opacity-90 hover:!opacity-100 text-xs sm:text-sm uppercase tracking-[0.22em] font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl"
            aria-label="Shop Full Collection"
          >
            <span>{lang === "bn" ? "কালেকশন দেখুন" : "Shop Collection"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white/60 group-hover/btn:text-[#DFCA9B] transition-all duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
