"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Star, MapPin, TrendingUp, Users, Home, Award } from "lucide-react";
import { StayGrid } from "@/components/stays/StayGrid";
import {
  collections,
  faqItems,
  heroMetrics,
  impactStats,
  journalEntries,
  journeySteps,
  testimonials,
} from "@/data/home";
import type { StayItem } from "@/data/stays";

export function HomeLanding({ featuredStays }: { featuredStays: StayItem[] }) {

  return (
    <main style={{ overflow: "hidden" }}>
      {/* Dynamic Keyframe Animation Styles */}
      <style>{`
        @keyframes pan-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section 
        className="hero-grid"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "var(--bg)",
        }}
      >
        {/* Ken Burns Dynamic Background Image */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "pan-zoom 20s ease-in-out infinite alternate",
          zIndex: 0,
        }} />

        {/* Gradient Overlay for Readability */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(8,8,16,0.98) 0%, rgba(8,8,16,0.65) 50%, rgba(8,8,16,0.3) 100%)",
          zIndex: 1,
        }} />

        <div className="hero-panel" style={{ background: "transparent", position: "relative", zIndex: 2 }}>
          <div>
            <div className="hero-ribbon">
              <span className="hero-ribbon__tag">Premium Selection</span>
              <span className="eyebrow">Thoughtful stays, well chosen</span>
            </div>

            <div className="foundation-copy">
              <h1>
                Where remarkable<br />
                <span style={{ color: "var(--gold)" }}>places</span> meet<br />
                discerning guests.
              </h1>
              <p>
                ApexLoom brings together remarkable homes, slow escapes,
                and design-led spaces worth travelling for. Every property
                is hand-selected by our curation team.
              </p>
            </div>

            <div className="hero-actions">
              <Link className="hero-button" href="/explore">
                Explore properties
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a className="text-link" href="#collections">
                View collections <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>

            <div className="hero-ledger">
              <div>
                <span>Current catalog</span>
                <strong>City stays, slow houses &amp; signature retreats</strong>
              </div>
              <div>
                <span>Curated for</span>
                <strong>Guests who choose with taste and intent</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Stats & Property Showcase */}
        <div className="hero-aside" style={{ position: "relative", zIndex: 2 }}>
          {/* Live property card mock */}
          <div style={{
            border: "1px solid var(--border-2)",
            borderRadius: "12px",
            background: "rgba(18, 18, 29, 0.85)",
            backdropFilter: "blur(12px)",
            padding: "20px",
          }}>
            <div className="flex justify-between items-center mb-4">
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>
                Editor&apos;s Pick
              </span>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                background: "rgba(201,169,110,0.1)",
                border: "1px solid rgba(201,169,110,0.2)",
                borderRadius: "99px",
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "var(--gold)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "99px", background: "#22c55e", display: "inline-block" }} />
                Live now
              </span>
            </div>

            <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.05rem", fontWeight: 600, color: "var(--text)", lineHeight: 1.4, marginBottom: 16 }}>
              Solenne House — Lisbon
            </p>

            <p style={{ fontSize: "0.8rem", color: "var(--text-2)", lineHeight: 1.65, marginBottom: 20 }}>
              &ldquo;A quiet, light-filled haven overlooking the red roofs of Príncipe Real. Natural materials and considered details throughout.&rdquo;
            </p>

            {/* Score bars */}
            {[
              { label: "Aesthetic Unity", val: 98 },
              { label: "Natural Lighting", val: 96 },
              { label: "Neighborhood", val: 94 },
            ].map((item) => (
              <div key={item.label} className="mb-3">
                <div className="flex justify-between mb-1" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>
                  <span>{item.label}</span>
                  <span style={{ color: "var(--gold)" }}>{item.val}/100</span>
                </div>
                <div style={{ height: 3, borderRadius: 99, background: "var(--border-2)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.val}%`, background: "linear-gradient(90deg, var(--gold) 0%, var(--gold-2) 100%)", borderRadius: 99 }} />
                </div>
              </div>
            ))}

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.7rem", color: "var(--text-3)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "99px", display: "inline-block" }} />
                <span style={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Curation verified</span>
              </span>
              <Star size={12} style={{ color: "var(--gold)" }} />
            </div>
          </div>

          {/* Quick metrics */}
          <div className="grid grid-cols-3 gap-3">
            {heroMetrics.map((metric) => (
              <div key={metric.label} style={{
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "16px 12px",
                textAlign: "center",
                background: "rgba(12, 12, 22, 0.8)",
                backdropFilter: "blur(8px)",
              }}>
                <strong style={{ display: "block", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--gold)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {metric.value}
                </strong>
                <span style={{ display: "block", marginTop: 6, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", lineHeight: 1.4 }}>
                  {metric.label.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {impactStats.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  padding: "32px 24px",
                  borderRight: i < impactStats.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <strong style={{ display: "block", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2.2rem", fontWeight: 600, color: "var(--gold)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {stat.value}
                </strong>
                <p style={{ margin: "8px 0 0", fontSize: "0.82rem", color: "var(--text-3)", lineHeight: 1.5 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED STAYS ───────────────────────────────────── */}
      <section className="page-section" id="featured-stays" style={{ paddingTop: 96 }}>
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-kicker">Featured Properties</p>
            <h2>Hand-selected, considered stays worth booking.</h2>
          </div>
          <div>
            <p className="section-copy" style={{ marginBottom: 16 }}>
              Every property in our catalog has been reviewed for atmosphere, accuracy, and the details that determine whether a trip goes well.
            </p>
            <Link className="text-link" href="/explore" style={{ fontWeight: 700 }}>
              View all properties <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <StayGrid items={featuredStays} />
      </section>

      {/* ── WHY APEXLOOM ─────────────────────────────────────── */}
      <section className="page-section page-section--accent" id="discover">
        <div className="section-heading">
          <p className="section-kicker">Why ApexLoom</p>
          <h2>A travel platform shaped by taste, not volume.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            {
              icon: <Home size={22} />,
              title: "Design-First Properties",
              desc: "Spaces chosen for atmosphere, natural light, and the kind of details that shape the whole stay — not properties that merely look good in photos.",
              tag: "Editorial standard",
            },
            {
              icon: <MapPin size={22} />,
              title: "Local Rhythm Guides",
              desc: "Travel guides help you move like you belong. Practical neighborhood timing, bakery routes, and sunset walks curated by local hosts.",
              tag: "Local expertise",
            },
            {
              icon: <Award size={22} />,
              title: "Verified Standards",
              desc: "Every listing includes clear information about workspace, self check-in, internet performance, and host policies — upfront, with no surprises on arrival.",
              tag: "Transparency",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 32,
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--gold)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(201,169,110,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", marginBottom: 20 }}>
                {card.icon}
              </div>
              <span style={{ display: "block", marginBottom: 10, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>
                {card.tag}
              </span>
              <h3 style={{ margin: "0 0 12px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", fontWeight: 600, color: "var(--text)" }}>
                {card.title}
              </h3>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.75 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COLLECTIONS ──────────────────────────────────────── */}
      <section className="page-section" id="collections">
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-kicker">Collections</p>
            <h2>Curated paths into the stays you actually want.</h2>
          </div>
          <p className="section-copy">
            Rather than sorting through endless inventory, ApexLoom groups spaces by rhythm, setting, and how the stay is meant to feel.
          </p>
        </div>
        <div className="collection-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {collections.map((collection) => (
            <Link
              href={`/explore?collection=${encodeURIComponent(collection.title)}`}
              key={collection.title}
              className="group"
              style={{
                position: "relative",
                height: 420,
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: 32,
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              {/* Background Image */}
              <div 
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url('${collection.imageUrl}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  zIndex: 0,
                }} 
                className="group-hover:scale-105" 
              />
              
              {/* Dark Gradient Overlay */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(8,8,16,0.98) 0%, rgba(8,8,16,0.65) 50%, rgba(8,8,16,0.15) 100%)",
                zIndex: 1,
              }} />

              {/* Text Content */}
              <div style={{ position: "relative", zIndex: 2, display: "grid", gap: 12 }}>
                <span style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>
                  {collection.tone === "forest" ? "Urban" : collection.tone === "clay" ? "Slow Travel" : "Design"}
                </span>
                <h3 style={{ margin: 0, fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.45rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em" }}>
                  {collection.title}
                </h3>
                <p style={{ margin: 0, color: "var(--text-2)", fontSize: "0.86rem", lineHeight: 1.55 }}>
                  {collection.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {collection.highlights.map((highlight) => (
                    <span 
                      key={highlight} 
                      style={{ 
                        padding: "4px 10px", 
                        background: "rgba(201,169,110,0.12)", 
                        border: "1px solid rgba(201,169,110,0.25)", 
                        borderRadius: 6, 
                        color: "var(--gold)", 
                        fontSize: "0.72rem", 
                        fontWeight: 600 
                      }}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── JOURNEY / STEPS ──────────────────────────────────── */}
      <section className="page-section page-section--accent" id="hosting">
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-kicker">How it works</p>
            <h2>Simple from first browse to arrival day.</h2>
          </div>
          <a className="text-link" href="#faq">
            Read the FAQ <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="journey-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {journeySteps.map((step, index) => (
            <article 
              className="group" 
              key={step.title}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 32,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "3.5rem",
                  fontWeight: 700,
                  color: "rgba(201,169,110,0.08)",
                  lineHeight: 1,
                  marginBottom: 16,
                  transition: "color 0.3s ease, transform 0.3s ease",
                }}
                className="group-hover:text-[rgba(201,169,110,0.22)] group-hover:scale-105"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 style={{ margin: "0 0 12px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", fontWeight: 600, color: "var(--text)" }}>
                {step.title}
              </h3>
              <p style={{ margin: 0, color: "var(--text-3)", fontSize: "0.86rem", lineHeight: 1.65 }}>
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="page-section" id="reviews">
        <div className="section-heading" style={{ textAlign: "center", justifyItems: "center" }}>
          <p className="section-kicker">Guest Voices</p>
          <h2>Trusted by guests and hosts who care about the details.</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.name}>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} style={{ color: "var(--gold)", fill: "var(--gold)" }} aria-hidden="true" />
                ))}
              </div>
              <p>&ldquo;{testimonial.quote}&rdquo;</p>
              <div>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── JOURNAL ──────────────────────────────────────────── */}
      <section className="page-section page-section--accent" id="journal">
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-kicker">Journal</p>
            <h2>Practical stories for people who travel with intent.</h2>
          </div>
          <p className="section-copy">
            Editorial pieces help guests choose better stays and help hosts understand what thoughtful presentation looks like.
          </p>
        </div>
        <div className="journal-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {journalEntries.map((entry) => (
            <article 
              className="group" 
              key={entry.title}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--gold)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(201,169,110,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Journal Cover Image */}
              <div style={{ position: "relative", height: 210, width: "100%", overflow: "hidden" }}>
                <Image
                  src={entry.imageUrl || ""}
                  alt={entry.title}
                  fill
                  unoptimized
                  style={{ objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
                  className="group-hover:scale-105"
                />
                <span style={{ position: "absolute", top: 16, left: 16, zIndex: 10, padding: "5px 10px", background: "rgba(8,8,16,0.85)", backdropFilter: "blur(6px)", border: "1px solid var(--border-2)", borderRadius: 6, fontSize: "0.68rem", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {entry.meta}
                </span>
              </div>

              {/* Journal Body */}
              <div style={{ padding: 24, display: "grid", gap: 10 }}>
                <h3 style={{ margin: 0, fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.2rem", fontWeight: 600, color: "var(--text)", lineHeight: 1.45 }}>
                  {entry.title}
                </h3>
                <p style={{ margin: 0, color: "var(--text-3)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                  {entry.description}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--gold)", fontSize: "0.8rem", fontWeight: 700, marginTop: 8 }}>
                  Read Article <ArrowRight size={14} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="page-section" id="faq" style={{ maxWidth: 1440, margin: "0 auto", padding: "96px 32px" }}>
        <div className="section-heading section-heading--split" style={{ marginBottom: 40 }}>
          <div>
            <p className="section-kicker">FAQ</p>
            <h2>Clear answers while the platform is taking shape.</h2>
          </div>
          <p className="section-copy">
            This demo already reflects the product direction, while later sections will add the account, listing, and management workflows.
          </p>
        </div>
        <div className="faq-list">
          {faqItems.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
