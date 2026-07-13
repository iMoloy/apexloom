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

export function BookingWidget({ staySlug, pricePerNight, maxGuests }: BookingWidgetProps) {
  const router = useRouter();
  const { user, showToast } = useApp();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(0);
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");

  // Seed default dates: check-in tomorrow, check-out in 3 days
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const leaveDate = new Date(tomorrow);
    leaveDate.setDate(tomorrow.getDate() + 3);

    setCheckIn(tomorrow.toISOString().slice(0, 10));
    setCheckOut(leaveDate.toISOString().slice(0, 10));
  }, []);

  // Calculate nights
  useEffect(() => {
    if (!checkIn || !checkOut) {
      setNights(0);
      return;
    }
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = d2.getTime() - d1.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    setNights(days > 0 ? days : 0);
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

    // Begin simulated progress intervals
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
              body: JSON.stringify({
                staySlug,
                checkIn,
                checkOut,
                guests,
              }),
            });

            if (res.ok) {
              setStatus("success");
              showToast("Reservation confirmed successfully!", "success");
              setTimeout(() => {
                router.push("/stays/manage");
              }, 1200);
            } else {
              const data = await res.json();
              showToast(data.error || "Reservation failed.", "error");
              setStatus("idle");
            }
          } catch (err) {
            showToast("Failed to connect to bookings API.", "error");
            setStatus("idle");
          }
        }, 1000);
      }, 1000);
    }, 1000);
  };

  if (status !== "idle") {
    return (
      <div className="bg-white border border-[#d9d2c6]/60 p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center space-y-5 min-h-[300px]">
        {status === "success" ? (
          <div className="w-12 h-12 rounded-full bg-forest text-[#fffdf8] flex items-center justify-center animate-pulse">
            <Check size={24} />
          </div>
        ) : (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute border-4 border-[#d9d2c6]/20 border-t-forest rounded-full w-full h-full animate-spin"></div>
            <span className="text-[10px] font-bold text-forest">{progress}%</span>
          </div>
        )}
        <div className="text-center space-y-1.5">
          <h3 className="text-sm font-semibold text-[#111827]">
            {status === "success" ? "Booking Confirmed" : "Processing Request"}
          </h3>
          <p className="text-xs text-[#667085]">{statusText}</p>
        </div>

        {/* Static horizontal progress slider bar */}
        <div className="w-full bg-[#d9d2c6]/30 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-forest h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#d9d2c6]/60 p-6 rounded-2xl shadow-xl space-y-5">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-[#667085]">Curated rate</span>
        <div>
          <strong className="text-2xl font-display font-semibold text-[#111827]">${pricePerNight}</strong>
          <span className="text-xs text-[#667085]"> / night</span>
        </div>
      </div>

      <form onSubmit={handleBooking} className="space-y-4">
        {/* Date Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[9px] text-[#667085] uppercase tracking-wider block mb-1 font-bold">Check In</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-[#667085]/60 pointer-events-none">
                <Calendar size={13} />
              </span>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full pl-7 pr-2 rounded-lg h-9 border border-[#d9d2c6] text-[11px] text-[#111827] focus:border-forest focus:outline-none"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="text-[9px] text-[#667085] uppercase tracking-wider block mb-1 font-bold">Check Out</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-[#667085]/60 pointer-events-none">
                <Calendar size={13} />
              </span>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full pl-7 pr-2 rounded-lg h-9 border border-[#d9d2c6] text-[11px] text-[#111827] focus:border-forest focus:outline-none"
                required
              />
            </div>
          </label>
        </div>

        {/* Guest Input */}
        <div>
          <span className="text-[9px] text-[#667085] uppercase tracking-wider block mb-1 font-bold">Guests count</span>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-[#667085]/60 pointer-events-none">
              <Users size={13} />
            </span>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full pl-7 pr-2 rounded-lg h-9 border border-[#d9d2c6] text-[11px] text-[#111827] focus:border-forest focus:outline-none"
            >
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing calculations */}
        {nights > 0 && (
          <div className="border-t border-[#d9d2c6]/30 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-[#667085]">
              <span>${pricePerNight} x {nights} nights</span>
              <span className="font-semibold text-[#111827]">${basePrice}</span>
            </div>
            <div className="flex justify-between text-[#667085]">
              <span>Curation verification fee</span>
              <span className="font-semibold text-[#111827]">${curationFee}</span>
            </div>
            <div className="flex justify-between text-[#667085]">
              <span>Cleaning & prep fee</span>
              <span className="font-semibold text-[#111827]">${cleaningFee}</span>
            </div>
            <div className="border-t border-[#d9d2c6]/30 pt-2 flex justify-between text-[#111827] font-semibold text-sm">
              <span>Total calculated cost</span>
              <span className="text-forest font-bold">${totalPrice}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#1d4d45] hover:bg-[#153832] text-white py-2.5 text-xs font-bold shadow transition-colors cursor-pointer"
        >
          <span>Request Reservation</span>
          <ArrowRight size={13} />
        </button>
      </form>

      <div className="flex gap-2 p-3 bg-[#f5f2ea]/40 border border-[#d9d2c6]/40 rounded-xl">
        <Shield size={16} className="text-forest shrink-0 mt-0.5" />
        <p className="text-[10px] text-[#667085] leading-relaxed">
          <strong>ApexLoom Verification:</strong> Rates and schedules are secured. Curation fees are fully refunded if your host cancels the reservation.
        </p>
      </div>
    </div>
  );
}
