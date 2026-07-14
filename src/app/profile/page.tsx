"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import Link from "next/link";
import { MapPin, Calendar, Users, Settings, LogOut, ArrowRight, Home } from "lucide-react";
import type { BookingRecord } from "@/models/Booking";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loadingUser, logout, showToast } = useApp();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loadingUser && !user) {
      showToast("Please log in to view your profile.", "warning");
      router.push("/login?redirect=/profile");
    }
  }, [user, loadingUser, router, showToast]);

  useEffect(() => {
    if (user) {
      // In a real app we'd fetch bookings for this specific user.
      // Here we fetch all bookings since it's a demo.
      fetch("/api/bookings")
        .then((res) => res.json())
        .then((data) => {
          setBookings(data.bookings || []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      logout();
      showToast("Logged out successfully.", "success");
      router.push("/");
    } catch {
      showToast("Failed to log out.", "error");
    }
  };

  if (loadingUser || !user || loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh] text-xs font-semibold" style={{ color: "var(--text-3)" }}>
        Loading profile data...
      </div>
    );
  }

  const handleCancelBooking = async (bookingId: string) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this reservation?");
    if (!confirmCancel) return;

    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (res.ok) {
        showToast("Booking cancelled successfully.", "success");
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "cancelled" } : b));
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to cancel booking.", "error");
      }
    } catch {
      showToast("Failed to connect to cancellations API.", "error");
    }
  };

  const now = new Date().toISOString().slice(0, 10);
  const upcomingBookings = bookings.filter(b => b.checkOut >= now);
  const pastBookings = bookings.filter(b => b.checkOut < now);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16 flex-grow w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Sidebar */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-6">
          {/* Profile Card */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "32px 24px", textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--gold)", fontSize: "2rem", fontWeight: 700 }}>
              {user.name.charAt(0)}
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", margin: "0 0 4px" }}>
              {user.name}
            </h2>
            <p style={{ margin: "0 0 16px", fontSize: "0.85rem", color: "var(--text-3)" }}>{user.email}</p>
            <span style={{ display: "inline-block", padding: "4px 12px", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "99px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-2)" }}>
              {user.role === "host" ? "Host Account" : "Guest Account"}
            </span>
          </div>

          {/* Navigation Links */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
            <div className="flex flex-col">
              <Link href="/profile" className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-2)] text-[var(--gold)]">
                <Calendar size={16} />
                <span className="text-sm font-semibold">My Trips</span>
              </Link>
              {user.role === "host" && (
                <Link href="/stays/manage" className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text)]">
                  <Home size={16} />
                  <span className="text-sm font-semibold">Host Dashboard</span>
                </Link>
              )}
              <button className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text)] text-left">
                <Settings size={16} />
                <span className="text-sm font-semibold">Account Settings</span>
              </button>
              <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-[var(--surface-2)] text-red-500 hover:text-red-400 text-left">
                <LogOut size={16} />
                <span className="text-sm font-semibold">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="md:col-span-8 lg:col-span-9 space-y-10">
          <div>
            <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "4px" }}>
              Travel Itinerary
            </span>
            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>
              Upcoming Trips
            </h1>
          </div>

          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map(booking => (
                <div key={booking.id} style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", opacity: booking.status === "cancelled" ? 0.6 : 1 }}>
                  <div style={{ position: "relative", height: "100%", minHeight: "180px", background: "var(--surface-2)" }}>
                    {booking.imageUrl ? (
                      <Image
                        src={booking.imageUrl}
                        alt={booking.stayTitle}
                        fill
                        unoptimized
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <>
                        <div style={{ position: "absolute", inset: 0, opacity: 0.2, background: "linear-gradient(45deg, var(--gold) 0%, transparent 100%)" }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Home size={32} style={{ color: "var(--gold)", opacity: 0.5 }} />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div style={{ padding: "24px 24px 24px 0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 style={{ margin: 0, fontSize: "1.25rem", fontFamily: "var(--font-playfair), Georgia, serif", fontWeight: 600, color: "var(--text)" }}>{booking.stayTitle}</h3>
                        {booking.status === "cancelled" ? (
                          <span style={{ padding: "4px 10px", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, borderRadius: "4px", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.25)", color: "#fca5a5" }}>
                            Cancelled
                          </span>
                        ) : (
                          <span style={{ padding: "4px 10px", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, borderRadius: "4px", background: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.25)", color: "#4ade80" }}>
                            Confirmed
                          </span>
                        )}
                      </div>
                      <p style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 16px", color: "var(--text-3)", fontSize: "0.85rem" }}>
                        <MapPin size={14} style={{ color: "var(--gold)" }} />
                        {booking.stayLocation}
                      </p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                      <div style={{ display: "flex", gap: "32px" }}>
                        <div>
                          <span style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "2px" }}>Dates</span>
                          <strong style={{ fontSize: "0.9rem", color: "var(--text)" }}>{booking.checkIn} — {booking.checkOut}</strong>
                        </div>
                        <div>
                          <span style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "2px" }}>Guests</span>
                          <strong style={{ fontSize: "0.9rem", color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                            <Users size={14} /> {booking.guests}
                          </strong>
                        </div>
                      </div>
                      
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          style={{
                            padding: "6px 14px",
                            background: "rgba(239, 68, 68, 0.05)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius: 8,
                            color: "#fca5a5",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
                            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.6)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)";
                            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                          }}
                        >
                          Cancel Trip
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "48px 32px", textAlign: "center" }}>
              <p style={{ color: "var(--text-3)", fontSize: "0.95rem", marginBottom: "24px" }}>You have no upcoming trips.</p>
              <Link href="/explore" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "var(--gold)", color: "var(--bg)", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700, transition: "transform 0.2s" }} className="hover:-translate-y-0.5">
                Start Exploring <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {pastBookings.length > 0 && (
            <div className="pt-10">
              <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", margin: "0 0 20px" }}>
                Past Trips
              </h2>
              <div className="space-y-3">
                {pastBookings.map(booking => (
                  <div key={booking.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px 24px", opacity: booking.status === "cancelled" ? 0.6 : 1 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "var(--text-2)" }}>{booking.stayTitle}</h4>
                      <p style={{ margin: "2px 0 0", color: "var(--text-3)", fontSize: "0.75rem" }}>{booking.stayLocation} · {booking.checkIn}</p>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: booking.status === "cancelled" ? "#fca5a5" : "var(--text-3)" }}>
                      {booking.status === "cancelled" ? "Cancelled" : "Completed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
