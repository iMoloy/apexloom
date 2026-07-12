"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const links = ["Discover", "Collections", "Journal"];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link href="/" aria-label="ApexLoom home"><BrandLogo /></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {links.map((link) => <a className="nav-link" href={`#${link.toLowerCase()}`} key={link}>{link}</a>)}
        </nav>
        <div className="nav-actions">
          <a className="nav-link" href="#newsletter">Sign in</a>
          <a className="nav-cta" href="#newsletter">List a space</a>
          <button className="menu-trigger" type="button" aria-label="Toggle menu" aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
            {isOpen ? <X size={21} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          {links.map((link) => <a href={`#${link.toLowerCase()}`} key={link} onClick={() => setIsOpen(false)}>{link}</a>)}
          <a href="#newsletter" onClick={() => setIsOpen(false)}>Sign in</a>
          <a className="nav-cta" href="#newsletter" onClick={() => setIsOpen(false)}>List a space</a>
        </nav>
      )}
    </header>
  );
}
