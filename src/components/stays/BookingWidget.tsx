"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import { Calendar, Users, Shield, ArrowRight, Check } from "lucide-react";

type BookingWidgetProps = {
  staySlug: string;
  pricePerNight: number;
  maxGuests: number;
  stayTitle: string;
};

type BookingStatus = "idle" | "verifying" | "checking" | "confirming" | "success";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px 10px 36px",
  background: "var(--surface-2)",
  border: "1px solid var(--border-2)",
  borderRadius: 8,
  color: "var(--text)",
  fontSize: "0.84rem",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--text-3)",
};

export function BookingWidget({ staySlug, pricePerNight, maxGuests }: BookingWidgetProps) {
  const router = useRouter();
  const { user, showToast } = useApp();

  const [checkIn, setCheckIn] = useState(() => {
    if (typeof window === "undefined") return "";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });
  
  const [checkOut, setCheckOut] = useState(() => {
    if (typeof window === "undefined") return "";
    const leaveDate = new Date();
    leaveDate.setDate(leaveDate.getDate() + 4);
    return leaveDate.toISOString().slice(0, 10);
  });
  
  const [guests, setGuests] = useState(2);
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");

  const nights = React.useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  }, [checkIn, checkOut]);

  const basePrice = nights * pricePerNight;
  const curationFee = 50;
  const cleaningFee = 30;
  const totalPrice = basePrice + curationFee + cleaningFee;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast("Please sign in to make a reservation.", "warning");
      router.push(`/login?redirect=/stays/${staySlug}`);
      return;
    }

    if (user.role === "host") {
      showToast("Hosts cannot book curated stay listings.", "error");
      return;
    }

    if (nights <= 0) {
      showToast("Please choose valid check-in and check-out dates.", "error");
      return;
    }

    setStatus("verifying");
    setProgress(15);
    setStatusText("Verifying reservation dates...");

    setTimeout(() => {
      setProgress(45);
      setStatusText("Checking room and calendars...");

      setTimeout(() => {
        setProgress(75);
        setStatusText("Locking reservation price rates...");

        setTimeout(async () => {
          setProgress(100);
          setStatusText("Confirming with curator team...");

          try {
            const res = await fetch("/api/bookings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ staySlug, checkIn, checkOut, guests }),
            });

            if (res.ok) {
              setStatus("success");
              showToast("Reservation confirmed successfully!", "success");
              setTimeout(() => router.push("/stays/manage"), 1200);
            } else {
              const data = await res.json();
              showToast(data.error || "Reservation failed.", "error");
              setStatus("idle");
            }
          } catch {
            showToast("Failed to connect to bookings API.", "error");
            setStatus("idle");
          }
        }, 1000);
      }, 1000);
    }, 1000);
  };

  if (status !== "idle") {
    return (
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 28, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, minHeight: 300 }}>
        {status === "success" ? (
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e" }}>
            <Check size={24} />
          </div>
        ) : (
          <div style={{ position: "relative", width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--gold)", animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--gold)" }}>{progress}%</span>
          </div>
        )}
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 6px", fontWeight: 600, color: "var(--text)", fontSize: "0.9rem" }}>
            {status === "success" ? "Booking Confirmed!" : "Processing Reservation"}
          </p>
          <p style={{ margin: 0, color: "var(--text-3)", fontSize: "0.8rem" }}>{statusText}</p>
        </div>
        <div style={{ width: "100%", height: 3, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, var(--gold), var(--gold-2))", transition: "width 0.4s ease", borderRadius: 99 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 24, borderRadius: 12, display: "grid", gap: 20 }}>
      {/* Price header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingBottom: 18, borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>Curated rate</span>
        <div>
          <strong style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.8rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>${pricePerNight}</strong>
          <span style={{ color: "var(--text-3)", fontSize: "0.82rem" }}> / night</span>
        </div>
      </div>

      <form onSubmit={handleBooking} style={{ display: "grid", gap: 16 }}>
        {/* Dates */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={labelStyle}>Check In</label>
            <div style={{ position: "relative" }}>
              <Calendar size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={inputStyle} required />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Check Out</label>
            <div style={{ position: "relative" }}>
              <Calendar size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={inputStyle} required />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div>
          <label style={labelStyle}>Guests</label>
          <div style={{ position: "relative" }}>
            <Users size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              style={{ ...inputStyle, appearance: "none" as const }}
            >
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing breakdown */}
        {nights > 0 && (
          <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "16px 0", display: "grid", gap: 10, fontSize: "0.84rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-2)" }}>
              <span>${pricePerNight} × {nights} nights</span>
              <span style={{ fontWeight: 600, color: "var(--text)" }}>${basePrice}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-2)" }}>
              <span>Curation verification fee</span>
              <span style={{ fontWeight: 600, color: "var(--text)" }}>${curationFee}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-2)" }}>
              <span>Cleaning &amp; prep fee</span>
              <span style={{ fontWeight: 600, color: "var(--text)" }}>${cleaningFee}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)", fontWeight: 700, color: "var(--text)" }}>
              <span>Total</span>
              <span style={{ color: "var(--gold)" }}>${totalPrice}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            padding: "14px",
            background: "var(--gold)",
            color: "var(--bg)",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Request Reservation
          <ArrowRight size={16} />
        </button>
      </form>

      {/* Trust badge */}
      <div style={{ display: "flex", gap: 10, padding: "14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8 }}>
        <Shield size={15} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }} />
        <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-3)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--text-2)" }}>ApexLoom Verified:</strong> Rates are secured. Curation fees are fully refunded if your host cancels.
        </p>
      </div>
    </div>
  );
}
