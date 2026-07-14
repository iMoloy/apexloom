"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import Link from "next/link";
import { MapPin, Calendar, Users, Settings, LogOut, ArrowRight, Home, CreditCard, Mail, Phone, Shield, Camera, Loader2, Star, X } from "lucide-react";
import type { BookingRecord } from "@/models/Booking";
import Image from "next/image";

type Tab = "trips" | "settings";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loadingUser, logout, showToast, updateUser } = useApp();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("trips");

  // Profile image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);

  // Simulated settings state
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("+1 (555) 019-2837");
  const [location, setLocation] = useState("San Francisco, CA");
  const [isSaving, setIsSaving] = useState(false);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<BookingRecord | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewQuote, setReviewQuote] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Sync name state when user loads (handles async auth)
  useEffect(() => {
    if (user?.name && !name) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.name);
    }
  }, [user?.name]); // eslint-disable-line

  useEffect(() => {
    if (!loadingUser && !user) {
      showToast("Please log in to view your profile.", "warning");
      router.push("/login?redirect=/profile");
    }
  }, [user, loadingUser, router, showToast]);

  useEffect(() => {
    if (user) {
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

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        updateUser({ name });
        showToast("Profile settings updated successfully.", "success");
      } else {
        showToast("Failed to update profile.", "error");
      }
    } catch (error) {
      showToast("An error occurred while saving.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file.", "error");
      return;
    }

    setUploadingImage(true);
    setImageError(false);
    
    try {
      const formData = new FormData();
      formData.append("image", file);

      // Upload to ImgBB
      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      const imgbbData = await imgbbRes.json();

      if (imgbbData.success) {
        const photoURL = imgbbData.data.url;

        // Update the token on the server
        const updateRes = await fetch("/api/auth/update-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photoURL }),
        });

        if (updateRes.ok) {
          updateUser({ photoURL });
          showToast("Profile picture updated successfully.", "success");
        } else {
          showToast("Failed to save profile picture.", "error");
        }
      } else {
        showToast("Failed to upload image to provider.", "error");
      }
    } catch (error) {
      showToast("An error occurred during upload.", "error");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleOpenReview = (booking: BookingRecord) => {
    setReviewBooking(booking);
    setReviewRating(5);
    setReviewQuote("");
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking || submittingReview) return;

    if (!reviewQuote || reviewQuote.trim().length < 10) {
      showToast("Please provide a review of at least 10 characters.", "error");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staySlug: reviewBooking.staySlug,
          rating: reviewRating,
          quote: reviewQuote,
        }),
      });

      if (res.ok) {
        showToast("Review published successfully!", "success");
        setReviewModalOpen(false);
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to submit review.", "error");
      }
    } catch {
      showToast("Network error while submitting review.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loadingUser || !user || loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh] text-xs font-semibold" style={{ color: "var(--text-3)" }}>
        Loading profile data...
      </div>
    );
  }

  const now = new Date().toISOString().slice(0, 10);
  const upcomingBookings = bookings.filter(b => b.checkOut >= now);
  const pastBookings = bookings.filter(b => b.checkOut < now);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16 flex-grow w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Sidebar */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-6">
          {/* Profile Card */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "32px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-2) 100%)", opacity: 0.1 }} />
            
            <div 
              style={{ position: "relative", width: 88, height: 88, borderRadius: "50%", background: "var(--surface)", border: "2px solid var(--gold)", margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(201, 169, 110, 0.15)", cursor: uploadingImage ? "not-allowed" : "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}
              className="group"
              onClick={() => !uploadingImage && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                style={{ display: "none" }} 
              />
              
              {uploadingImage ? (
                <Loader2 size={24} className="animate-spin" style={{ color: "var(--gold)" }} />
              ) : user.photoURL && !imageError ? (
                <Image
                  src={user.photoURL}
                  alt={user.name}
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div style={{ color: "var(--gold)", fontSize: "2.4rem", fontWeight: 700 }}>
                  {user.name.charAt(0)}
                </div>
              )}

              {/* Hover Overlay */}
              {!uploadingImage && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(8, 8, 16, 0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }} className="group-hover:opacity-100">
                  <Camera size={20} style={{ color: "white", marginBottom: 2 }} />
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "white", textTransform: "uppercase" }}>Upload</span>
                </div>
              )}
            </div>
            
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", margin: "0 0 4px" }}>
              {user.name}
            </h2>
            <p style={{ margin: "0 0 16px", fontSize: "0.85rem", color: "var(--text-3)" }}>{user.email}</p>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "99px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-2)" }}>
              <Shield size={12} style={{ color: "var(--gold)" }} />
              {user.role === "host" ? "Host Account" : "Guest Account"}
            </span>
          </div>

          {/* Navigation Links */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
            <div className="flex flex-col">
              <button 
                onClick={() => setActiveTab("trips")}
                className={`flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] transition-colors text-left ${activeTab === 'trips' ? 'bg-[rgba(201,169,110,0.08)] text-[var(--gold)] border-l-2 border-l-[var(--gold)]' : 'hover:bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text)] border-l-2 border-l-transparent'}`}
              >
                <Calendar size={18} />
                <span className="text-sm font-semibold">My Trips</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] transition-colors text-left ${activeTab === 'settings' ? 'bg-[rgba(201,169,110,0.08)] text-[var(--gold)] border-l-2 border-l-[var(--gold)]' : 'hover:bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text)] border-l-2 border-l-transparent'}`}
              >
                <Settings size={18} />
                <span className="text-sm font-semibold">Account Settings</span>
              </button>

              {user.role === "host" && (
                <Link href="/stays/manage" className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text)] border-l-2 border-l-transparent">
                  <Home size={18} />
                  <span className="text-sm font-semibold">Host Dashboard</span>
                </Link>
              )}
              
              <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-[rgba(239,68,68,0.05)] text-red-500 hover:text-red-400 text-left border-l-2 border-l-transparent">
                <LogOut size={18} />
                <span className="text-sm font-semibold">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="md:col-span-8 lg:col-span-9 space-y-10 min-h-[500px]">
          
          {/* TRIPS TAB */}
          {activeTab === "trips" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "4px" }}>
                  Travel Itinerary
                </span>
                <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>
                  Upcoming Trips
                </h1>
              </div>

              {upcomingBookings.length > 0 ? (
                <div className="space-y-6">
                  {upcomingBookings.map(booking => (
                    <div key={booking.id} className="group" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", opacity: booking.status === "cancelled" ? 0.6 : 1, transition: "all 0.3s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                      <div style={{ position: "relative", height: "100%", minHeight: "200px", background: "var(--surface-2)", overflow: "hidden" }}>
                        {booking.imageUrl ? (
                          <Image
                            src={booking.imageUrl}
                            alt={booking.stayTitle}
                            fill
                            unoptimized
                            style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                            className="group-hover:scale-105"
                          />
                        ) : (
                          <>
                            <div style={{ position: "absolute", inset: 0, opacity: 0.2, background: "linear-gradient(45deg, var(--gold) 0%, transparent 100%)" }} />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Home size={32} style={{ color: "var(--gold)", opacity: 0.5 }} />
                            </div>
                          </>
                        )}
                        <div style={{ position: "absolute", top: 12, left: 12, padding: "4px 10px", background: "rgba(8, 8, 16, 0.7)", backdropFilter: "blur(4px)", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700, color: "white", letterSpacing: "0.05em" }}>
                          ${booking.totalPaid}
                        </div>
                      </div>
                      
                      <div style={{ padding: "24px 24px 24px 0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 style={{ margin: 0, fontSize: "1.3rem", fontFamily: "var(--font-playfair), Georgia, serif", fontWeight: 600, color: "var(--text)" }}>{booking.stayTitle}</h3>
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
                              <span style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "4px" }}>Dates</span>
                              <strong style={{ fontSize: "0.95rem", color: "var(--text)" }}>{booking.checkIn} — {booking.checkOut}</strong>
                            </div>
                            <div>
                              <span style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "4px" }}>Guests</span>
                              <strong style={{ fontSize: "0.95rem", color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                                <Users size={14} style={{ color: "var(--text-2)" }} /> {booking.guests}
                              </strong>
                            </div>
                          </div>
                          
                          {booking.status === "confirmed" && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              style={{
                                padding: "8px 16px",
                                background: "transparent",
                                border: "1px solid var(--border-2)",
                                borderRadius: 8,
                                color: "var(--text-2)",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
                                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                                e.currentTarget.style.color = "#fca5a5";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.borderColor = "var(--border-2)";
                                e.currentTarget.style.color = "var(--text-2)";
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
                <div style={{ background: "var(--surface)", border: "1px dashed var(--border-2)", borderRadius: "16px", padding: "64px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <Calendar size={32} style={{ color: "var(--gold)" }} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.6rem", fontWeight: 600, color: "var(--text)", margin: "0 0 12px" }}>Where to next?</h3>
                  <p style={{ color: "var(--text-3)", fontSize: "0.95rem", marginBottom: "32px", maxWidth: 400 }}>You don&apos;t have any upcoming trips booked. Discover extraordinary homes for your next escape.</p>
                  <Link href="/explore" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", background: "var(--gold)", color: "var(--bg)", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 4px 14px rgba(201, 169, 110, 0.25)" }} className="hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(201,169,110,0.4)]">
                    Explore Curated Stays <ArrowRight size={16} />
                  </Link>
                </div>
              )}

              {pastBookings.length > 0 && (
                <div className="pt-12">
                  <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", margin: "0 0 20px" }}>
                    Past Trips
                  </h2>
                  <div className="space-y-4">
                    {pastBookings.map(booking => (
                      <div key={booking.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px 24px", opacity: booking.status === "cancelled" ? 0.6 : 1, transition: "background 0.2s" }} className="hover:bg-[var(--surface-2)]">
                        <div>
                          <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "var(--text)" }}>{booking.stayTitle}</h4>
                          <p style={{ margin: "4px 0 0", color: "var(--text-3)", fontSize: "0.85rem", display: "flex", gap: 12, alignItems: "center" }}>
                            <span>{booking.stayLocation}</span>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--border-2)" }} />
                            <span>{booking.checkIn} to {booking.checkOut}</span>
                          </p>
                        </div>
                        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                          <strong style={{ display: "block", fontSize: "1rem", color: "var(--text)", marginBottom: 4 }}>${booking.totalPaid}</strong>
                          <span style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: booking.status === "cancelled" ? "#fca5a5" : "var(--gold)" }}>
                            {booking.status === "cancelled" ? "Cancelled" : "Completed"}
                          </span>
                          {booking.status !== "cancelled" && (
                            <button
                              onClick={() => handleOpenReview(booking)}
                              style={{
                                padding: "6px 12px",
                                background: "var(--surface-2)",
                                border: "1px solid var(--border-2)",
                                borderRadius: "6px",
                                color: "var(--text-2)",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                              className="hover:border-[var(--gold)] hover:text-[var(--gold)]"
                            >
                              Leave a Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "4px" }}>
                  Manage Details
                </span>
                <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>
                  Account Settings
                </h1>
              </div>

              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", overflow: "hidden" }}>
                <form onSubmit={handleSaveSettings} className="space-y-8">
                  
                  {/* Basic Info */}
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: "20px", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(201,169,110,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Users size={12} style={{ color: "var(--gold)" }} />
                      </span>
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-3)", marginBottom: "8px" }}>Full Name</label>
                        <input 
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          style={{ width: "100%", padding: "12px 16px", background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: "8px", color: "var(--text)" }} 
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-3)", marginBottom: "8px" }}>Email Address</label>
                        <div style={{ position: "relative" }}>
                          <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
                          <input 
                            type="email" 
                            value={user.email} 
                            disabled
                            style={{ width: "100%", padding: "12px 16px 12px 40px", background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: "8px", color: "var(--text-2)", opacity: 0.7, cursor: "not-allowed" }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ width: "100%", height: 1, background: "var(--border)" }} />

                  {/* Contact Details */}
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: "20px", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(201,169,110,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Phone size={12} style={{ color: "var(--gold)" }} />
                      </span>
                      Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-3)", marginBottom: "8px" }}>Phone Number</label>
                        <input 
                          type="text" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          style={{ width: "100%", padding: "12px 16px", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "8px", color: "var(--text)", transition: "border-color 0.2s" }} 
                          className="focus:border-[var(--gold)] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-3)", marginBottom: "8px" }}>Location</label>
                        <input 
                          type="text" 
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="City, Country"
                          style={{ width: "100%", padding: "12px 16px", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: "8px", color: "var(--text)", transition: "border-color 0.2s" }} 
                          className="focus:border-[var(--gold)] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods (Visual Only) */}
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
                        <CreditCard size={18} style={{ color: "var(--text-2)" }} /> Payment Methods
                      </h3>
                      <button type="button" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--gold)" }}>+ Add New</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: "8px" }}>
                      <div style={{ width: 48, height: 32, background: "#1a1f36", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.6rem", fontWeight: 700 }}>VISA</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 600, color: "var(--text)", fontSize: "0.9rem" }}>•••• •••• •••• 4242</p>
                        <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--text-3)" }}>Expires 12/28</p>
                      </div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-3)", padding: "4px 8px", background: "var(--surface-2)", borderRadius: 4 }}>Default</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      style={{
                        padding: "12px 28px",
                        background: "var(--gold)",
                        color: "var(--bg)",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                      }}
                      className="hover:-translate-y-0.5"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && reviewBooking && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(8, 8, 16, 0.85)",
          backdropFilter: "blur(12px)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}>
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            width: "100%",
            maxWidth: 480,
            padding: 32,
            position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }} className="animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setReviewModalOpen(false)}
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                background: "none",
                border: "none",
                color: "var(--text-3)",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--text)" }}>
              Rate your stay
            </h3>
            <p style={{ margin: "0 0 24px", color: "var(--text-3)", fontSize: "0.85rem", lineHeight: 1.5 }}>
              Share your experience at <strong>{reviewBooking.stayTitle}</strong> with the community.
            </p>

            <form onSubmit={handleSubmitReview} style={{ display: "grid", gap: 20 }}>
              <div>
                <label style={{ display: "block", marginBottom: 12, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>
                  Overall Rating
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: star <= reviewRating ? "var(--gold)" : "var(--border-2)",
                        transition: "color 0.2s"
                      }}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star size={32} fill={star <= reviewRating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>
                  Written Review
                </label>
                <textarea
                  placeholder="What made this place special? How was the host? Let others know about your trip."
                  value={reviewQuote}
                  onChange={(e) => setReviewQuote(e.target.value)}
                  style={{
                    width: "100%",
                    height: "120px",
                    padding: "16px",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border-2)",
                    borderRadius: 8,
                    color: "var(--text)",
                    fontSize: "0.9rem",
                    resize: "none",
                    fontFamily: "inherit"
                  }}
                  className="focus:border-[var(--gold)] focus:outline-none"
                  required
                  minLength={10}
                />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "var(--surface-2)",
                    color: "var(--text)",
                    border: "1px solid var(--border-2)",
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  style={{
                    flex: 2,
                    padding: "14px",
                    background: "var(--gold)",
                    color: "var(--bg)",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 700,
                    cursor: submittingReview ? "not-allowed" : "pointer",
                    opacity: submittingReview ? 0.7 : 1
                  }}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
