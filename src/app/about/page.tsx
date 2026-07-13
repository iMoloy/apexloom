import React from "react";
import { Shield, Sparkles, Heart, Compass } from "lucide-react";

export const metadata = {
  title: "About Us | ApexLoom",
  description: "Learn about the mission, values, and curation standards behind the ApexLoom travel platform.",
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      {/* Header section */}
      <div className="text-center space-y-3">
        <span className="text-[10px] tracking-[0.25em] text-[#c46c42] uppercase font-bold">Our Philosophy</span>
        <h1 className="text-4xl sm:text-5xl font-display font-semibold text-[#111827] tracking-tight">
          Places that stay with you
        </h1>
        <p className="text-sm text-[#667085] max-w-xl mx-auto leading-relaxed">
          ApexLoom was founded to bypass the infinite scrolling of generic rental platforms. We focus exclusively on spaces that demonstrate character, atmosphere, and architectural consideration.
        </p>
      </div>

      {/* Hero Visual Mockup */}
      <div className="border border-[#d9d2c6]/60 p-8 rounded-2xl bg-white shadow-sm space-y-4">
        <div className="h-64 sm:h-80 bg-[#1d4d45] rounded-xl flex flex-col justify-between p-8 text-[#fffdf8] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#8fa89d] rounded-full blur-3xl opacity-20 pointer-events-none" />
          <div className="absolute left-[-10%] bottom-[-10%] w-72 h-72 bg-[#d8cbb7] rounded-full blur-3xl opacity-15 pointer-events-none" />
          
          <div className="relative z-10 space-y-1.5 max-w-md">
            <span className="text-[10px] uppercase tracking-wider opacity-60">Editorial Focus</span>
            <h2 className="text-2xl sm:text-3xl font-display font-medium leading-tight">We filter the options so you can choose with clarity.</h2>
          </div>
          <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-mono">Atmosphere</span>
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-mono">Details</span>
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-mono">Clarity</span>
          </div>
        </div>
      </div>

      {/* Core Curation Pillars */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#111827]">Curation Standards</h3>
          <p className="text-xs text-[#667085]">The core checks every property on our platform undergoes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-[#d9d2c6]/60 p-6 rounded-xl shadow-sm space-y-3">
            <div className="p-2 bg-[#1d4d45]/5 text-forest rounded-lg w-fit">
              <Compass size={18} />
            </div>
            <h4 className="text-sm font-semibold text-[#111827]">Design & Character</h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              We look for homes with visual consistency, intentional lighting, and a clear architectural point of view. No sterile, standard layouts.
            </p>
          </div>

          <div className="bg-white border border-[#d9d2c6]/60 p-6 rounded-xl shadow-sm space-y-3">
            <div className="p-2 bg-[#c46c42]/5 text-[#c46c42] rounded-lg w-fit">
              <Shield size={18} />
            </div>
            <h4 className="text-sm font-semibold text-[#111827]">Honesty & Specifications</h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              We list the exact details guests rely on: workspace quality, internet stability, noise levels, and host arrival notes. No surprises.
            </p>
          </div>

          <div className="bg-white border border-[#d9d2c6]/60 p-6 rounded-xl shadow-sm space-y-3">
            <div className="p-2 bg-[#1d4d45]/5 text-forest rounded-lg w-fit">
              <Sparkles size={18} />
            </div>
            <h4 className="text-sm font-semibold text-[#111827]">Atmosphere First</h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Properties must support slow travel—large dining spaces, restful rooms, and immediate local walkability rather than tourist rush.
            </p>
          </div>

          <div className="bg-white border border-[#d9d2c6]/60 p-6 rounded-xl shadow-sm space-y-3">
            <div className="p-2 bg-[#c46c42]/5 text-[#c46c42] rounded-lg w-fit">
              <Heart size={18} />
            </div>
            <h4 className="text-sm font-semibold text-[#111827]">Considered Hosting</h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Our hosts write detailed neighborhood timing guides, bakery loops, and sunset spots to help guests explore like locals.
            </p>
          </div>
        </div>
      </div>

      {/* Vision Statement */}
      <div className="bg-[#f5f2ea]/40 border border-[#d9d2c6]/60 p-8 rounded-2xl text-center space-y-3">
        <h3 className="text-sm font-semibold text-[#111827]">Our Long-term Vision</h3>
        <p className="text-xs text-[#667085] max-w-xl mx-auto leading-relaxed">
          "ApexLoom isn't about catalog size or listing volume. We believe in curated matching. We want travel planning to feel like turning the pages of an architectural magazine, where every property is a place you actually remember."
        </p>
        <span className="block text-[10px] text-[#c46c42] uppercase tracking-wider font-bold">— The ApexLoom Curation Team</span>
      </div>
    </main>
  );
}
