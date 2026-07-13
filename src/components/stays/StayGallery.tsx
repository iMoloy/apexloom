"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Expand, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buildStayArtUrl } from "@/lib/stays";
import type { StayItem } from "@/data/stays";
import { DEFAULT_STAY_IMAGE } from "./StayCard";

function ImageWithFallback({ src, fallback, ...props }: any) {
  const [error, setError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  
  if (src !== prevSrc) {
    setPrevSrc(src);
    setError(false);
  }

  return <Image src={error ? fallback : src} alt={props.alt || ""} onError={() => setError(true)} {...props} />;
}

type StayGalleryProps = {
  stay: StayItem;
};

export function StayGallery({ stay }: StayGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // We have 4 scenes: cover, and the 3 from galleryLabels
  const scenes = ["cover", "cover", "lounge", "suite"] as const;
  const allImages = [
    { scene: "cover", label: "Main View" },
    ...stay.galleryLabels.map((label, idx) => ({
      scene: scenes[idx + 1] || "cover",
      label,
    }))
  ];

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
    return buildStayArtUrl(stay.slug, scene as any);
  };
  
  const stars = Math.round(stay.rating);

  return (
    <>
      {/* ── FULL-BLEED HERO IMAGE ── */}
      <section style={{ position: "relative" }}>
        <div 
          style={{ position: "relative", height: "60vh", minHeight: 400, overflow: "hidden", cursor: "pointer" }}
          onClick={() => openLightbox(0)}
          className="group"
        >
          <ImageWithFallback
            src={getImageUrl("cover")}
            fallback={DEFAULT_STAY_IMAGE}
            alt={`${stay.title} — main view`}
            fill
            sizes="100vw"
            unoptimized
            priority
            style={{ objectFit: "cover", transition: "transform 0.7s ease" }}
            className="group-hover:scale-105"
          />
          {/* Dark gradient overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(8,8,16,0.25) 0%, rgba(8,8,16,0.55) 100%)",
            transition: "background 0.4s ease",
          }} className="group-hover:bg-black/10" />

          {/* Expand Icon */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(8,8,16,0.6)",
            backdropFilter: "blur(8px)",
            color: "white",
            padding: "16px",
            borderRadius: "50%",
            opacity: 0,
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }} className="group-hover:opacity-100 group-hover:scale-110">
            <Expand size={32} />
          </div>

          {/* Back link overlaid on hero */}
          <div style={{ position: "absolute", top: 28, left: 32, zIndex: 10 }}>
            <Link
              href="/explore"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                background: "rgba(8,8,16,0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 99,
                color: "var(--text-2)",
                fontSize: "0.8rem",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowLeft size={14} />
              Back to Explore
            </Link>
          </div>

          {/* Hero text overlay at bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 40px 36px", zIndex: 5 }}>
            <p style={{ margin: "0 0 10px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)" }}>
              {stay.collection}
            </p>
            <h1 style={{ margin: "0 0 12px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.08 }}>
              {stay.title}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {stay.location}, {stay.country}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>
                {/* Star strip */}
                <span style={{ display: "inline-flex", gap: 2 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="13" height="13" viewBox="0 0 20 20" style={{ fill: i < stars ? "#c9a96e" : "rgba(255,255,255,0.2)" }}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </span>
                <strong style={{ color: "#fff" }}>{stay.rating}</strong>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>({stay.reviewCount} reviews)</span>
              </span>
              <span style={{ padding: "4px 12px", background: "rgba(201,169,110,0.2)", border: "1px solid rgba(201,169,110,0.3)", borderRadius: 99, color: "var(--gold)", fontSize: "0.78rem", fontWeight: 700 }}>
                ${stay.pricePerNight} / night
              </span>
            </div>
          </div>
        </div>

        {/* ── SUB-GALLERY STRIP ── */}
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "12px 32px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {stay.galleryLabels.map((label, idx) => {
              const sceneIndex = idx + 1; // offset by 1 because 0 is hero
              return (
                <div
                  key={label}
                  onClick={() => openLightbox(sceneIndex)}
                  className="group"
                  style={{
                    position: "relative",
                    height: 200,
                    borderRadius: 10,
                    overflow: "hidden",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    cursor: "pointer"
                  }}
                >
                  <ImageWithFallback
                    src={getImageUrl(allImages[sceneIndex].scene)}
                    fallback={DEFAULT_STAY_IMAGE}
                    alt={`${stay.title} ${label}`}
                    fill
                    sizes="33vw"
                    unoptimized
                    style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                    className="group-hover:scale-110"
                  />
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(8,8,16,0.4)",
                    opacity: 0,
                    transition: "opacity 0.3s ease"
                  }} className="group-hover:opacity-100 flex items-center justify-center">
                    <Expand size={24} style={{ color: "white" }} />
                  </div>
                  {/* Label */}
                  <div style={{ position: "absolute", bottom: 10, left: 12, zIndex: 2, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

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
          <div style={{ padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: "var(--gold)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {allImages[activeIndex].label} ({activeIndex + 1} / {allImages.length})
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
          <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 80px 40px" }}>
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
            <div style={{ position: "relative", width: "100%", height: "100%", maxWidth: 1400, maxHeight: "85vh" }}>
              <ImageWithFallback
                src={getImageUrl(allImages[activeIndex].scene)}
                fallback={DEFAULT_STAY_IMAGE}
                alt={allImages[activeIndex].label}
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
