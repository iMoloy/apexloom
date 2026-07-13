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
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ display: "flex", alignItems: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ display: "flex", alignItems: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
          <span style={{ color: "var(--gold)", fontWeight: 500 }}>Made for considered travel.</span>
        </div>
      </div>
    </footer>
  );
}
