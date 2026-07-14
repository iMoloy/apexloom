"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import { StayCard } from "@/components/stays/StayCard";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { StayItem } from "@/data/stays";

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loadingUser, showToast } = useApp();
  const [favorites, setFavorites] = useState<StayItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loadingUser && !user) {
      showToast("Please log in to view your wishlist.", "warning");
      router.push("/login?redirect=/favorites");
    }
  }, [user, loadingUser, router, showToast]);

  useEffect(() => {
    if (user) {
      fetch("/api/favorites")
        .then((res) => res.json())
        .then((data) => {
          setFavorites(data.items || []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          showToast("Failed to fetch favorites.", "error");
        });
    }
  }, [user, showToast]);

  if (loadingUser || !user || loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh] text-xs font-semibold" style={{ color: "var(--text-3)" }}>
        Loading wishlist stays...
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16 flex-grow w-full">
      <div style={{ marginBottom: 40 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", border: "1px solid rgba(201,169,110,0.25)", borderRadius: 99, background: "rgba(201,169,110,0.08)", color: "var(--gold)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
          <Heart size={10} fill="var(--gold)" /> Wishlist
        </span>
        <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2.5rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>
          Your Saved Retreats
        </h1>
        <p style={{ margin: "8px 0 0", color: "var(--text-3)", fontSize: "0.95rem" }}>
          Curated listings you are keeping an eye on for considered travel.
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((stay) => (
            <StayCard key={stay.slug} stay={stay} />
          ))}
        </div>
      ) : (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "64px 32px", textAlign: "center" }}>
          <p style={{ color: "var(--text-3)", fontSize: "0.95rem", marginBottom: "24px" }}>Your wishlist is empty.</p>
          <Link href="/explore" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "var(--gold)", color: "var(--bg)", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700, transition: "transform 0.2s" }} className="hover:-translate-y-0.5">
            Explore Curated Stays <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </main>
  );
}
