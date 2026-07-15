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

      <style>{`
        .footer-bento {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          border-bottom: 1px solid var(--border);
          width: 100%;
        }
        .footer-bento > div {
          padding: 12px 5%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
        }
        /* Top Left (Logo) */
        .footer-bento > div:nth-child(1) {
          grid-column: span 8;
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          align-items: flex-start;
          text-align: left;
        }
        /* Top Right (Explore) */
        .footer-bento > div:nth-child(2) {
          grid-column: span 4;
          border-bottom: 1px solid var(--border);
          align-items: flex-start;
          text-align: left;
        }
        /* Bottom Left (ApexLoom) - Wider for links */
        .footer-bento > div:nth-child(3) {
          grid-column: span 6;
          border-right: 1px solid var(--border);
          align-items: flex-start;
          text-align: left;
        }
        /* Bottom Right (Socials) */
        .footer-bento > div:nth-child(4) {
          grid-column: span 6;
          align-items: flex-start;
          text-align: left;
        }
        
        .footer-bento h4 {
          margin: 0 0 8px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text);
        }
        .footer-bento a, .footer-bento p, .footer-bento span {
          color: var(--text-2);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-bento a:hover {
          color: var(--gold);
        }

        @media (max-width: 1024px) {
          .footer-bento {
            grid-template-columns: repeat(2, 1fr);
          }
          .footer-bento > div {
            padding: 12px 5%;
          }
          .footer-bento > div:nth-child(1),
          .footer-bento > div:nth-child(2),
          .footer-bento > div:nth-child(3),
          .footer-bento > div:nth-child(4) {
            grid-column: span 1;
          }
        }

        @media (max-width: 768px) {
          .footer-bento {
            grid-template-columns: 1fr;
          }
          .footer-bento > div:nth-child(1),
          .footer-bento > div:nth-child(2),
          .footer-bento > div:nth-child(3),
          .footer-bento > div:nth-child(4) {
            grid-column: span 1;
            border-right: none !important;
            border-bottom: 1px solid var(--border);
          }
          .footer-bento > div:last-child {
            border-bottom: none;
          }
        }
      `}</style>

      <div className="footer-bento">
        {/* Section 1 - Top Left */}
        <div>
          <Link href="/">
            <BrandLogo />
          </Link>
          <p style={{ marginTop: 4, fontSize: "0.85rem", lineHeight: 1.5, width: "100%" }}>
            A curated stay platform for people who care about atmosphere, clarity, and better trip decisions.
          </p>
        </div>
        
        {/* Section 2 - Top Right */}
        <div>
          <h4>Explore</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, width: "100%" }}>
            <Link href="/#discover" style={{ fontSize: "0.85rem" }}>Discover</Link>
            <Link href="/explore" style={{ fontSize: "0.85rem" }}>Explore stays</Link>
            <Link href="/#collections" style={{ fontSize: "0.85rem" }}>Collections</Link>
          </div>
        </div>

        {/* Section 3 - Bottom Left */}
        <div>
          <h4>Company</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, width: "100%" }}>
            <Link href="/about" style={{ fontSize: "0.85rem" }}>About</Link>
            <Link href="/contact" style={{ fontSize: "0.85rem" }}>Contact</Link>
            <Link href="/privacy" style={{ fontSize: "0.85rem" }}>Privacy & Terms</Link>
            <Link href="/#faq" style={{ fontSize: "0.85rem" }}>FAQ</Link>
            <a href="mailto:hello@apexloom.studio" style={{ fontSize: "0.85rem", color: "var(--gold)" }}>hello@apexloom.studio</a>
          </div>
        </div>

        {/* Section 4 - Bottom Right */}
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ padding: "6px", background: "var(--surface-2)", borderRadius: "50%" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ padding: "6px", background: "var(--surface-2)", borderRadius: "50%" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <span style={{ color: "var(--gold)", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Made for considered travel.
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-3)", display: "flex", gap: 8, alignItems: "center" }}>
              <span>© {new Date().getFullYear()} ApexLoom. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
