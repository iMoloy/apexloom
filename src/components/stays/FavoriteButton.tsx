"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useApp } from "@/components/AppContext";

type FavoriteButtonProps = {
  staySlug: string;
  style?: React.CSSProperties;
  className?: string;
  size?: number;
};

export function FavoriteButton({ staySlug, style, className, size = 16 }: FavoriteButtonProps) {
  const router = useRouter();
  const { user, showToast } = useApp();
  const [isFavorited, setIsFavorited] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (user) {
      fetch("/api/favorites")
        .then((res) => res.json())
        .then((data) => {
          const items = data.items || [];
          setIsFavorited(items.some((item: any) => item.slug === staySlug));
        })
        .catch(() => undefined);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFavorited(false);
    }
  }, [user, staySlug]);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast("Please sign in to add to wishlist.", "warning");
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setToggling(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staySlug }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsFavorited(data.favorited);
        showToast(data.message, "success");
      } else {
        showToast(data.error || "Failed to toggle wishlist.", "error");
      }
    } catch {
      showToast("Failed to toggle wishlist.", "error");
    } finally {
      setToggling(false);
    }
  };

  return (
    <button
      onClick={handleFavoriteToggle}
      disabled={toggling}
      className={className}
      aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
      style={{
        position: "absolute",
        zIndex: 10,
        width: size * 2.2,
        height: size * 2.2,
        borderRadius: "50%",
        background: "rgba(8, 8, 16, 0.75)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: toggling ? "not-allowed" : "pointer",
        color: isFavorited ? "#ef4444" : "var(--text-3)",
        transition: "all 0.2s ease-in-out",
        backdropFilter: "blur(4px)",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!isFavorited) e.currentTarget.style.color = "var(--text)";
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        if (!isFavorited) e.currentTarget.style.color = "var(--text-3)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <Heart size={size} fill={isFavorited ? "#ef4444" : "none"} />
    </button>
  );
}
