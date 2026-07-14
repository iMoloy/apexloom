"use client";

import React from "react";
import Image from "next/image";
import { Shield, Sparkles, Heart, Compass } from "lucide-react";

const pillars = [
  {
    icon: <Compass size={20} />,
    title: "Design & Character",
    desc: "We look for homes with visual consistency, intentional lighting, and a clear architectural point of view. No sterile, standard layouts.",
  },
  {
    icon: <Shield size={20} />,
    title: "Honesty & Specifications",
    desc: "We list the exact details guests rely on: workspace quality, internet stability, noise levels, and host arrival notes. No surprises.",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Atmosphere First",
    desc: "Properties must support slow travel — large dining spaces, restful rooms, and walkability rather than tourist rush.",
  },
  {
    icon: <Heart size={20} />,
    title: "Host Accountability",
    desc: "Hosts curate their listings with us directly. That relationship builds better communication, accurate photography, and responsive support.",
  },
];

export default function AboutPage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Hero Section with Parallax Background */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "55vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Ken Burns Background Image */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "pan-zoom 20s ease-in-out infinite alternate",
          opacity: 0.45,
          zIndex: 0,
        }} />
        <style>{`
          @keyframes pan-zoom {
            0% { transform: scale(1); }
            100% { transform: scale(1.08); }
          }
        `}</style>
        
        {/* Dark Overlay for Text Readability */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, var(--bg) 0%, rgba(8,8,16,0.6) 100%)",
          zIndex: 1,
        }} />

        {/* Hero Content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 800, padding: "0 32px", textAlign: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", border: "1px solid rgba(201,169,110,0.25)", borderRadius: 99, background: "rgba(201,169,110,0.08)", color: "var(--gold)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>
            Our Philosophy
          </span>
          <h1 style={{ margin: "0 0 20px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Places that stay with you.
          </h1>
          <p style={{ margin: "0 auto", color: "var(--text-2)", fontSize: "1.05rem", lineHeight: 1.8, maxWidth: 580 }}>
            ApexLoom was founded to bypass the infinite scrolling of generic rental platforms. We focus exclusively on spaces that demonstrate character, atmosphere, and architectural consideration.
          </p>
        </div>
      </section>

      {/* Editorial split banner */}
      <section style={{ maxWidth: 1000, margin: "80px auto", padding: "0 32px" }}>
        <div style={{
          borderRadius: 14,
          overflow: "hidden",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 0,
        }}>
          {/* Left copy column */}
          <div style={{ padding: "60px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ display: "block", marginBottom: 14, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>
              Editorial Focus
            </span>
            <h2 style={{ margin: "0 0 20px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              We filter the options so you can choose with clarity.
            </h2>
            <p style={{ margin: "0 0 28px", color: "var(--text-3)", fontSize: "0.9rem", lineHeight: 1.7 }}>
              Instead of overwhelm, we provide curated paths into spaces designed for slow living, creative retreats, and meaningful gatherings.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {["Atmosphere", "Details", "Clarity", "Character", "Slow Travel"].map((tag) => (
                <span key={tag} style={{ padding: "6px 14px", border: "1px solid var(--border-2)", borderRadius: 99, background: "rgba(201,169,110,0.06)", color: "var(--text-2)", fontSize: "0.78rem", fontWeight: 600 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Image column */}
          <div style={{ position: "relative", minHeight: 350 }}>
            <Image
              src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"
              alt="Curation room details"
              fill
              unoptimized
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section style={{ maxWidth: 1000, margin: "0 auto 80px", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ margin: "0 0 10px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>Curation Standards</p>
          <h2 style={{ margin: 0, fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>
            The core checks every property undergoes.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {pillars.map((pillar) => (
            <div 
              key={pillar.title} 
              style={{ 
                padding: 32, 
                background: "var(--surface)", 
                border: "1px solid var(--border)", 
                borderRadius: 12,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--gold)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", marginBottom: 16 }}>
                {pillar.icon}
              </div>
              <h3 style={{ margin: "0 0 10px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.15rem", fontWeight: 600, color: "var(--text)" }}>
                {pillar.title}
              </h3>
              <p style={{ margin: 0, color: "var(--text-2)", fontSize: "0.875rem", lineHeight: 1.75 }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
