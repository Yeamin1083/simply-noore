"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { assetPath } from "@/lib/utils";

export function BrandReveal() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Check if previously seen in this session
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isFast, setIsFast] = useState(false);
  const [stars, setStars] = useState<Array<{ id: number; left: string; top: string; delay: string }>>([]);

  const isLeavingRef = useRef(false);
  const isPlayingRef = useRef(false);

  const finishReveal = useCallback((fast = false) => {
    if (isLeavingRef.current) return;
    isLeavingRef.current = true;
    setIsFast(fast);
    setIsLeaving(true);

    try {
      sessionStorage.setItem("sn-intro-seen", "true");
    } catch (e) {
      // Ignore storage errors
    }

    // Immediately trigger entering transition on page body
    document.body.classList.add("entered");
    document.documentElement.classList.remove("lock");

    // Remove intro from DOM after animation completes
    const exitDuration = fast ? 300 : 700;
    setTimeout(() => {
      setIsPlaying(false);
      isPlayingRef.current = false;
      document.body.classList.add("entered");
      document.documentElement.classList.remove("lock");
    }, exitDuration);
  }, []);

  useEffect(() => {
    // If not home, unlock immediately
    if (!isHome) {
      document.body.classList.add("entered");
      document.documentElement.classList.remove("lock");
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    // Check session storage
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem("sn-intro-seen") === "true";
    } catch (e) {
      alreadySeen = false;
    }

    if (alreadySeen) {
      document.body.classList.add("entered");
      document.documentElement.classList.remove("lock");
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    // First time in session: run reveal
    setIsPlaying(true);
    isPlayingRef.current = true;
    document.documentElement.classList.add("lock");
    document.body.classList.remove("entered");

    // Generate starry particles
    const starList = [];
    for (let i = 0; i < 20; i++) {
      starList.push({
        id: i,
        left: `${(i * 5.1 + Math.random() * 3).toFixed(1)}%`,
        top: `${(Math.random() * 90).toFixed(1)}%`,
        delay: `${(i * 0.2).toFixed(1)}s`,
      });
    }
    setStars(starList);

    // Auto swap-up after 2.6s
    const autoTimer = setTimeout(() => {
      finishReveal(false);
    }, 2600);

    // Failsafe timer: guarantee site is unlocked after 3.4s
    const failsafeTimer = setTimeout(() => {
      finishReveal(true);
    }, 3400);

    // Event listeners to skip on any user gesture (click, scroll, key, touch)
    const handleGesture = () => finishReveal(true);
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" ||
        e.key === "Enter" ||
        e.key === " " ||
        e.key === "ArrowDown" ||
        e.key === "ArrowRight"
      ) {
        finishReveal(true);
      }
    };

    window.addEventListener("wheel", handleGesture, { passive: true });
    window.addEventListener("touchmove", handleGesture, { passive: true });
    window.addEventListener("keydown", handleKey);

    return () => {
      clearTimeout(autoTimer);
      clearTimeout(failsafeTimer);
      window.removeEventListener("wheel", handleGesture);
      window.removeEventListener("touchmove", handleGesture);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isHome, finishReveal]);

  if (!isPlaying) return null;

  const title = "Simply Nooré";

  return (
    <div
      className={`intro ${isLeaving ? "leave" : ""} ${isFast ? "fast" : ""}`}
      id="intro"
      role="dialog"
      aria-modal="true"
      aria-label="Simply Nooré Welcome"
      onClick={() => finishReveal(true)}
      style={{ cursor: "pointer" }}
    >
      {/* Twinkling starlight dust */}
      <div className="stars" style={{ opacity: 1 }}>
        {stars.map((s) => (
          <i
            key={s.id}
            style={{ left: s.left, top: s.top, animationDelay: s.delay }}
          />
        ))}
      </div>

      <div className="intro-inner" style={{ pointerEvents: "auto" }}>
        {/* Animated Brand Avatar placed seamlessly above the title */}
        <div className="mb-3 sm:mb-4 flex justify-center">
          <div className="w-20 h-16 sm:w-28 sm:h-22 md:w-32 md:h-26 flex items-center justify-center transform transition-transform duration-500 hover:scale-105">
            <Image
              src={assetPath("/brand-avatar-waving-transparent.gif")}
              alt="Simply Nooré Emblem"
              width={180}
              height={150}
              priority
              unoptimized
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(31,42,35,0.15)] animate-fadeup"
            />
          </div>
        </div>

        {/* Glow copy */}
        <div className="wm-glow wm" aria-hidden="true">
          <span>Simply </span>
          <span style={{ fontStyle: "italic" }}>Nooré</span>
        </div>

        {/* Masked rise characters */}
        <div className="wm" aria-hidden="true">
          {title.split("").map((char, idx) => {
            const isItalic = idx >= 7;
            return (
              <span key={idx} className={`m ${isItalic ? "it" : ""}`}>
                <span style={{ "--i": idx } as React.CSSProperties}>
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            );
          })}
        </div>

        {/* Drawing hairline */}
        <span className="rule" />

        {/* Tagline */}
        <p className="tag">Modesty, Redefined.</p>

        {/* Enter Atelier Interactive Pill */}
        <div className="mt-8 flex items-center justify-center gap-4">
          {/* <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              finishReveal(true);
            }}
            className="next-btn group cursor-pointer"
            aria-label="Enter Atelier"
          >
            <span>Enter Atelier</span>
            <span className="plus transition-transform group-hover:translate-x-1">→</span>
          </button> */}
        </div>
      </div>

      {/* Bottom corner controls */}
      <div className="intro-controls">
        <button
          className="skip"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            finishReveal(true);
          }}
          aria-label="Skip intro"
        >
          Skip ✕
        </button>
      </div>
    </div>
  );
}
