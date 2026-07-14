import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Bath, BedDouble, MapPin, Star, Users, ArrowLeft, Check, Wind, Coffee, Car } from "lucide-react";
import { StayGrid } from "@/components/stays/StayGrid";
import { buildStayArtUrl } from "@/lib/stays";
import { getRelatedStays, getStayBySlug } from "@/lib/staysServer";
import { BookingWidget } from "@/components/stays/BookingWidget";
import { StayGallery } from "@/components/stays/StayGallery";
import { StayReviews } from "@/components/stays/StayReviews";

type StayDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: StayDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const stay = await getStayBySlug(slug);
  if (!stay) return { title: "Stay not found" };
  return { title: stay.title, description: stay.shortDescription };
}

export default async function StayDetailsPage({ params }: StayDetailsPageProps) {
  const { slug } = await params;
  const stay = await getStayBySlug(slug);
  if (!stay) notFound();

  const relatedStays = await getRelatedStays(stay);
  const galleryScenes = ["cover", "lounge", "suite"] as const;
  const stars = Math.round(stay.rating);

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ══════════════════════════════════════
          HERO & GALLERY
      ══════════════════════════════════════ */}
      <StayGallery stay={stay} />

      {/* ══════════════════════════════════════
          QUICK PILLS
      ══════════════════════════════════════ */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "20px 32px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[stay.stayType, `${stay.guestCount} guests`, `${stay.bedrooms} beds`, `${stay.baths} baths`, stay.bestFor].map((tag) => (
            <span
              key={tag}
              style={{ padding: "6px 14px", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 6, color: "var(--text-2)", fontSize: "0.8rem", fontWeight: 600 }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          MAIN CONTENT + SIDEBAR
      ══════════════════════════════════════ */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 80px", display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) 420px", gap: 28, alignItems: "start" }}>

        {/* LEFT — Content panels */}
        <div style={{ display: "grid", gap: 20 }}>

          {/* Overview */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 32 }}>
            <p style={{ margin: "0 0 6px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 16, height: 1, background: "var(--gold)", display: "inline-block" }} />
              Overview
            </p>
            <h2 style={{ margin: "0 0 16px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.6rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>
              Description &amp; atmosphere
            </h2>
            <p style={{ margin: 0, color: "var(--text-2)", lineHeight: 1.8, fontSize: "0.95rem" }}>{stay.fullDescription}</p>
          </div>

          {/* Specs cards row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { icon: <Users size={18} />, val: `${stay.guestCount}`, label: "Guests" },
              { icon: <BedDouble size={18} />, val: `${stay.bedrooms}`, label: "Bedrooms" },
              { icon: <Bath size={18} />, val: `${stay.baths}`, label: "Baths" },
              { icon: <Star size={18} />, val: `${stay.rating}`, label: "Rating" },
            ].map((item) => (
              <div key={item.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
                <div style={{ color: "var(--gold)", display: "flex", justifyContent: "center", marginBottom: 10 }}>{item.icon}</div>
                <strong style={{ display: "block", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.6rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>{item.val}</strong>
                <span style={{ display: "block", marginTop: 4, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Amenities */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 32 }}>
            <p style={{ margin: "0 0 6px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 16, height: 1, background: "var(--gold)", display: "inline-block" }} />
              Amenities
            </p>
            <h2 style={{ margin: "0 0 20px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.6rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>
              What&apos;s included
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {stay.amenities.map((amenity) => (
                <div key={amenity} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8 }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(201,169,110,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={11} style={{ color: "var(--gold)" }} />
                  </span>
                  <span style={{ fontSize: "0.84rem", color: "var(--text-2)", fontWeight: 500 }}>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host note */}
          <div style={{ background: "linear-gradient(135deg, var(--surface-2) 0%, var(--surface) 100%)", border: "1px solid var(--border)", borderLeft: "3px solid var(--gold)", borderRadius: 14, padding: 32 }}>
            <p style={{ margin: "0 0 6px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 16, height: 1, background: "var(--gold)", display: "inline-block" }} />
              Host note
            </p>
            <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>
              Before you arrive
            </h2>
            <p style={{ margin: 0, color: "var(--text-2)", lineHeight: 1.8, fontSize: "0.95rem", fontStyle: "italic" }}>&ldquo;{stay.hostNote}&rdquo;</p>
          </div>

          {/* Reviews */}
          <StayReviews initialReviews={stay.reviews} staySlug={stay.slug} />
        </div>

        {/* RIGHT — Sticky sidebar */}
        <div style={{ position: "sticky", top: 88, display: "grid", gap: 16 }}>
          <BookingWidget
            staySlug={stay.slug}
            pricePerNight={stay.pricePerNight}
            maxGuests={stay.guestCount}
            stayTitle={stay.title}
          />

          {/* Key specs summary */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
            <p style={{ margin: "0 0 14px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>Key Details</p>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { icon: <Users size={14} />, label: "Guests", val: `Up to ${stay.guestCount}` },
                { icon: <BedDouble size={14} />, val: `${stay.bedrooms} bedrooms`, label: "Sleeping" },
                { icon: <Bath size={14} />, val: `${stay.baths} baths`, label: "Baths" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.84rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--text-3)" }}>
                    <span style={{ color: "var(--gold)" }}>{item.icon}</span>
                    {item.label}
                  </span>
                  <span style={{ fontWeight: 600, color: "var(--text-2)" }}>{item.val}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.84rem" }}>
                <span style={{ color: "var(--text-3)" }}>Best for</span>
                <span style={{ fontWeight: 600, color: "var(--gold)", fontSize: "0.8rem" }}>{stay.bestFor}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          RELATED STAYS
      ══════════════════════════════════════ */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "0 32px 96px" }}>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 64, marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 16, height: 1, background: "var(--gold)", display: "inline-block" }} />
                Related stays
              </p>
              <h2 style={{ margin: 0, fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>
                More homes, same travel rhythm.
              </h2>
            </div>
            <p style={{ maxWidth: 380, color: "var(--text-2)", fontSize: "0.9rem", lineHeight: 1.75, margin: 0 }}>
              Each related stay keeps a similar feel while offering a different city, pace, or group setup.
            </p>
          </div>
        </div>
        <StayGrid items={relatedStays} />
      </section>
    </main>
  );
}
