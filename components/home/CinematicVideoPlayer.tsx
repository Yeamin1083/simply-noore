"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
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
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  // Auto-play safely with browser autoplay compliance
  useEffect(() => {
    const playSafe = (v: HTMLVideoElement | null) => {
      if (v) {
        v.muted = isMuted;
        v.play().catch(() => {
          v.muted = true;
          v.play().catch(() => {});
        });
      }
    };

    playSafe(videoRef1.current);
    playSafe(videoRef2.current);
  }, [isMuted]);

  // Seamless auto-transition between both videos
  // When active video reaches near its end (or every 9 seconds), smoothly cross-dissolve to the other video
  useEffect(() => {
    if (!isPlaying) return;

    // Cross-fade timing: cycles smoothly every 8.5 seconds
    const interval = setInterval(() => {
      setActiveVideoIdx((prev) => (prev === 0 ? 1 : 0));
    }, 8500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    [videoRef1.current, videoRef2.current].forEach((v) => {
      if (v) {
        if (next) v.play().catch(() => {});
        else v.pause();
      }
    });
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    [videoRef1.current, videoRef2.current].forEach((v) => {
      if (v) v.muted = next;
    });
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 md:px-6 my-6 sm:my-10">
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[340px] sm:min-h-[480px] lg:min-h-[580px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-black border border-border/40 dark:border-white/10 group">
        {/* Layer 1: Video 1 */}
        <video
          ref={videoRef1}
          src={VIDEOS[0].src}
          playsInline
          autoPlay
          muted={isMuted}
          loop
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1200 ease-in-out"
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
          muted={isMuted}
          loop
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1200 ease-in-out"
          style={{
            opacity: activeVideoIdx === 1 ? 1 : 0,
            zIndex: activeVideoIdx === 1 ? 2 : 1,
          }}
        />

        {/* Subtle Luxury Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none z-10" />

        {/* Minimal Discrete Controls in Corner */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          {/* Pause / Play */}
          <button
            onClick={togglePlay}
            className="p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white/80 hover:text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Audio Mute / Unmute */}
          <button
            onClick={toggleMute}
            className="p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white/80 hover:text-white border border-white/20 transition-all"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            title={isMuted ? "Unmute ambience" : "Mute audio"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#DFCA9B]" />
            )}
          </button>
        </div>

        {/* Subtle live indicator in top corner */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-widest text-white/80 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DFCA9B] animate-pulse" />
          <span>Atelier Motion</span>
        </div>
      </div>
    </section>
  );
}
