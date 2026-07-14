"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { StayItem } from "@/data/stays";
import { FavoriteButton } from "./FavoriteButton";

type StayCardProps = {
  stay: StayItem;
  isPreview?: boolean;
};

export const DEFAULT_STAY_IMAGE = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80";

export function StayCard({ stay, isPreview = false }: StayCardProps) {
  const stars = Math.round(stay.rating);
  
  const [imgError, setImgError] = useState(false);
  const [prevUrl, setPrevUrl] = useState(stay.imageUrl);

  if (stay.imageUrl !== prevUrl) {
    setPrevUrl(stay.imageUrl);
    setImgError(false);
  }

  return (
    <article className="stay-card">
      {/* ── IMAGE ── */}
      <div className="stay-card__media">
        {/* Floating Heart Button */}
        {!isPreview && (
          <FavoriteButton
            staySlug={stay.slug}
            style={{ bottom: 14, left: 14 }}
          />
        )}

        {/* Gradient overlay for readability */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "linear-gradient(to top, rgba(8,8,16,0.75) 0%, rgba(8,8,16,0.1) 48%, transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* Badges */}
        <div className="stay-card__badge-row" style={{ zIndex: 2 }}>
          <span className="stay-card__badge">{stay.collection || "Curated Stay"}</span>
          <span className="stay-card__badge stay-card__badge--soft">{stay.stayType || "House"}</span>
        </div>

        {/* Price overlay on image */}
        <div style={{
          position: "absolute",
          bottom: 14,
          right: 14,
          zIndex: 2,
          padding: "5px 12px",
          background: "rgba(8,8,16,0.85)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(201,169,110,0.3)",
          borderRadius: 8,
        }}>
          <span style={{ color: "var(--gold)", fontWeight: 700, fontSize: "0.95rem" }}>
            ${stay.pricePerNight}
          </span>
          <span style={{ color: "var(--text-3)", fontSize: "0.7rem", fontWeight: 400 }}> / night</span>
        </div>

        {isPreview ? (
          <div
            className="absolute inset-0 flex flex-col justify-between p-5"
            style={{ background: "linear-gradient(145deg, #1a1a24 0%, #0f1520 100%)" }}
          >
            <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.8 }}>Preview</span>
            </div>
            <div className="relative z-10">
              <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1rem", fontWeight: 600, color: "var(--text)", lineHeight: 1.3, marginBottom: 4 }}>{stay.title}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>{stay.location}, {stay.country}</p>
            </div>
          </div>
        ) : (
          <Image
            src={imgError ? DEFAULT_STAY_IMAGE : (stay.imageUrl || DEFAULT_STAY_IMAGE)}
            alt={`${stay.title} illustration`}
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 1120px) 50vw, 25vw"
            unoptimized
            style={{ objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* ── BODY ── */}
      <div className="stay-card__body">
        {/* Location */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-3)", fontSize: "0.78rem" }}>
          <MapPin size={11} style={{ color: "var(--gold)", flexShrink: 0 }} />
          <span>{stay.location}, {stay.country}</span>
        </div>

        {/* Title */}
        <h3 style={{ margin: 0 }}>{stay.title}</h3>

        {/* Description */}
        <p className="line-clamp-2" style={{ fontSize: "0.84rem" }}>
          {stay.shortDescription}
        </p>

        {/* Rating + Best For */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {/* Star strip */}
            <div style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="11" height="11" viewBox="0 0 20 20" style={{ fill: i < stars ? "#c9a96e" : "var(--border-2)" }}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-2)" }}>{stay.rating}</span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>({stay.reviewCount})</span>
          </div>
          <span style={{ fontSize: "0.72rem", color: "var(--text-3)", fontStyle: "italic", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {stay.bestFor}
          </span>
        </div>

        {/* CTA */}
        {isPreview ? (
          <span className="stay-card__action" style={{ opacity: 0.4, pointerEvents: "none" }}>Preview Mode</span>
        ) : (
          <Link className="stay-card__action" href={`/stays/${stay.slug}`}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            View Details <ArrowUpRight size={14} />
          </Link>
        )}
      </div>
    </article>
  );
}
