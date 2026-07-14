"use client";

import React from "react";
import Image from "next/image";
import { Shield, Lock, FileText, AlertCircle } from "lucide-react";

const policySections = [
  {
    icon: <Shield size={20} />,
    title: "Data Collection & Curation",
    content: "When you browse our curated properties or book a stay, we collect minimal operational data necessary to facilitate your trip. We prioritize data minimization, meaning we do not request extraneous personal details that do not directly contribute to the quality of your stay or host communication.",
  },
  {
    icon: <Lock size={20} />,
    title: "Security & Retention",
    content: "All communication between guests and hosts through our platform is encrypted. We retain booking records only as long as required for legal compliance and operational support. We do not sell guest data, browsing habits, or preference profiles to third-party advertisers.",
  },
  {
    icon: <FileText size={20} />,
    title: "Terms of Service",
    content: "By using ApexLoom, you agree to our standard terms of use. Our platform is a curated marketplace; while we vet properties for architectural and atmospheric standards, the host remains the primary provider of the accommodation. Guests are expected to adhere to the host's specific property rules.",
  },
  {
    icon: <AlertCircle size={20} />,
    title: "Editorial Independence",
    content: "Our curation team selects properties based on strict aesthetic and operational criteria. Hosts cannot pay for placement or improved visibility in our 'Editorial Focus' collections. Rankings and features are determined solely by guest feedback and editorial review.",
  },
];

export default function PrivacyPage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px 64px" }}>
        {/* Banner Card */}
        <div style={{ position: "relative", height: 260, borderRadius: 14, overflow: "hidden", border: "1px solid var(--border)", marginBottom: 48 }}>
          <Image
            src="https://images.unsplash.com/photo-1449244409830-a190c90c74fa?auto=format&fit=crop&w=1200&q=80"
            alt="Secure environment banner"
            fill
            unoptimized
            style={{ objectFit: "cover", opacity: 0.55 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,16,0.95) 0%, rgba(8,8,16,0.3) 100%)" }} />
          <div style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
            <span style={{ display: "inline-block", padding: "5px 12px", border: "1px solid rgba(201,169,110,0.25)", borderRadius: 99, background: "rgba(201,169,110,0.08)", color: "var(--gold)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
              Trust & Integrity
            </span>
            <h1 style={{ margin: 0, fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>
              Privacy Policy & Terms
            </h1>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: "grid", gap: 32 }}>
          {policySections.map((section, idx) => (
            <div 
              key={idx} 
              style={{ 
                padding: "40px", 
                background: "var(--surface)", 
                border: "1px solid var(--border)", 
                borderRadius: "14px",
                display: "grid",
                gap: "16px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                  {section.icon}
                </div>
                <h2 style={{ margin: 0, fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--text)" }}>
                  {section.title}
                </h2>
              </div>
              <p style={{ margin: 0, color: "var(--text-2)", fontSize: "0.95rem", lineHeight: 1.8 }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer contact note */}
        <div style={{ textAlign: "center", marginTop: 64, paddingTop: 40, borderTop: "1px solid var(--border)" }}>
          <p style={{ color: "var(--text-3)", fontSize: "0.9rem" }}>
            For specific privacy inquiries or data removal requests, please contact{" "}
            <a href="mailto:privacy@apexloom.studio" style={{ color: "var(--gold)", fontWeight: 600 }}>privacy@apexloom.studio</a>
          </p>
          <p style={{ color: "var(--text-3)", fontSize: "0.75rem", marginTop: 12 }}>
            Last updated: October 2026
          </p>
        </div>
      </section>
    </main>
  );
}
