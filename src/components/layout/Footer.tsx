import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function Footer() {
  return (
    <footer className="site-footer" id="newsletter">
      {/* Newsletter strip */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--surface-2)",
      }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px 32px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>
              Stay in the loop
            </p>
            <h3 style={{ margin: 0, fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.6rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>
              New properties, every week.
            </h3>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Email address for newsletter"
              style={{
                minWidth: 240,
                padding: "11px 18px",
                background: "var(--surface)",
                border: "1px solid var(--border-2)",
                borderRadius: 8,
                color: "var(--text)",
                fontSize: "0.875rem",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "11px 24px",
                background: "var(--gold)",
                color: "var(--bg)",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="footer-wrap">
        <div className="footer-top">
          <div>
            <Link href="/">
              <BrandLogo />
            </Link>
            <p className="footer-heading">
              A curated stay platform for people who care about atmosphere,
              clarity, and better trip decisions.
            </p>
          </div>
          <div className="footer-list">
            <p className="footer-label">Explore</p>
            <Link href="/#discover">Discover</Link>
            <Link href="/explore">Explore stays</Link>
            <Link href="/#collections">Collections</Link>
          </div>
          <div className="footer-list">
            <p className="footer-label">ApexLoom</p>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy & Terms</Link>
            <Link href="/#faq">FAQ</Link>
            <a href="mailto:hello@apexloom.studio">hello@apexloom.studio</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ApexLoom. All rights reserved.</span>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
          <span style={{ color: "var(--gold)", fontWeight: 500 }}>Made for considered travel.</span>
        </div>
      </div>
    </footer>
  );
}
