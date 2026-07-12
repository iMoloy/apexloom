import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function Footer() {
  return (
    <footer className="site-footer" id="newsletter">
      <div className="footer-wrap">
        <div className="footer-top">
          <div><Link href="/"><BrandLogo /></Link><p className="footer-heading">Remarkable places, considered well.</p></div>
          <div className="footer-list"><p className="footer-label">Explore</p><a href="#discover">Discover</a><a href="#collections">Collections</a><a href="#journal">Journal</a></div>
          <div className="footer-list"><p className="footer-label">ApexLoom</p><a href="mailto:hello@apexloom.studio">Contact</a><a href="#newsletter">Newsletter</a><a href="#discover">List a space</a></div>
          <div className="footer-list"><p className="footer-label">Follow</p><a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} ApexLoom. All rights reserved.</span><span>Made for considered travel.</span></div>
      </div>
    </footer>
  );
}
