"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Home,
  MapPin,
  Trash2,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Award,
} from "lucide-react";
import Link from "next/link";
import type { StayItem } from "@/data/stays";
import type { BookingRecord } from "@/models/Booking";
import Image from "next/image";

const impressionData = [
  { month: "Feb", views: 180, inquiries: 45 },
  { month: "Mar", views: 290, inquiries: 80 },
  { month: "Apr", views: 340, inquiries: 110 },
  { month: "May", views: 510, inquiries: 160 },
  { month: "Jun", views: 680, inquiries: 210 },
  { month: "Jul", views: 820, inquiries: 280 },
];

const categoryData = [
  { name: "Quiet Cities", bookings: 14, revenue: 3990 },
  { name: "Slow Weekends", bookings: 8, revenue: 2880 },
  { name: "Retreats", bookings: 12, revenue: 5880 },
];

export default function ManageStaysPage() {
  const router = useRouter();
  const { user, loadingUser, showToast } = useApp();

  const [stays, setStays] = useState<StayItem[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [chartMode, setChartMode] = useState<"views" | "revenue">("views");

  useEffect(() => {
    if (!loadingUser && !user) {
      showToast("Authentication required.", "warning");
      router.push("/login?redirect=/stays/manage");
    }
  }, [user, loadingUser, router, showToast]);

  const fetchData = useCallback(async () => {
    try {
      const resStays = await fetch("/api/stays");
      const dataStays = await resStays.json();
      
      // Fetch bookings
      const resBookings = await fetch("/api/bookings");
      const dataBookings = await resBookings.json();

      if (resStays.ok && resBookings.ok) {
        setStays(dataStays.items || []);
        setBookings(dataBookings.bookings || []);
      }
    } catch (err) {
      showToast("Failed to retrieve dashboard records.", "error");
    } finally {
      setLoadingData(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, [user, fetchData]);

  const handleDeleteStay = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to remove the curated listing "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/stays/${slug}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Stay deleted successfully.", "success");
        setStays((current) => current.filter((s) => s.slug !== slug));
      } else {
        const data = await res.json();
        showToast(data.error || "Unable to delete listing.", "error");
      }
    } catch (err) {
      showToast("Failed to communicate with listing API.", "error");
    }
  };

  if (loadingUser || !user || loadingData) {
    return (
      <div className="flex-grow flex items-center justify-center p-20 text-xs font-semibold" style={{ color: "var(--text-3)" }}>
        Loading dashboard configurations...
      </div>
    );
  }

  // Filter stays managed by this host
  const hostStays = stays.filter((s: any) => s.ownerEmail === user.email || !s.ownerEmail);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-10 flex-grow w-full">
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="w-full">
          <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "4px" }}>
            Curation Control
          </span>
          <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>
            Hello, {user.name}
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--text-2)" }}>
            Role: <strong className="capitalize" style={{ color: "var(--text)" }}>{user.role}</strong> · Manage listings, review statistics, and monitor reservation flows.
          </p>
        </div>
        {user.role === "host" && (
          <Link
            href="/stays/add"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 16px",
              background: "var(--gold)",
              color: "var(--bg)",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              flexShrink: 0,
              transition: "transform 0.2s"
            }}
            className="hover:-translate-y-0.5"
          >
            <Home size={14} />
            <span>Add new stay</span>
          </Link>
        )}
      </div>

      {/* Host Metrics and Charts Panel */}
      {user.role === "host" && (
        <div className="space-y-6">
          {/* Quick Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active properties", value: hostStays.length, icon: <Home size={20} /> },
              { label: "Page views", value: "1,820", icon: <TrendingUp size={20} /> },
              { label: "Rating average", value: "4.9/5", icon: <Award size={20} /> },
              { label: "Total earnings", value: "$12,750", icon: <DollarSign size={20} /> },
            ].map((metric) => (
              <div key={metric.label} style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                padding: "24px 20px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}>
                <div style={{
                  padding: "12px",
                  background: "rgba(201, 169, 110, 0.1)",
                  borderRadius: "12px",
                  color: "var(--gold)",
                  flexShrink: 0
                }}>
                  {metric.icon}
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>{metric.value}</strong>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>{metric.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Charts Area */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "32px", borderRadius: "14px" }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="w-full sm:w-auto">
                <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "4px" }}>
                  Curation Analytics
                </span>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>Analytics overview</h3>
                <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--text-2)" }}>Live tracking of catalog activity and category returns.</p>
              </div>
              <div style={{
                display: "flex",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                padding: "4px",
                borderRadius: "10px",
                flexShrink: 0
              }}>
                <button
                  onClick={() => setChartMode("views")}
                  style={{
                    padding: "8px 16px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: chartMode === "views" ? "var(--surface)" : "transparent",
                    color: chartMode === "views" ? "var(--text)" : "var(--text-3)",
                    border: chartMode === "views" ? "1px solid var(--border)" : "1px solid transparent",
                  }}
                >
                  Views Over Time
                </button>
                <button
                  onClick={() => setChartMode("revenue")}
                  style={{
                    padding: "8px 16px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: chartMode === "revenue" ? "var(--surface)" : "transparent",
                    color: chartMode === "revenue" ? "var(--text)" : "var(--text-3)",
                    border: chartMode === "revenue" ? "1px solid var(--border)" : "1px solid transparent",
                  }}
                >
                  Revenue by Category
                </button>
              </div>
            </div>

            {/* Recharts container */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === "views" ? (
                  <AreaChart data={impressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
                    <XAxis dataKey="month" stroke="var(--text-3)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-3)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--surface-3)",
                        border: "1px solid var(--border-2)",
                        borderRadius: "10px",
                        fontSize: "12px",
                        color: "var(--text)",
                      }}
                      itemStyle={{ color: "var(--gold)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#c9a96e"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorViews)"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-3)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-3)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--surface-3)",
                        border: "1px solid var(--border-2)",
                        borderRadius: "10px",
                        fontSize: "12px",
                        color: "var(--text)",
                      }}
                      cursor={{ fill: "var(--surface-2)" }}
                      itemStyle={{ color: "var(--gold)" }}
                    />
                    <Bar dataKey="revenue" fill="#c9a96e" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Host Managed Listings Panel */}
      {user.role === "host" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "4px" }}>
              Curated Listings
            </span>
            <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>Properties Index</h3>
            <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--text-2)" }}>Properties matching your host credentials, verified for display.</p>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "16px 32px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>Curated Property</th>
                  <th style={{ padding: "16px 32px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>Location</th>
                  <th style={{ padding: "16px 32px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>Rate</th>
                  <th style={{ padding: "16px 32px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>Specifications</th>
                  <th style={{ padding: "16px 32px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {hostStays.length > 0 ? (
                  hostStays.map((stay) => (
                    <tr key={stay.slug} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-white/5 transition-colors">
                      <td style={{ padding: "20px 32px", display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", position: "relative", border: "1px solid var(--border)" }}>
                          <Image
                            src={`/stay-art/${stay.slug}?scene=cover`}
                            alt={stay.title}
                            fill
                            style={{ objectFit: "cover" }}
                            unoptimized
                          />
                        </div>
                        <div>
                          <strong style={{ display: "block", color: "var(--text)", fontSize: "0.95rem" }}>{stay.title}</strong>
                          <span style={{ color: "var(--text-3)", fontSize: "0.75rem" }}>{stay.collection}</span>
                        </div>
                      </td>
                      <td style={{ padding: "20px 32px", color: "var(--text-2)" }}>
                        <span>{stay.location}, {stay.country}</span>
                      </td>
                      <td style={{ padding: "20px 32px" }}>
                        <strong style={{ color: "var(--gold)", fontSize: "1rem" }}>${stay.pricePerNight}</strong>
                        <span style={{ color: "var(--text-3)", fontSize: "0.8rem" }}> / night</span>
                      </td>
                      <td style={{ padding: "20px 32px", color: "var(--text-3)", fontSize: "0.85rem" }}>
                        <span>{stay.stayType} · {stay.guestCount} guests · {stay.bedrooms} BR</span>
                      </td>
                      <td style={{ padding: "20px 32px", textAlign: "right" }}>
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/stays/${stay.slug}`}
                            style={{
                              padding: "6px 14px",
                              border: "1px solid var(--border-2)",
                              borderRadius: "6px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: "var(--text-2)",
                              transition: "all 0.2s"
                            }}
                            className="hover:border-[var(--gold)] hover:text-[var(--gold)]"
                          >
                            View details
                          </Link>
                          <button
                            onClick={() => handleDeleteStay(stay.slug, stay.title)}
                            style={{
                              padding: "6px",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              background: "rgba(239, 68, 68, 0.05)",
                              borderRadius: "6px",
                              color: "rgb(239, 68, 68)",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                            className="hover:bg-red-500/20"
                            type="button"
                            aria-label="Delete curated stay"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "var(--text-3)", fontStyle: "italic", fontSize: "0.9rem" }}>
                      You have no active listings. Click &quot;Add new stay&quot; above to curate your first property.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guest/All Bookings Overview Grid */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }} id="bookings">
        <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "4px" }}>
            My Bookings & Reservations
          </span>
          <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>Reservations Index</h3>
          <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--text-2)" }}>Your scheduled travels and active check-in details.</p>
        </div>

        {bookings.length > 0 ? (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--surface-2)",
                  padding: "24px",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 600, color: "var(--text)" }}>{booking.stayTitle}</h4>
                    <div className="flex items-center gap-2 mt-1" style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>
                      <MapPin size={12} style={{ color: "var(--gold)" }} />
                      <span>{booking.stayLocation}</span>
                    </div>
                  </div>
                  <span style={{
                    padding: "4px 10px",
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 700,
                    borderRadius: "4px",
                    background: "rgba(201, 169, 110, 0.15)",
                    border: "1px solid rgba(201, 169, 110, 0.3)",
                    color: "var(--gold)"
                  }}>
                    Confirmed
                  </span>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  borderTop: "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)",
                  padding: "16px 0",
                  margin: "4px 0"
                }}>
                  <div className="flex items-center gap-3">
                    <Calendar size={16} style={{ color: "var(--gold)" }} />
                    <div>
                      <span style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>Check In</span>
                      <strong style={{ fontSize: "0.85rem", color: "var(--text)" }}>{booking.checkIn}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar size={16} style={{ color: "var(--gold)" }} />
                    <div>
                      <span style={{ display: "block", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>Check Out</span>
                      <strong style={{ fontSize: "0.85rem", color: "var(--text)" }}>{booking.checkOut}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center" style={{ fontSize: "0.85rem" }}>
                  <div className="flex items-center gap-2" style={{ color: "var(--text-3)" }}>
                    <Users size={14} style={{ color: "var(--text-3)" }} />
                    <span>{booking.guests} guests reservation</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-3)", fontSize: "0.8rem" }}>Paid: </span>
                    <strong style={{ color: "var(--text)", fontSize: "1rem" }}>${booking.totalPaid}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "64px", textAlign: "center", color: "var(--text-3)", fontStyle: "italic", fontSize: "0.95rem" }}>
            No active reservations found. Visit the{" "}
            <Link href="/explore" style={{ color: "var(--gold)", fontWeight: 600, textDecoration: "none" }} className="hover:underline">
              Explore catalog
            </Link>{" "}
            to schedule your first curated journey.
          </div>
        )}
      </div>
    </main>
  );
}
