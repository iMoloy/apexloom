"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, PlusCircle, Bookmark, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
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
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState("");
  const { user, logout, loadingUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setCurrentHash(window.location.hash);
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname]);

  // Scroll spy for homepage sections
  useEffect(() => {
    if (pathname !== "/") return;
    
    const handleScroll = () => {
      const sections = ["discover", "collections", "journal"];
      let current = "";
      
      if (window.scrollY < 200) {
        current = "";
      } else {
        for (const id of sections) {
          const element = document.getElementById(id);
          if (element) {
            const rect = element.getBoundingClientRect();
            // If the top of the section is above the middle of the viewport
            if (rect.top <= window.innerHeight / 3) {
              current = `#${id}`;
            }
          }
        }
      }
      
      if (window.location.hash !== current) {
        setCurrentHash(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

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

        <nav className="nav-links hidden md:flex" aria-label="Primary navigation">
          {links.map((link) => {
            const currentFullPath = pathname + currentHash;
            const isActive = currentFullPath === link.href || (pathname === link.href && !link.href.includes("#"));
            return (
              <Link className={`nav-link ${isActive ? "active" : ""}`} href={link.href} key={link.label} style={isActive ? { color: "var(--gold)" } : {}}>
                {link.label}
              </Link>
            );
          })}
          {!loadingUser && user && (
            <>
              <div style={{ width: 1, height: 24, background: "var(--border)", margin: "0 8px" }} />
              <Link className={`nav-link flex items-center gap-1.5 ${pathname === "/favorites" ? "active" : ""}`} href="/favorites" style={pathname === "/favorites" ? { color: "var(--gold)" } : {}}>
                <Heart size={14} style={pathname !== "/favorites" ? { color: "var(--gold)" } : {}} />
                <span>Wishlist</span>
              </Link>
              {user.role === "host" ? (
                <>
                  <Link className={`nav-link flex items-center gap-1.5 ${pathname === "/stays/manage" ? "active" : ""}`} href="/stays/manage" style={pathname === "/stays/manage" ? { color: "var(--gold)" } : {}}>
                    <LayoutDashboard size={14} />
                    <span>Dashboard</span>
                  </Link>
                  <Link className={`nav-link flex items-center gap-1.5 ${pathname === "/stays/add" ? "active" : ""}`} href="/stays/add" style={pathname === "/stays/add" ? { color: "var(--gold)" } : {}}>
                    <PlusCircle size={14} />
                    <span>Add stay</span>
                  </Link>
                </>
              ) : (
                <Link className={`nav-link flex items-center gap-1.5 ${pathname === "/profile" ? "active" : ""}`} href="/profile" style={pathname === "/profile" ? { color: "var(--gold)" } : {}}>
                  <Bookmark size={14} />
                  <span>Bookings</span>
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="nav-actions">
          {!loadingUser && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Link href="/profile" className="flex-shrink-0" aria-label="Go to profile">
                      {user.photoURL ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[rgba(201,169,110,0.3)] relative">
                          <Image src={user.photoURL} alt={user.name} fill unoptimized style={{ objectFit: "cover" }} />
                        </div>
                      ) : (
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: "rgba(201,169,110,0.15)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.3)" }}
                        >
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={logout}
                      className="stay-card__action"
                      type="button"
                      aria-label="Log out"
                      style={{ padding: "6px 14px" }}
                    >
                      <LogOut size={14} />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link className="stay-card__action" href="/login" style={{ padding: "6px 14px" }}>
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
          {links.map((link) => {
            const currentFullPath = pathname + currentHash;
            const isActive = currentFullPath === link.href || (pathname === link.href && !link.href.includes("#"));
            return (
              <Link href={link.href} key={link.label} onClick={() => setIsOpen(false)} style={isActive ? { color: "var(--gold)" } : {}}>
                {link.label}
              </Link>
            );
          })}
          {user ? (
            <>
              <Link href="/favorites" onClick={() => setIsOpen(false)} style={pathname === "/favorites" ? { color: "var(--gold)" } : {}}>
                Wishlist
              </Link>
              {user.role === "host" ? (
                <>
                  <Link href="/stays/manage" onClick={() => setIsOpen(false)} style={pathname === "/stays/manage" ? { color: "var(--gold)" } : {}}>
                    Dashboard
                  </Link>
                  <Link href="/stays/add" onClick={() => setIsOpen(false)} style={pathname === "/stays/add" ? { color: "var(--gold)" } : {}}>
                    Add stay
                  </Link>
                </>
              ) : (
                <Link href="/profile" onClick={() => setIsOpen(false)} style={pathname === "/profile" ? { color: "var(--gold)" } : {}}>
                  My bookings
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="stay-card__action"
                style={{ width: "100%", marginTop: 8, padding: "8px 16px" }}
              >
                Logout ({user.name})
              </button>
            </>
          ) : (
            <Link className="stay-card__action" href="/login" onClick={() => setIsOpen(false)} style={{ padding: "8px 16px" }}>
              Sign In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
