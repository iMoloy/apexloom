"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import { StayCard } from "@/components/stays/StayCard";
import { Home, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import type { StayItem } from "@/data/stays";

const availableAmenities = [
  "Dedicated workspace",
  "Balcony dining",
  "Self check-in",
  "Curated city guide",
  "Fast Wi-Fi",
  "Bike storage",
  "Harbor access",
  "Fireplace",
  "Freestanding tub",
  "Pool courtyard",
  "Private chef option",
  "Roof terrace",
];

export default function AddStayPage() {
  const router = useRouter();
  const { user, loadingUser, showToast } = useApp();

  // Redirect if not logged in or not host
  useEffect(() => {
    if (!loadingUser) {
      if (!user) {
        showToast("Authentication required.", "warning");
        router.push("/login?redirect=/stays/add");
      } else if (user.role !== "host") {
        showToast("Access forbidden. Host account required.", "error");
        router.push("/stays/manage");
      }
    }
  }, [user, loadingUser, router, showToast]);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [collection, setCollection] = useState<any>("Quiet City Stays");
  const [stayType, setStayType] = useState<any>("House");
  const [pricePerNight, setPricePerNight] = useState<number>(250);
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [hostNote, setHostNote] = useState("");
  const [bestFor, setBestFor] = useState("");
  const [guestCount, setGuestCount] = useState<number>(4);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [baths, setBaths] = useState<number>(2);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Build the live preview StayItem state
  const previewStay: StayItem = {
    slug: "preview-stay",
    title: title || "Premium Curated Stay",
    location: location || "Destination City",
    country: country || "Country",
    collection,
    stayType,
    pricePerNight: Number(pricePerNight) || 0,
    rating: 5.0,
    reviewCount: 1,
    publishedOn: new Date().toISOString().slice(0, 10),
    shortDescription: shortDescription || "A beautiful, design-led property curated for slow and intentional travel experiences.",
    fullDescription: fullDescription || "",
    hostNote: hostNote || "",
    bestFor: bestFor || "Considered escapes and design retreats",
    guestCount: Number(guestCount) || 1,
    bedrooms: Number(bedrooms) || 1,
    baths: Number(baths) || 1,
    featured: false,
    amenities: selectedAmenities,
    galleryLabels: ["Entrance", "Lounge", "Suite"],
    reviews: [],
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (
      !title ||
      !location ||
      !country ||
      !pricePerNight ||
      !shortDescription ||
      !fullDescription ||
      !hostNote ||
      !bestFor
    ) {
      showToast("Please fill in all required specifications.", "error");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/stays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          location,
          country,
          collection,
          stayType,
          pricePerNight,
          shortDescription,
          fullDescription,
          hostNote,
          bestFor,
          guestCount,
          bedrooms,
          baths,
          amenities: selectedAmenities,
        }),
      });

      if (res.ok) {
        showToast("Curated stay listing added successfully!", "success");
        router.push("/stays/manage");
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to create stay listing.", "error");
      }
    } catch (err) {
      showToast("Connection to stay API failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser || !user || user.role !== "host") {
    return (
      <div className="flex-grow flex items-center justify-center p-20 text-xs font-semibold text-[#667085]">
        Verifying host configurations...
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/stays/manage"
          className="flex items-center gap-1 text-xs font-bold text-[#667085] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to dashboard</span>
        </Link>
      </div>

      <div className="border-b border-[#d9d2c6]/40 pb-4">
        <span className="text-[10px] tracking-[0.25em] text-[#c46c42] uppercase font-bold">Curator Sandbox</span>
        <h1 className="text-3xl font-display font-semibold text-[#111827] mt-1">Add Curated Stay</h1>
        <p className="text-xs text-[#667085] mt-0.5">Submit a design-led space for our editorial selection catalog.</p>
      </div>

      {/* Two Column Form + Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-[#d9d2c6]/60 p-6 rounded-2xl shadow-sm space-y-5">
          <h2 className="text-sm uppercase tracking-wider font-bold text-[#111827] border-b border-[#d9d2c6]/30 pb-2">Stay Specifications</h2>

          {/* Title input */}
          <div>
            <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Stay Title *</span>
            <input
              type="text"
              placeholder="E.g. Solenne House"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none"
              required
            />
          </div>

          {/* Location details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">City Location *</span>
              <input
                type="text"
                placeholder="E.g. Lisbon"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none"
                required
              />
            </div>
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Country *</span>
              <input
                type="text"
                placeholder="E.g. Portugal"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Category & Types select dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Collection *</span>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value as any)}
                className="w-full px-2.5 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] focus:border-[#1d4d45] focus:outline-none bg-white"
              >
                <option value="Quiet City Stays">Quiet City Stays</option>
                <option value="Slow Weekend Houses">Slow Weekend Houses</option>
                <option value="Signature Retreats">Signature Retreats</option>
              </select>
            </div>
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Stay Type *</span>
              <select
                value={stayType}
                onChange={(e) => setStayType(e.target.value as any)}
                className="w-full px-2.5 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] focus:border-[#1d4d45] focus:outline-none bg-white"
              >
                <option value="Apartment">Apartment</option>
                <option value="Townhouse">Townhouse</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Cabin">Cabin</option>
              </select>
            </div>
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Price per Night ($) *</span>
              <input
                type="number"
                min={10}
                max={5000}
                value={pricePerNight}
                onChange={(e) => setPricePerNight(Number(e.target.value))}
                className="w-full px-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] focus:border-[#1d4d45] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Core specs details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Guests Limit *</span>
              <input
                type="number"
                min={1}
                max={30}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full px-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] focus:border-[#1d4d45] focus:outline-none"
                required
              />
            </div>
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Bedrooms *</span>
              <input
                type="number"
                min={1}
                max={15}
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full px-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] focus:border-[#1d4d45] focus:outline-none"
                required
              />
            </div>
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Bathrooms *</span>
              <input
                type="number"
                min={1}
                max={15}
                value={baths}
                onChange={(e) => setBaths(Number(e.target.value))}
                className="w-full px-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] focus:border-[#1d4d45] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Description details */}
          <div>
            <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Best For (Short kicker summary) *</span>
            <input
              type="text"
              placeholder="E.g. Creative groups, restorative weekends, remote work loops"
              value={bestFor}
              onChange={(e) => setBestFor(e.target.value)}
              className="w-full px-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none"
              required
            />
          </div>

          <div>
            <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Catalog Short Description *</span>
            <input
              type="text"
              placeholder="A one-line preview summary of the stay experience..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none"
              maxLength={150}
              required
            />
          </div>

          <div>
            <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Editorial Full Description *</span>
            <textarea
              placeholder="Describe the architectural details, the atmosphere, layout flow, and style notes of the stay..."
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className="w-full p-3 rounded-lg h-24 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none resize-none"
              required
            />
          </div>

          <div>
            <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Host arrival notes & recommendations *</span>
            <textarea
              placeholder="E.g. Nearby coffee shops timing guides, packing rules, check-in instructions..."
              value={hostNote}
              onChange={(e) => setHostNote(e.target.value)}
              className="w-full p-3 rounded-lg h-20 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none resize-none"
              required
            />
          </div>

          {/* Amenities checklist checkboxes */}
          <div>
            <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-2 font-bold font-mono">Amenities checklist</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {availableAmenities.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2 p-2 border rounded-lg text-[10px] font-semibold cursor-pointer transition-colors ${checked ? "border-[#1d4d45] bg-[#1d4d45]/5 text-forest" : "border-[#d9d2c6] text-[#667085]"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-[#d9d2c6] text-[#1d4d45] focus:ring-[#1d4d45] h-3.5 w-3.5"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#1d4d45] hover:bg-[#153832] text-white py-2.5 text-xs font-bold shadow transition-colors cursor-pointer disabled:opacity-50"
          >
            <Plus size={14} />
            <span>{submitting ? "Adding to Curation..." : "Add Curated listing"}</span>
          </button>
        </form>

        {/* Right Column - Live Preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="bg-[#f5f2ea]/40 border border-[#d9d2c6]/60 p-4 rounded-2xl">
            <span className="text-[9px] uppercase tracking-wider text-[#667085] font-bold">Interactive Sandbox</span>
            <h3 className="text-sm font-semibold text-[#111827] mt-0.5">Live Card Preview</h3>
            <p className="text-[11px] text-[#667085]">This card re-renders dynamically as specifications are entered.</p>
          </div>

          <div className="w-full max-w-sm mx-auto">
            <StayCard stay={previewStay} isPreview={true} />
          </div>
        </div>
      </div>
    </main>
  );
}
