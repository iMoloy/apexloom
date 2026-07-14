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

  // Stripe checkout states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("242");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

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

  const handleBooking = (e: React.FormEvent) => {
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

    if (!cardName && user) {
      setCardName(user.name);
    }
    setShowPaymentModal(true);
  };

  const executeSimulatedPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentProcessing(true);
    setProgress(15);
    setStatusText("Contacting card issuer...");

    setTimeout(() => {
      setProgress(45);
      setStatusText("Verifying funds with Stripe network...");

      setTimeout(() => {
        setProgress(75);
        setStatusText("Creating secure transaction token...");

        setTimeout(async () => {
          setProgress(100);
          setStatusText("Confirming reservation with curator team...");

          try {
            const res = await fetch("/api/bookings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ staySlug, checkIn, checkOut, guests }),
            });

            if (res.ok) {
              showToast("Payment authorized & reservation confirmed!", "success");
              setShowPaymentModal(false);
              setStatus("success");
              setTimeout(() => router.push("/profile"), 1200);
            } else {
              const data = await res.json();
              showToast(data.error || "Simulated payment failed.", "error");
              setPaymentProcessing(false);
            }
          } catch {
            showToast("Failed to connect to bookings API.", "error");
            setPaymentProcessing(false);
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
    <>
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

      {/* Stripe Payment Modal */}
      {showPaymentModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(8, 8, 16, 0.8)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}>
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            maxWidth: 480,
            width: "100%",
            boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
            overflow: "hidden",
            position: "relative",
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "24px 24px 18px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)" }}>Secure Checkout</h3>
                <span style={{ fontSize: "0.72rem", color: "var(--text-3)", display: "flex", alignItems: "center", gap: 4 }}>
                  Powered by <strong style={{ color: "#635bff" }}>stripe</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => { if (!paymentProcessing) setShowPaymentModal(false); }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-3)",
                  fontSize: "1.2rem",
                  cursor: paymentProcessing ? "not-allowed" : "pointer",
                }}
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: 24, display: "grid", gap: 20 }}>
              {/* Order Summary */}
              <div style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 10, padding: 16, display: "grid", gap: 8, fontSize: "0.84rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-3)" }}>Reservation Subtotal:</span>
                  <span style={{ color: "var(--text)", fontWeight: 600 }}>${basePrice}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-3)" }}>Curation &amp; Prep fees:</span>
                  <span style={{ color: "var(--text)", fontWeight: 600 }}>$80</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-2)", paddingTop: 8, fontWeight: 700 }}>
                  <span style={{ color: "var(--text-2)" }}>Total Charged:</span>
                  <span style={{ color: "var(--gold)" }}>${totalPrice}</span>
                </div>
              </div>

              {paymentProcessing ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "32px 0", textAlign: "center", minHeight: 180, justifyContent: "center" }}>
                  <div style={{ position: "relative", width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "#635bff", animation: "spin 1s linear infinite" }} />
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#635bff" }}>{progress}%</span>
                  </div>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>Stripe Processing</p>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-3)" }}>{statusText}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={executeSimulatedPayment} style={{ display: "grid", gap: 16 }}>
                  {/* Cardholder Name */}
                  <div>
                    <label style={labelStyle}>Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required
                      style={{ ...inputStyle, paddingLeft: 14 }}
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label style={labelStyle}>Card Number</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        required
                        style={{ ...inputStyle, paddingLeft: 14 }}
                      />
                      <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 24, height: 16, background: "#635bff", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.5rem", fontWeight: 700, color: "#fff" }}>
                        VISA
                      </div>
                    </div>
                  </div>

                  {/* Expiry + CVC */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Expiration Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        required
                        style={{ ...inputStyle, paddingLeft: 14 }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        required
                        style={{ ...inputStyle, paddingLeft: 14 }}
                      />
                    </div>
                  </div>

                  {/* Pay Button */}
                  <button
                    type="submit"
                    style={{
                      padding: "14px",
                      background: "#635bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      marginTop: 8,
                      boxShadow: "0 4px 16px rgba(99,91,255,0.25)",
                    }}
                  >
                    Pay ${totalPrice}
                  </button>
                </form>
              )}

              {/* Secure disclaimer */}
              <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--text-3)", textAlign: "center", lineHeight: 1.5 }}>
                Your card details are fully simulated for educational demonstration. Do not enter actual credentials.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
