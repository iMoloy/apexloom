"use client";

import React, { useState } from "react";
import { useApp } from "@/components/AppContext";
import { Mail, MapPin, Send, MessageSquare } from "lucide-react";

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
    setTimeout(() => {
      showToast("Thank you! Your message has been sent to our curation team.", "success");
      setName(""); setEmail(""); setSubject(""); setMessage("");
      setSubmitting(false);
    }, 1000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    background: "var(--surface-2)",
    border: "1px solid var(--border-2)",
    borderRadius: 8,
    color: "var(--text)",
    fontSize: "0.875rem",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 6,
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--text-3)",
  };

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 96px" }}>
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>
            Get In Touch
          </span>
          <h1 style={{ margin: "0 0 12px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>
            Contact Curation
          </h1>
          <p style={{ margin: 0, color: "var(--text-2)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 500 }}>
            Submit inquiries, request host verification, or ask curation questions.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>
          {/* Form */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 32 }}>
            <h2 style={{ margin: "0 0 24px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", paddingBottom: 18, borderBottom: "1px solid var(--border)" }}>
              Send a message
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Your Name</label>
                  <input type="text" placeholder="Chris Duarte" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required disabled={submitting} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required disabled={submitting} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Subject</label>
                <input type="text" placeholder="How can we help?" value={subject} onChange={(e) => setSubject(e.target.value)} style={inputStyle} required disabled={submitting} />
              </div>

              <div>
                <label style={labelStyle}>Message</label>
                <textarea
                  placeholder="Describe your inquiry in detail…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
                  required
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "14px",
                  background: submitting ? "var(--surface-3)" : "var(--gold)",
                  color: submitting ? "var(--text-3)" : "var(--bg)",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                <Send size={16} />
                {submitting ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>

          {/* Info sidebar */}
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { icon: <Mail size={18} />, label: "Email us", value: "hello@apexloom.studio", sub: "We reply within 24 hours" },
              { icon: <MapPin size={18} />, label: "Based in", value: "Lisbon, Portugal", sub: "Editorial HQ" },
              { icon: <MessageSquare size={18} />, label: "Live chat", value: "Bottom-right widget", sub: "Editorial team online" },
            ].map((item) => (
              <div key={item.label} style={{ padding: 20, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>{item.label}</p>
                  <p style={{ margin: "0 0 2px", fontWeight: 600, color: "var(--text)", fontSize: "0.9rem" }}>{item.value}</p>
                  <p style={{ margin: 0, color: "var(--text-3)", fontSize: "0.78rem" }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
