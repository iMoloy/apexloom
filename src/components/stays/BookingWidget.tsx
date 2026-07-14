"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import { Calendar, Users, Shield, ArrowRight, Check, Info, Loader2, Lock } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type BookingWidgetProps = {
  staySlug: string;
  pricePerNight: number;
  maxGuests: number;
  stayTitle: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px 12px 36px",
  background: "var(--surface-2)",
  border: "1px solid var(--border-2)",
  borderRadius: 8,
  color: "var(--text)",
  fontSize: "0.85rem",
  transition: "border-color 0.2s",
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

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "15px",
      color: "#f0ece2",
      fontFamily: '"Inter", "Helvetica Neue", sans-serif',
      "::placeholder": { color: "#5c5c6e" },
      iconColor: "#c9a96e",
    },
    invalid: { color: "#ef4444", iconColor: "#ef4444" },
  },
};

// ─── Inner checkout form (has access to Stripe context) ─────────────────────
function CheckoutForm({
  totalPrice,
  stayTitle,
  staySlug,
  checkIn,
  checkOut,
  guests,
  basePrice,
  curationFee,
  cleaningFee,
  onClose,
}: {
  totalPrice: number;
  stayTitle: string;
  staySlug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  basePrice: number;
  curationFee: number;
  cleaningFee: number;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { showToast } = useApp();

  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setProcessing(true);
    setProgress(15);
    setStatusText("Creating secure payment intent...");

    // Step 1: Create payment intent on server
    const intentRes = await fetch("/api/payments/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalPrice * 100, // convert to cents
        metadata: { staySlug, checkIn, checkOut, guests: String(guests) },
      }),
    });

    if (!intentRes.ok) {
      const data = await intentRes.json();
      setCardError(data.error || "Failed to initialize payment.");
      setProcessing(false);
      return;
    }

    const { clientSecret } = await intentRes.json();

    setProgress(45);
    setStatusText("Authorizing with Stripe...");

    // Step 2: Confirm card payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setCardError(error.message || "Payment failed.");
      setProcessing(false);
      setProgress(0);
      setStatusText("");
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      setProgress(80);
      setStatusText("Payment confirmed. Reserving stay...");

      // Step 3: Create the booking record
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staySlug, checkIn, checkOut, guests, paymentIntentId: paymentIntent.id }),
      });

      setProgress(100);

      if (bookingRes.ok) {
        setStatusText("Reservation confirmed!");
        showToast("Payment authorized & reservation confirmed!", "success");
        setTimeout(() => router.push("/profile"), 1500);
      } else {
        const data = await bookingRes.json();
        showToast(data.error || "Payment succeeded but booking failed. Contact support.", "error");
        setProcessing(false);
      }
    }
  };

  if (processing) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "40px 0", textAlign: "center" }}>
        {progress === 100 ? (
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "2px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e" }} className="animate-in zoom-in duration-300">
            <Check size={32} />
          </div>
        ) : (
          <div style={{ position: "relative", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "#635bff", animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#635bff" }}>{progress}%</span>
          </div>
        )}
        <div>
          <p style={{ margin: "0 0 6px", fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>
            {progress === 100 ? "Booking Confirmed!" : "Stripe Secure Processing"}
          </p>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-3)" }}>{statusText}</p>
        </div>
        {progress < 100 && (
          <div style={{ width: "100%", height: 4, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #635bff, #8b85ff)", transition: "width 0.4s ease", borderRadius: 99 }} />
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
      {/* Stripe Card Element */}
      <div>
        <label style={labelStyle}>Card Details</label>
        <div
          style={{
            padding: "14px 16px",
            background: "var(--surface-2)",
            border: "1px solid var(--border-2)",
            borderRadius: 8,
            transition: "border-color 0.2s",
          }}
        >
          <CardElement options={CARD_ELEMENT_OPTIONS} onChange={() => setCardError(null)} />
        </div>
        {cardError && (
          <p style={{ margin: "8px 0 0", fontSize: "0.8rem", color: "#ef4444" }}>{cardError}</p>
        )}
        <p style={{ margin: "8px 0 0", fontSize: "0.72rem", color: "var(--text-3)" }}>
          Use test card: <strong style={{ color: "var(--text-2)" }}>4242 4242 4242 4242</strong>, any future date, any 3-digit CVC.
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "16px",
          background: "#635bff",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: 700,
          fontSize: "0.95rem",
          cursor: !stripe ? "not-allowed" : "pointer",
          opacity: !stripe ? 0.7 : 1,
          transition: "all 0.2s",
          boxShadow: "0 4px 16px rgba(99,91,255,0.25)",
        }}
        className="hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,91,255,0.4)]"
      >
        <Lock size={15} />
        Pay ${totalPrice.toLocaleString()} securely
      </button>

      <p style={{ margin: 0, fontSize: "0.73rem", color: "var(--text-3)", textAlign: "center", lineHeight: 1.6 }}>
        <Lock size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
        Payments are encrypted and processed by Stripe. ApexLoom never stores your card details.
      </p>
    </form>
  );
}

// ─── Main BookingWidget ──────────────────────────────────────────────────────
export function BookingWidget({ staySlug, pricePerNight, maxGuests, stayTitle }: BookingWidgetProps) {
  const router = useRouter();
  const { user, showToast } = useApp();

  const [minDate] = useState(() => {
    if (typeof window === "undefined") return "";
    return new Date().toISOString().slice(0, 10);
  });

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showPaymentModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showPaymentModal]);

  const minCheckOutDate = React.useMemo(() => {
    if (!checkIn) return minDate;
    const date = new Date(checkIn);
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  }, [checkIn, minDate]);

  useEffect(() => {
    if (checkIn && checkOut && checkIn >= checkOut) {
      const nextDay = new Date(checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().slice(0, 10));
    }
  }, [checkIn, checkOut]);

  const nights = React.useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  }, [checkIn, checkOut]);

  const basePrice = nights * pricePerNight;
  const curationFee = 50 + (guests > 2 ? (guests - 2) * 10 : 0);
  const cleaningFee = 30 + (guests > 2 ? (guests - 2) * 15 : 0);
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
    setShowPaymentModal(true);
  };

  return (
    <>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 24, borderRadius: 12, display: "grid", gap: 24, boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}>
        {/* Price header */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingBottom: 18, borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>Curated rate</span>
          <div>
            <strong style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>${pricePerNight}</strong>
            <span style={{ color: "var(--text-3)", fontSize: "0.82rem" }}> / night</span>
          </div>
        </div>

        <form onSubmit={handleBooking} style={{ display: "grid", gap: 20 }}>
          {/* Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Check In</label>
              <div style={{ position: "relative" }}>
                <Calendar size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
                <input type="date" value={checkIn} min={minDate} onChange={(e) => setCheckIn(e.target.value)} style={inputStyle} required className="focus:border-[var(--gold)] focus:outline-none" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Check Out</label>
              <div style={{ position: "relative" }}>
                <Calendar size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
                <input type="date" value={checkOut} min={minCheckOutDate} onChange={(e) => setCheckOut(e.target.value)} style={inputStyle} required className="focus:border-[var(--gold)] focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div>
            <label style={labelStyle}>Guests</label>
            <div style={{ position: "relative" }}>
              <Users size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
              <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} style={{ ...inputStyle, appearance: "none" as const }} className="focus:border-[var(--gold)] focus:outline-none">
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                ))}
              </select>
              <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          {/* Pricing breakdown */}
          {nights > 0 && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300" style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "16px", display: "grid", gap: 12, fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-2)" }}>
                <span>${pricePerNight} × {nights} nights</span>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>${basePrice}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-2)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>Curation fee <Info size={12} style={{ color: "var(--text-3)" }} /></span>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>${curationFee}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-2)" }}>
                <span>Cleaning &amp; prep fee</span>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>${cleaningFee}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)", fontWeight: 700, color: "var(--text)", fontSize: "0.95rem" }}>
                <span>Total</span>
                <span style={{ color: "var(--gold)" }}>${totalPrice}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "16px", background: "var(--gold)", color: "var(--bg)", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 4px 14px rgba(201, 169, 110, 0.2)" }}
            className="hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(201,169,110,0.3)]"
          >
            Request Reservation <ArrowRight size={16} />
          </button>
        </form>

        {/* Trust badge */}
        <div style={{ display: "flex", gap: 12, padding: "16px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8 }}>
          <Shield size={16} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 2 }} />
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-3)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--text-2)", display: "block", marginBottom: 2 }}>ApexLoom Verified</strong>
            Payments secured by Stripe. Curation fees are fully refunded if your host cancels.
          </p>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {showPaymentModal && typeof document !== "undefined" && createPortal(
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(8, 8, 16, 0.88)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            overflowY: "auto",
            padding: "40px 16px",
          }}
          className="animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPaymentModal(false); }}
        >
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              maxWidth: 500,
              width: "100%",
              boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
              overflow: "hidden",
              position: "relative",
              margin: "auto",
            }}
            className="animate-in slide-in-from-bottom-4 duration-300"
          >
            {/* Header */}
            <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface-2)" }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)" }}>Secure Checkout</h3>
                <span style={{ fontSize: "0.75rem", color: "var(--text-3)", display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <Shield size={12} style={{ color: "#635bff" }} />
                  Powered by <strong style={{ color: "#635bff" }}>stripe</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)", fontSize: "1.2rem", cursor: "pointer" }}
                className="hover:bg-[var(--border)] hover:text-[var(--text)]"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: "24px", display: "grid", gap: 24 }}>
              {/* Order Summary */}
              <div style={{ background: "linear-gradient(145deg, var(--surface-2) 0%, var(--surface) 100%)", border: "1px solid var(--border)", borderLeft: "3px solid var(--gold)", borderRadius: 12, padding: "20px", display: "grid", gap: 16 }}>
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "1.1rem", fontFamily: "var(--font-playfair), Georgia, serif", fontWeight: 600, color: "var(--text)" }}>{stayTitle}</h4>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-3)", display: "flex", gap: 12, alignItems: "center" }}>
                    <span>{checkIn} to {checkOut}</span>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--border-2)" }} />
                    <span>{guests} {guests === 1 ? "Guest" : "Guests"}</span>
                  </p>
                </div>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "grid", gap: 8, fontSize: "0.85rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-3)" }}>Reservation Subtotal</span>
                    <span style={{ color: "var(--text)", fontWeight: 600 }}>${basePrice}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-3)" }}>Taxes &amp; Fees</span>
                    <span style={{ color: "var(--text)", fontWeight: 600 }}>${curationFee + cleaningFee}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed var(--border-2)", paddingTop: 12, marginTop: 4, fontWeight: 700, fontSize: "1.1rem" }}>
                    <span style={{ color: "var(--text)" }}>Total Due</span>
                    <span style={{ color: "var(--gold)" }}>${totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Stripe Elements */}
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  totalPrice={totalPrice}
                  stayTitle={stayTitle}
                  staySlug={staySlug}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guests={guests}
                  basePrice={basePrice}
                  curationFee={curationFee}
                  cleaningFee={cleaningFee}
                  onClose={() => setShowPaymentModal(false)}
                />
              </Elements>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
