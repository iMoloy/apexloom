"use client";

import React, { useState, useEffect, useRef } from "react";
import { collectionOptions, locationOptions } from "@/lib/stays";
import { Search, ChevronDown, MapPin, SlidersHorizontal, Sparkles } from "lucide-react";

type ExploreFiltersProps = {
  search: string;
  collection: string;
  location: string;
  sort: string;
};

// Custom Dropdown Component
function CustomSelect({ 
  name, 
  value, 
  options, 
  placeholder, 
  icon 
}: { 
  name: string, 
  value: string, 
  options: { value: string, label: string }[], 
  placeholder: string,
  icon?: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === selected)?.label || placeholder;

  return (
    <div className="relative" ref={containerRef}>
      <input type="hidden" name={name} value={selected} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl transition-all duration-200 hover:border-[var(--gold)] focus:outline-none"
        style={{
          boxShadow: isOpen ? "0 0 0 1px var(--gold), 0 4px 12px rgba(0,0,0,0.5)" : "none",
          borderColor: isOpen ? "var(--gold)" : "var(--border)"
        }}
      >
        <div className="flex items-center gap-2 text-[var(--text-2)] text-sm whitespace-nowrap overflow-hidden">
          {icon && <span className="text-[var(--gold)] shrink-0">{icon}</span>}
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown size={14} className={`text-[var(--text-3)] transition-transform duration-300 ${isOpen ? "rotate-180 text-[var(--gold)]" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.6)] overflow-hidden">
          <ul className="max-h-60 overflow-y-auto py-1">
            <li 
              onClick={() => { setSelected(""); setIsOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${selected === "" ? "text-[var(--gold)] bg-white/5" : "text-[var(--text-2)] hover:bg-white/5 hover:text-[var(--text)]"}`}
            >
              {placeholder}
            </li>
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => { setSelected(opt.value); setIsOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${selected === opt.value ? "text-[var(--gold)] bg-white/5" : "text-[var(--text-2)] hover:bg-white/5 hover:text-[var(--text)]"}`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ExploreFilters({
  search,
  collection,
  location,
  sort,
}: ExploreFiltersProps) {
  
  const sortOptions = [
    { value: "featured", label: "Featured first" },
    { value: "latest", label: "Latest additions" },
    { value: "rating", label: "Highest rating" },
    { value: "price-low", label: "Price: low to high" },
    { value: "price-high", label: "Price: high to low" },
  ];

  return (
    <form 
      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative z-40 mb-10" 
      action="/explore"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search Field */}
        <div className="md:col-span-4 relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search size={16} className="text-[var(--text-3)] group-focus-within:text-[var(--gold)] transition-colors" />
          </div>
          <input
            defaultValue={search}
            name="search"
            placeholder="Search by city, type, or mood..."
            type="search"
            className="w-full pl-11 pr-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-3)] transition-all duration-200 focus:outline-none focus:border-[var(--gold)] focus:shadow-[0_0_0_1px_var(--gold)]"
          />
        </div>

        {/* Collection Dropdown */}
        <div className="md:col-span-2">
          <CustomSelect 
            name="collection" 
            value={collection} 
            options={collectionOptions.map(c => ({ value: c, label: c }))} 
            placeholder="All collections"
            icon={<Sparkles size={14} />}
          />
        </div>

        {/* Location Dropdown */}
        <div className="md:col-span-2">
          <CustomSelect 
            name="location" 
            value={location} 
            options={locationOptions.map(l => ({ value: l, label: l }))} 
            placeholder="Anywhere"
            icon={<MapPin size={14} />}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="md:col-span-2">
          <CustomSelect 
            name="sort" 
            value={sort} 
            options={sortOptions} 
            placeholder="Sort by"
            icon={<SlidersHorizontal size={14} />}
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[var(--gold)] text-[var(--bg)] rounded-xl font-bold text-sm tracking-wide transition-transform hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(201,169,110,0.2)] hover:shadow-[0_8px_24px_rgba(201,169,110,0.3)]"
          >
            Apply Filters
          </button>
        </div>
        
      </div>
    </form>
  );
}
