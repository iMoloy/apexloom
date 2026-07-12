import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function Footer() {
  return (
    <footer className="site-footer" id="newsletter">
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
            <Link href="/#highlights">Highlights</Link>
          </div>
          <div className="footer-list">
            <p className="footer-label">ApexLoom</p>
            <Link href="/#journal">Journal</Link>
            <Link href="/#faq">FAQ</Link>
            <a href="mailto:hello@apexloom.studio">hello@apexloom.studio</a>
          </div>
          <div className="footer-list">
            <p className="footer-label">Follow</p>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ApexLoom. All rights reserved.</span>
          <span>Made for considered travel.</span>
        </div>
      </div>
    </footer>
  );
}
