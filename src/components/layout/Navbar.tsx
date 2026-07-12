"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const links = [
  { label: "Discover", href: "/#discover" },
  { label: "Explore", href: "/explore" },
  { label: "Collections", href: "/#collections" },
  { label: "Journal", href: "/#journal" },
  { label: "FAQ", href: "/#faq" },
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
            <Link className="nav-link" href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Link className="nav-link" href="/#reviews">
            Guest notes
          </Link>
          <Link className="nav-cta" href="/#newsletter">
            Join updates
          </Link>
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
            <Link href={link.href} key={link.label} onClick={() => setIsOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/#reviews" onClick={() => setIsOpen(false)}>
            Guest notes
          </Link>
          <Link className="nav-cta" href="/#newsletter" onClick={() => setIsOpen(false)}>
            Join updates
          </Link>
        </nav>
      )}
    </header>
  );
}
