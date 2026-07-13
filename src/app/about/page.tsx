import React from "react";
import { Shield, Sparkles, Heart, Compass } from "lucide-react";

export const metadata = {
  title: "About Us | ApexLoom",
  description: "Learn about the mission, values, and curation standards behind the ApexLoom travel platform.",
};

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
      {/* Hero */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 32px 64px", textAlign: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", border: "1px solid rgba(201,169,110,0.25)", borderRadius: 99, background: "rgba(201,169,110,0.08)", color: "var(--gold)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 24 }}>
          Our Philosophy
        </span>
        <h1 style={{ margin: "0 0 20px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1.08 }}>
          Places that stay with you.
        </h1>
        <p style={{ maxWidth: 580, margin: "0 auto", color: "var(--text-2)", fontSize: "1.05rem", lineHeight: 1.75 }}>
          ApexLoom was founded to bypass the infinite scrolling of generic rental platforms. We focus exclusively on spaces that demonstrate character, atmosphere, and architectural consideration.
        </p>
      </section>

      {/* Editorial Banner */}
      <section style={{ maxWidth: 1000, margin: "0 auto 80px", padding: "0 32px" }}>
        <div style={{
          borderRadius: 14,
          overflow: "hidden",
          background: "linear-gradient(135deg, var(--surface-2) 0%, var(--surface) 100%)",
          border: "1px solid var(--border)",
          padding: "60px 48px",
          position: "relative",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <span style={{ display: "block", marginBottom: 14, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>
            Editorial Focus
          </span>
          <h2 style={{ margin: "0 0 20px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.15, maxWidth: 600 }}>
            We filter the options so you can choose with clarity.
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["Atmosphere", "Details", "Clarity", "Character", "Slow Travel"].map((tag) => (
              <span key={tag} style={{ padding: "6px 14px", border: "1px solid var(--border-2)", borderRadius: 99, background: "rgba(201,169,110,0.06)", color: "var(--text-2)", fontSize: "0.78rem", fontWeight: 600 }}>
                {tag}
              </span>
            ))}
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {pillars.map((pillar) => (
            <div key={pillar.title} style={{ padding: 28, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
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
