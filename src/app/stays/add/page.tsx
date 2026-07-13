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
  const [imageUrl, setImageUrl] = useState("");
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
          imageUrl,
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
      <div className="flex-grow flex items-center justify-center p-20 text-xs font-semibold" style={{ color: "var(--text-3)" }}>
        Verifying host configurations...
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "0 14px",
    borderRadius: "8px",
    height: "44px",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text)",
    fontSize: "0.85rem",
    outline: "none",
    transition: "border-color 0.2s"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "var(--text-3)"
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/stays/manage"
          className="flex items-center gap-1 text-xs font-bold transition-colors"
          style={{ color: "var(--text-3)" }}
        >
          <ArrowLeft size={14} />
          <span className="hover:text-[var(--gold)] transition-colors">Back to dashboard</span>
        </Link>
      </div>

      <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "24px" }}>
        <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "4px" }}>
          Curator Sandbox
        </span>
        <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>Add Curated Stay</h1>
        <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--text-2)" }}>Submit a design-led space for our editorial selection catalog.</p>
      </div>

      {/* Two Column Form + Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column - Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6" style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "32px", borderRadius: "14px" }}>
          <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "8px" }}>Stay Specifications</span>

          {/* Title input */}
          <div>
            <label style={labelStyle}>Stay Title *</label>
            <input
              type="text"
              placeholder="E.g. Solenne House"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
              className="focus:border-[var(--gold)]"
              required
            />
          </div>

          {/* Location details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>City Location *</label>
              <input
                type="text"
                placeholder="E.g. Lisbon"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle}
                className="focus:border-[var(--gold)]"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Country *</label>
              <input
                type="text"
                placeholder="E.g. Portugal"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={inputStyle}
                className="focus:border-[var(--gold)]"
                required
              />
            </div>
          </div>

          {/* Category & Types select dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label style={labelStyle}>Collection *</label>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value as any)}
                style={inputStyle}
                className="focus:border-[var(--gold)]"
              >
                <option value="Quiet City Stays">Quiet City Stays</option>
                <option value="Slow Weekend Houses">Slow Weekend Houses</option>
                <option value="Signature Retreats">Signature Retreats</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Stay Type *</label>
              <select
                value={stayType}
                onChange={(e) => setStayType(e.target.value as any)}
                style={inputStyle}
                className="focus:border-[var(--gold)]"
              >
                <option value="Apartment">Apartment</option>
                <option value="Townhouse">Townhouse</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Cabin">Cabin</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Price per Night ($) *</label>
              <input
                type="number"
                min={10}
                max={5000}
                value={pricePerNight}
                onChange={(e) => setPricePerNight(Number(e.target.value))}
                style={inputStyle}
                className="focus:border-[var(--gold)]"
                required
              />
            </div>
          </div>

          {/* Optional Image URL */}
          <div>
            <label style={labelStyle}>Featured Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              style={inputStyle}
              className="focus:border-[var(--gold)]"
            />
          </div>

          {/* Core specs details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label style={labelStyle}>Guests Limit *</label>
              <input
                type="number"
                min={1}
                max={30}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                style={inputStyle}
                className="focus:border-[var(--gold)]"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Bedrooms *</label>
              <input
                type="number"
                min={1}
                max={15}
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                style={inputStyle}
                className="focus:border-[var(--gold)]"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Bathrooms *</label>
              <input
                type="number"
                min={1}
                max={15}
                value={baths}
                onChange={(e) => setBaths(Number(e.target.value))}
                style={inputStyle}
                className="focus:border-[var(--gold)]"
                required
              />
            </div>
          </div>

          {/* Description details */}
          <div>
            <label style={labelStyle}>Best For (Short kicker summary) *</label>
            <input
              type="text"
              placeholder="E.g. Creative groups, restorative weekends, remote work loops"
              value={bestFor}
              onChange={(e) => setBestFor(e.target.value)}
              style={inputStyle}
              className="focus:border-[var(--gold)]"
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Catalog Short Description *</label>
            <input
              type="text"
              placeholder="A one-line preview summary of the stay experience..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              style={inputStyle}
              className="focus:border-[var(--gold)]"
              maxLength={150}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Editorial Full Description *</label>
            <textarea
              placeholder="Describe the architectural details, the atmosphere, layout flow, and style notes of the stay..."
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              style={{ ...inputStyle, height: "100px", padding: "12px 14px", resize: "none" }}
              className="focus:border-[var(--gold)]"
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Host arrival notes & recommendations *</label>
            <textarea
              placeholder="E.g. Nearby coffee shops timing guides, packing rules, check-in instructions..."
              value={hostNote}
              onChange={(e) => setHostNote(e.target.value)}
              style={{ ...inputStyle, height: "80px", padding: "12px 14px", resize: "none" }}
              className="focus:border-[var(--gold)]"
              required
            />
          </div>

          {/* Amenities checklist checkboxes */}
          <div>
            <label style={labelStyle}>Amenities checklist</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableAmenities.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className="cursor-pointer transition-colors"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      border: checked ? "1px solid rgba(201, 169, 110, 0.4)" : "1px solid var(--border-2)",
                      borderRadius: "8px",
                      background: checked ? "rgba(201, 169, 110, 0.05)" : "var(--surface-2)",
                      color: checked ? "var(--gold)" : "var(--text-3)",
                      fontSize: "0.75rem",
                      fontWeight: 600
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleAmenityToggle(amenity)}
                      style={{ accentColor: "var(--gold)", width: "14px", height: "14px" }}
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
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "14px",
              background: "var(--gold)",
              color: "var(--bg)",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 700,
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
              marginTop: "16px",
              transition: "transform 0.2s"
            }}
            className={submitting ? "" : "hover:-translate-y-0.5"}
          >
            <Plus size={16} />
            <span>{submitting ? "Adding to Curation..." : "Add Curated listing"}</span>
          </button>
        </form>

        {/* Right Column - Live Preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "20px", borderRadius: "14px" }}>
            <span style={{ display: "inline-block", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "4px" }}>Interactive Sandbox</span>
            <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>Live Card Preview</h3>
            <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "var(--text-3)" }}>This card re-renders dynamically as specifications are entered.</p>
          </div>

          <div className="w-full">
            <StayCard stay={previewStay} isPreview={true} />
          </div>
        </div>
      </div>
    </main>
  );
}
