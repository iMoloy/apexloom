"use client";

import Link from "next/link";
import { Menu, X, LogOut, LayoutDashboard, PlusCircle, Bookmark } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useApp } from "@/components/AppContext";

const links = [
  { label: "Discover", href: "/#discover" },
  { label: "Explore", href: "/explore" },
  { label: "Collections", href: "/#collections" },
  { label: "Journal", href: "/#journal" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const { user, logout, loadingUser } = useApp();
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
          {!loadingUser && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  {user.role === "host" ? (
                    <>
                      <Link className="nav-link flex items-center gap-1.5" href="/stays/manage">
                        <LayoutDashboard size={15} />
                        <span>Manage stays</span>
                      </Link>
                      <Link className="nav-link flex items-center gap-1.5" href="/stays/add">
                        <PlusCircle size={15} />
                        <span>Add stay</span>
                      </Link>
                    </>
                  ) : (
                    <Link className="nav-link flex items-center gap-1.5" href="/stays/manage">
                      <Bookmark size={15} />
                      <span>My bookings</span>
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-forest text-paper text-xs font-bold flex items-center justify-center shadow-inner">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </span>
                    <button
                      onClick={logout}
                      className="nav-link flex items-center gap-1 hover:text-clay transition-colors"
                      type="button"
                      aria-label="Log out"
                    >
                      <LogOut size={15} />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link className="nav-cta" href="/login">
                  Sign In
                </Link>
              )}
            </>
          )}
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
          {user ? (
            <>
              {user.role === "host" ? (
                <>
                  <Link href="/stays/manage" onClick={() => setIsOpen(false)}>
                    Manage stays
                  </Link>
                  <Link href="/stays/add" onClick={() => setIsOpen(false)}>
                    Add stay
                  </Link>
                </>
              ) : (
                <Link href="/stays/manage" onClick={() => setIsOpen(false)}>
                  My bookings
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-left w-full px-5 py-3 border-t border-line/20 text-clay"
              >
                Logout ({user.name})
              </button>
            </>
          ) : (
            <Link className="nav-cta" href="/login" onClick={() => setIsOpen(false)}>
              Sign In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

