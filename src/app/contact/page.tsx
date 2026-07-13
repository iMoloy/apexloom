"use client";

import React, { useState } from "react";
import { useApp } from "@/components/AppContext";
import { Mail, MessageSquare, MapPin, Send, HelpCircle } from "lucide-react";

export default function ContactPage() {
  const { showToast } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      showToast("Please fill in all form details.", "error");
      return;
    }

    setSubmitting(true);

    // Simulate contact form submission
    setTimeout(() => {
      showToast("Thank you! Your message has been sent to our curation team.", "success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSubmitting(false);
    }, 1000);
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 flex-grow w-full space-y-10">
      {/* Header section */}
      <div className="border-b border-[#d9d2c6]/40 pb-6">
        <span className="text-[10px] tracking-[0.25em] text-[#c46c42] uppercase font-bold">Get In Touch</span>
        <h1 className="text-3xl font-display font-semibold text-[#111827] mt-1">Contact Curation</h1>
        <p className="text-xs text-[#667085] mt-0.5">Submit inquiries, request host verification, or ask curation questions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Contact Form */}
        <div className="lg:col-span-7 bg-white border border-[#d9d2c6]/60 p-6 rounded-2xl shadow-sm space-y-5">
          <h2 className="text-sm uppercase tracking-wider font-bold text-[#111827] border-b border-[#d9d2c6]/30 pb-2">Send Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Your Name *</span>
                <input
                  type="text"
                  placeholder="E.g. Chris Duarte"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Email address *</span>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Subject *</span>
              <input
                type="text"
                placeholder="E.g. Listing verification inquiry, platform feedback..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Message details *</span>
              <textarea
                placeholder="Write your request, listing notes, or questions in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-lg h-32 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none resize-none"
                required
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#1d4d45] hover:bg-[#153832] text-white py-2.5 text-xs font-bold shadow transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send size={13} />
              <span>{submitting ? "Sending message..." : "Submit Message"}</span>
            </button>
          </form>
        </div>

        {/* Right Column - Contact info cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Curation Office Card */}
          <div className="bg-white border border-[#d9d2c6]/60 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-[#111827]">Editorial Office</h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex gap-3">
                <Mail size={16} className="text-forest shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[9px] uppercase font-bold text-[#667085]">Email support</span>
                  <a href="mailto:hello@apexloom.studio" className="text-[#111827] hover:underline font-semibold">
                    hello@apexloom.studio
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin size={16} className="text-forest shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[9px] uppercase font-bold text-[#667085]">Curation center</span>
                  <p className="text-[#111827] font-semibold leading-relaxed">
                    Lisbon Design District, Suite 404<br />
                    Principe Real, Lisbon, Portugal
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <MessageSquare size={16} className="text-forest shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[9px] uppercase font-bold text-[#667085]">Press & Curation applications</span>
                  <a href="mailto:curators@apexloom.studio" className="text-[#111827] hover:underline font-semibold">
                    curators@apexloom.studio
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ Card */}
          <div className="bg-[#f5f2ea]/40 border border-[#d9d2c6]/60 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-forest">
              <HelpCircle size={16} />
              <h3 className="text-xs uppercase tracking-wider font-bold">Frequently Asked</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <strong className="block text-[#111827] text-[11px]">How long is review response?</strong>
                <p className="text-[#667085] text-[10px] mt-0.5">We respond to curated stay application reviews within 3 working days.</p>
              </div>
              <div>
                <strong className="block text-[#111827] text-[11px]">Can I edit a stay after addition?</strong>
                <p className="text-[#667085] text-[10px] mt-0.5">Yes, hosts can update or delete listings directly from the dashboard controls.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
