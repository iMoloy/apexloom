"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const links = [
  { label: "Discover", href: "#discover" },
  { label: "Collections", href: "#collections" },
  { label: "Highlights", href: "#highlights" },
  { label: "Journal", href: "#journal" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link href="/" aria-label="ApexLoom home">
          <BrandLogo />
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {links.map((link) => (
            <a className="nav-link" href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="nav-link" href="#reviews">
            Guest notes
          </a>
          <a className="nav-cta" href="#newsletter">
            Join updates
          </a>
          <button
            className="menu-trigger"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={21} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          {links.map((link) => (
            <a href={link.href} key={link.label} onClick={() => setIsOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#reviews" onClick={() => setIsOpen(false)}>
            Guest notes
          </a>
          <a className="nav-cta" href="#newsletter" onClick={() => setIsOpen(false)}>
            Join updates
          </a>
        </nav>
      )}
    </header>
  );
}
