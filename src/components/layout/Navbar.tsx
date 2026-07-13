"use client";

import Link from "next/link";
import { Menu, X, LogOut, LayoutDashboard, PlusCircle, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useApp } from "@/components/AppContext";

const links = [
  { label: "Discover", href: "/#discover" },
  { label: "Explore", href: "/explore" },
  { label: "Collections", href: "/#collections" },
  { label: "Journal", href: "/#journal" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const { user, logout, loadingUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="site-header"
      style={{
        borderBottomColor: scrolled ? "rgba(38,38,54,0.8)" : "transparent",
        background: scrolled
          ? "rgba(8,8,16,0.95)"
          : "rgba(8,8,16,0.6)",
      }}
    >
      <div className="nav-wrap">
        <Link href="/" aria-label="ApexLoom home" className="flex items-center gap-3">
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
                <div className="flex items-center gap-3">
                  {user.role === "host" ? (
                    <>
                      <Link
                        className="nav-link flex items-center gap-1.5"
                        href="/stays/manage"
                      >
                        <LayoutDashboard size={14} />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        className="nav-link flex items-center gap-1.5"
                        href="/stays/add"
                      >
                        <PlusCircle size={14} />
                        <span>Add stay</span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      className="nav-link flex items-center gap-1.5"
                      href="/profile"
                    >
                      <Bookmark size={14} />
                      <span>Profile & Bookings</span>
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: "rgba(201,169,110,0.15)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.3)" }}
                    >
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                    <button
                      onClick={logout}
                      className="nav-link flex items-center gap-1.5"
                      type="button"
                      aria-label="Log out"
                      style={{ color: "var(--text-3)" }}
                    >
                      <LogOut size={14} />
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
            {isOpen ? <X size={20} /> : <Menu size={20} />}
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
                    Dashboard
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
                className="text-left w-full px-3 py-2.5 rounded-lg"
                style={{ color: "#ef4444" }}
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
