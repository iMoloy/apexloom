"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Expand, ArrowLeft, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { buildStayArtUrl } from "@/lib/stays";
import type { StayItem } from "@/data/stays";
import { DEFAULT_STAY_IMAGE } from "./StayCard";
import { FavoriteButton } from "./FavoriteButton";

function ImageWithFallback({ src, fallback, ...props }: any) {
  const [error, setError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  
  if (src !== prevSrc) {
    setPrevSrc(src);
    setError(false);
  }

  return <Image src={error ? fallback : src} alt={props.alt || ""} onError={() => setError(true)} {...props} />;
}

type StayComponentProps = {
  stay: StayItem;
};

export function StayHeader({ stay }: StayComponentProps) {
  const stars = Math.round(stay.rating);

  return (
    <section className="bg-[var(--bg)] border-b border-[var(--border)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-5 flex flex-col gap-3">
        {/* Top Row: Back Link & Actions */}
        <div className="flex justify-between items-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-[var(--text-3)] text-sm font-semibold transition-colors hover:text-[var(--gold)] no-underline"
          >
            <ArrowLeft size={16} />
            Back to Explore
          </Link>

          <FavoriteButton
            staySlug={stay.slug}
            size={20}
            style={{
              position: "relative",
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          />
        </div>

        {/* Bottom Row: Title and Meta */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <p className="m-0 mb-1 text-[var(--gold)] text-[11px] font-bold tracking-[0.15em] uppercase">
              {stay.collection} Collection
            </p>
            <h1 className="m-0 mb-2 font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--text)] tracking-tight leading-tight">
              {stay.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-[var(--text-2)] text-sm">
                <MapPin size={16} style={{ color: "var(--gold)" }} />
                {stay.location}, {stay.country}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[var(--text-2)] text-sm">
                <span className="inline-flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} style={{ color: i < stars ? "var(--gold)" : "var(--border-2)", fill: i < stars ? "var(--gold)" : "transparent" }} />
                  ))}
                </span>
                <strong className="text-[var(--text)]">{stay.rating}</strong>
                <span className="text-[var(--text-3)]">({stay.reviewCount} reviews)</span>
              </span>
            </div>
          </div>

          <div className="text-left md:text-right">
            <span className="px-4 py-1.5 bg-[rgba(201,169,110,0.1)] border border-[rgba(201,169,110,0.2)] rounded-full text-[var(--gold)] text-sm font-bold inline-block">
              ${stay.pricePerNight} / night
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StayGalleryCollage({ stay }: StayComponentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const scenes = ["cover", "lounge", "suite"] as const;
  const allImages = stay.galleryLabels.map((label, idx) => ({
    scene: scenes[idx] || "cover",
    label,
  }));

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setActiveIndex((prev) => (prev + 1) % allImages.length);
      if (e.key === "ArrowLeft") setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, allImages.length]);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };
  
  const getImageUrl = (scene: string) => {
    if (scene === "cover" && stay.imageUrl) return stay.imageUrl;
    if (scene === "lounge" && stay.loungeImageUrl) return stay.loungeImageUrl;
    if (scene === "suite" && stay.suiteImageUrl) return stay.suiteImageUrl;
    return buildStayArtUrl(stay.slug, scene as any);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] gap-3 h-[240px] md:h-[380px] w-full">
        {/* Large Image (Index 0: Cover) */}
        <div 
          onClick={() => openLightbox(0)}
          className="group relative h-full rounded-xl overflow-hidden cursor-pointer border border-[var(--border)]"
        >
          <ImageWithFallback
            src={getImageUrl("cover")}
            fallback={DEFAULT_STAY_IMAGE}
            alt={`${stay.title} - Main View`}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            unoptimized
            style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
            className="group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Expand size={24} style={{ color: "white" }} />
          </div>
          <div className="absolute bottom-4 left-5 z-10 text-[13px] font-bold tracking-wider uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {stay.galleryLabels[0] || "Main View"}
          </div>
        </div>

        {/* Stack of 2 smaller images - visible on medium screens and up */}
        <div className="hidden md:grid grid-rows-2 gap-3 h-full">
          {/* Lounge Image */}
          <div 
            onClick={() => openLightbox(1)}
            className="group relative rounded-xl overflow-hidden cursor-pointer border border-[var(--border)]"
          >
            <ImageWithFallback
              src={getImageUrl("lounge")}
              fallback={DEFAULT_STAY_IMAGE}
              alt={`${stay.title} - Lounge`}
              fill
              sizes="30vw"
              unoptimized
              style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
              className="group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Expand size={20} style={{ color: "white" }} />
            </div>
            <div className="absolute bottom-3 left-4 z-10 text-[11px] font-bold tracking-wider uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {stay.galleryLabels[1] || "Lounge"}
            </div>
          </div>

          {/* Suite Image */}
          <div 
            onClick={() => openLightbox(2)}
            className="group relative rounded-xl overflow-hidden cursor-pointer border border-[var(--border)]"
          >
            <ImageWithFallback
              src={getImageUrl("suite")}
              fallback={DEFAULT_STAY_IMAGE}
              alt={`${stay.title} - Suite`}
              fill
              sizes="30vw"
              unoptimized
              style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
              className="group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Expand size={20} style={{ color: "white" }} />
            </div>
            <div className="absolute bottom-3 left-4 z-10 text-[11px] font-bold tracking-wider uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {stay.galleryLabels[2] || "Suite"}
            </div>
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX MODAL ── */}
      {lightboxOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(8, 8, 16, 0.95)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Lightbox Header */}
          <div className="p-6 md:p-8 flex justify-between items-center">
            <div className="text-[var(--gold)] text-[13px] font-bold tracking-wider uppercase">
              {allImages[activeIndex]?.label} ({activeIndex + 1} / {allImages.length})
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                padding: "8px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
              }}
              className="hover:bg-white hover:text-black"
            >
              <X size={24} />
            </button>
          </div>

          {/* Lightbox Image Container */}
          <div className="flex-1 relative flex items-center justify-center px-8 md:px-20 pb-10">
            {/* Prev Button */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              style={{
                position: "absolute",
                left: 32,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(8,8,16,0.6)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                padding: "16px",
                borderRadius: "50%",
                cursor: "pointer",
                transition: "all 0.2s",
                zIndex: 10
              }}
              className="hover:bg-white hover:text-black hover:scale-110"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Main Image */}
            <div className="relative w-full h-full max-w-[1400px] max-h-[85vh]">
              <ImageWithFallback
                src={getImageUrl(allImages[activeIndex]?.scene)}
                fallback={DEFAULT_STAY_IMAGE}
                alt={allImages[activeIndex]?.label || ""}
                fill
                style={{ objectFit: "contain" }}
                unoptimized
                priority
              />
            </div>

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              style={{
                position: "absolute",
                right: 32,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(8,8,16,0.6)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                padding: "16px",
                borderRadius: "50%",
                cursor: "pointer",
                transition: "all 0.2s",
                zIndex: 10
              }}
              className="hover:bg-white hover:text-black hover:scale-110"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
