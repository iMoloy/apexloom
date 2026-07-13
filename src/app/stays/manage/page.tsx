"use client";

import React, { useEffect, useState } from "react";
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
import type { BookingRecord } from "@/lib/dbStays";

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

  const fetchData = async () => {
    try {
      // Fetch stays
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
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

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
      <div className="flex-grow flex items-center justify-center p-20 text-xs font-semibold text-[#667085]">
        Loading dashboard configurations...
      </div>
    );
  }

  // Filter stays managed by this host
  const hostStays = stays.filter((s: any) => s.ownerEmail === user.email || !s.ownerEmail);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-10 flex-grow w-full">
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#d9d2c6]/40 pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#c46c42] uppercase font-bold">Curation Control</span>
          <h1 className="text-3xl font-display font-semibold text-[#111827] mt-1">
            Hello, {user.name}
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Role: <strong className="capitalize">{user.role}</strong> · Manage listings, review statistics, and monitor reservation flows.
          </p>
        </div>
        {user.role === "host" && (
          <Link
            href="/stays/add"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1d4d45] hover:bg-[#153832] rounded-lg shadow transition-colors cursor-pointer"
          >
            <Home size={13} />
            <span>Add new stay</span>
          </Link>
        )}
      </div>

      {/* Host Metrics and Charts Panel */}
      {user.role === "host" && (
        <div className="space-y-6">
          {/* Quick Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#d9d2c6]/60 p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-[#1d4d45]/5 rounded-xl text-forest shrink-0">
                <Home size={20} />
              </div>
              <div>
                <strong className="block text-xl text-[#111827] font-semibold">{hostStays.length}</strong>
                <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider">Active properties</span>
              </div>
            </div>

            <div className="bg-white border border-[#d9d2c6]/60 p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-[#c46c42]/5 rounded-xl text-[#c46c42] shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <strong className="block text-xl text-[#111827] font-semibold">1,820</strong>
                <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider">Page views</span>
              </div>
            </div>

            <div className="bg-white border border-[#d9d2c6]/60 p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-[#1d4d45]/5 rounded-xl text-forest shrink-0">
                <Award size={20} />
              </div>
              <div>
                <strong className="block text-xl text-[#111827] font-semibold">4.9/5</strong>
                <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider">Rating average</span>
              </div>
            </div>

            <div className="bg-white border border-[#d9d2c6]/60 p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-[#c46c42]/5 rounded-xl text-[#c46c42] shrink-0">
                <DollarSign size={20} />
              </div>
              <div>
                <strong className="block text-xl text-[#111827] font-semibold">$12,750</strong>
                <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider">Total earnings</span>
              </div>
            </div>
          </div>

          {/* Analytics Charts Area */}
          <div className="bg-white border border-[#d9d2c6]/60 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-semibold text-[#111827]">Curation Analytics</h3>
                <p className="text-xs text-[#667085]">Live tracking of catalog activity and category returns.</p>
              </div>
              <div className="flex bg-[#f5f2ea]/60 border border-[#d9d2c6]/60 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setChartMode("views")}
                  className={`px-3 py-1 font-bold rounded-md transition-colors cursor-pointer ${chartMode === "views" ? "bg-white text-forest shadow-sm" : "text-[#667085] hover:text-[#111827]"}`}
                >
                  Views Over Time
                </button>
                <button
                  onClick={() => setChartMode("revenue")}
                  className={`px-3 py-1 font-bold rounded-md transition-colors cursor-pointer ${chartMode === "revenue" ? "bg-white text-forest shadow-sm" : "text-[#667085] hover:text-[#111827]"}`}
                >
                  Revenue by Category
                </button>
              </div>
            </div>

            {/* Recharts container */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === "views" ? (
                  <AreaChart data={impressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1d4d45" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#1d4d45" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d9d2c6" opacity={0.2} vertical={false} />
                    <XAxis dataKey="month" stroke="#667085" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#667085" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fffdf8",
                        border: "1px solid #d9d2c6",
                        borderRadius: "10px",
                        fontSize: "11px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#1d4d45"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorViews)"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d9d2c6" opacity={0.2} vertical={false} />
                    <XAxis dataKey="name" stroke="#667085" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#667085" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fffdf8",
                        border: "1px solid #d9d2c6",
                        borderRadius: "10px",
                        fontSize: "11px",
                      }}
                    />
                    <Bar dataKey="revenue" fill="#c46c42" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Host Managed Listings Panel */}
      {user.role === "host" && (
        <div className="bg-white border border-[#d9d2c6]/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#d9d2c6]/40">
            <h3 className="text-base font-semibold text-[#111827]">Curated Listings</h3>
            <p className="text-xs text-[#667085]">Properties matching your host credentials, verified for display.</p>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f5f2ea]/40 border-b border-[#d9d2c6]/40 text-[#667085]">
                  <th className="p-4 font-bold uppercase tracking-wider">Curated Property</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Location</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Rate</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Specifications</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-right">Curation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d9d2c6]/20">
                {hostStays.length > 0 ? (
                  hostStays.map((stay) => (
                    <tr key={stay.slug} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-12 h-12 bg-neutral-100 rounded-lg relative overflow-hidden shrink-0 border border-[#d9d2c6]/30">
                          <img
                            src={`/stay-art/${stay.slug}?scene=cover`}
                            alt={stay.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <strong className="block text-sm text-[#111827]">{stay.title}</strong>
                          <span className="text-[10px] text-[#667085]">{stay.collection}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[#111827]">
                        <span>{stay.location}, {stay.country}</span>
                      </td>
                      <td className="p-4">
                        <strong className="text-forest text-sm">${stay.pricePerNight}</strong>
                        <span className="text-[#667085]"> / night</span>
                      </td>
                      <td className="p-4 text-[#667085]">
                        <span>{stay.stayType} · {stay.guestCount} guests · {stay.bedrooms} BR</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/stays/${stay.slug}`}
                            className="px-3 py-1.5 border border-[#d9d2c6] text-[#111827] hover:bg-[#faf9f6] rounded-md font-semibold transition-colors"
                          >
                            View details
                          </Link>
                          <button
                            onClick={() => handleDeleteStay(stay.slug, stay.title)}
                            className="p-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            type="button"
                            aria-label="Delete curated stay"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#667085] italic">
                      You have no active listings. Click "Add new stay" above to currate your first property.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guest/All Bookings Overview Grid */}
      <div className="bg-white border border-[#d9d2c6]/60 rounded-2xl shadow-sm overflow-hidden" id="bookings">
        <div className="p-6 border-b border-[#d9d2c6]/40">
          <h3 className="text-base font-semibold text-[#111827]">My Bookings & Reservations</h3>
          <p className="text-xs text-[#667085]">Your scheduled travels and active check-in details.</p>
        </div>

        {bookings.length > 0 ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-[#d9d2c6]/60 p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4 bg-gradient-to-br from-[#faf9f6]/40 to-[#fffdf8]"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-[#111827]">{booking.stayTitle}</h4>
                    <div className="flex items-center gap-1 text-[10px] text-[#667085] mt-1">
                      <MapPin size={11} />
                      <span>{booking.stayLocation}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] uppercase font-mono tracking-wider font-bold rounded bg-emerald-50 text-forest border border-emerald-200/50">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs border-y border-[#d9d2c6]/20 py-3.5 my-1">
                  <div className="flex items-center gap-2 text-[#667085]">
                    <Calendar size={13} className="text-forest" />
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-[#667085]/60 tracking-wider">Check In</span>
                      <strong className="text-[#111827] text-[10px]">{booking.checkIn}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[#667085]">
                    <Calendar size={13} className="text-forest" />
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-[#667085]/60 tracking-wider">Check Out</span>
                      <strong className="text-[#111827] text-[10px]">{booking.checkOut}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1 text-[#667085]">
                    <Users size={12} />
                    <span>{booking.guests} guests reservation</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#667085]">Paid: </span>
                    <strong className="text-forest font-bold">${booking.totalPaid}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-[#667085] italic text-xs">
            No active reservations found. Visit the{" "}
            <Link href="/explore" className="text-[#c46c42] font-semibold hover:underline">
              Explore catalog
            </Link>{" "}
            to schedule your first curated journey.
          </div>
        )}
      </div>
    </main>
  );
}
