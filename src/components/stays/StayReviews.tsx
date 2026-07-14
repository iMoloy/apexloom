"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import { Star, MessageSquare, Send } from "lucide-react";

type Review = {
  author: string;
  role: string;
  rating: number;
  quote: string;
};

type StayReviewsProps = {
  initialReviews: Review[];
  staySlug: string;
};

export function StayReviews({ initialReviews, staySlug }: StayReviewsProps) {
  const router = useRouter();
  const { user, showToast } = useApp();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [quote, setQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast("Please sign in to write a review.", "warning");
      return;
    }

    if (!quote.trim()) {
      showToast("Review text cannot be empty.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/stays/${staySlug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, quote }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Review submitted successfully!", "success");
        setReviews(data.reviews);
        setQuote("");
        setRating(5);
        router.refresh(); // Automatically reload Server Component metrics (rating/reviewCount)
      } else {
        showToast(data.error || "Failed to submit review.", "error");
      }
    } catch {
      showToast("Failed to connect to reviews API.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 32, display: "grid", gap: 32 }}>
      {/* Header */}
      <div>
        <p style={{ margin: "0 0 6px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 16, height: 1, background: "var(--gold)", display: "inline-block" }} />
          Guest notes
        </p>
        <h2 style={{ margin: "0 0 8px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.6rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>
          Recent reviews ({reviews.length})
        </h2>
      </div>

      {/* Review List */}
      <div style={{ display: "grid", gap: 16 }}>
        {reviews.map((review, idx) => (
          <div
            key={`${review.author}-${idx}`}
            style={{ padding: "20px 22px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10 }}
          >
            {/* Author row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Avatar */}
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontWeight: 700, fontSize: "0.84rem", flexShrink: 0 }}>
                  {review.author.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: "var(--text)", fontSize: "0.9rem" }}>{review.author}</p>
                  <p style={{ margin: 0, color: "var(--text-3)", fontSize: "0.75rem" }}>{review.role}</p>
                </div>
              </div>
              {/* Stars */}
              <div style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 20 20" style={{ fill: i < review.rating ? "#c9a96e" : "var(--border-2)" }}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p style={{ margin: 0, color: "var(--text-2)", fontSize: "0.875rem", lineHeight: 1.75, fontStyle: "italic" }}>
              &ldquo;{review.quote}&rdquo;
            </p>
          </div>
        ))}
      </div>

      {/* Review Submission Form */}
      {user ? (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 32 }}>
          <h3 style={{ margin: "0 0 20px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.25rem", fontWeight: 600, color: "var(--text)" }}>
            Share Your Experience
          </h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
            {/* Stars Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: "0.84rem", color: "var(--text-3)", fontWeight: 500 }}>Your Rating:</span>
              <div style={{ display: "flex", gap: 4 }}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const starVal = i + 1;
                  const active = starVal <= (hoverRating ?? rating);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(starVal)}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(null)}
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: active ? "var(--gold)" : "var(--border-2)", transition: "color 0.1s" }}
                    >
                      <Star size={20} fill={active ? "var(--gold)" : "none"} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Field */}
            <div style={{ position: "relative" }}>
              <MessageSquare size={16} style={{ position: "absolute", left: 14, top: 14, color: "var(--text-3)" }} />
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Write your review about the ambiance, workspace comfort, host communication..."
                rows={4}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-2)",
                  borderRadius: 10,
                  color: "var(--text)",
                  fontSize: "0.88rem",
                  lineHeight: 1.6,
                  resize: "vertical",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--gold)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border-2)"}
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 24px",
                  background: "var(--gold)",
                  color: "var(--bg)",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: submitting ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {submitting ? "Submitting..." : "Submit Review"}
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 32, textAlign: "center" }}>
          <p style={{ color: "var(--text-3)", fontSize: "0.88rem" }}>
            Please <a href="/login" style={{ color: "var(--gold)", fontWeight: 600 }}>Sign In</a> to share your review.
          </p>
        </div>
      )}
    </div>
  );
}
