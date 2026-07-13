"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Send } from "lucide-react";

type Message = {
  id: string;
  sender: "user" | "curator";
  text: string;
  timestamp: string;
};

const chatSuggestions = [
  { text: "What is a curation score?", key: "score" },
  { text: "How do I become a host?", key: "host" },
  { text: "Are stays refundable?", key: "refund" },
];

const curatorAnswers: Record<string, string> = {
  score: "Our curation score represents how well a stay fits our aesthetic principles. Featured properties must score 9.5+ across layout flow, light consistency, and neighborhood guides.",
  host: "To join as a host curator, select the 'Host Curator' role during sign-up. Once logged in, click 'Add stay' to list a property with live previews.",
  refund: "Yes! Bookings are fully refundable up to 7 days before check-in. The curation fee is also returned if the host cancels.",
  default: "Thank you for reaching out! Our editorial team is currently online. If you need immediate assistance, please feel free to email hello@apexloom.studio.",
};

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const threadEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([{
    id: "initial",
    sender: "curator",
    text: "Hello! I'm your ApexLoom Curation Assistant. How can I help you choose or list curated stays today?",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = useCallback((text: string, key?: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((current) => [...current, userMsg]);
    setInputText("");
    setIsTyping(true);

    let responseKey = "default";
    const normalizedText = text.toLowerCase();
    if (key) responseKey = key;
    else if (normalizedText.includes("score") || normalizedText.includes("curation")) responseKey = "score";
    else if (normalizedText.includes("host") || normalizedText.includes("list")) responseKey = "host";
    else if (normalizedText.includes("refund") || normalizedText.includes("cancel") || normalizedText.includes("book")) responseKey = "refund";

    setTimeout(() => {
      setIsTyping(false);
      const curatorMsg: Message = {
        id: Math.random().toString(),
        sender: "curator",
        text: curatorAnswers[responseKey] || curatorAnswers.default,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((current) => [...current, curatorMsg]);
    }, 1200);
  }, []);

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9990, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            width: 320,
            height: 400,
            background: "var(--surface)",
            border: "1px solid var(--border-2)",
            borderRadius: 14,
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            marginBottom: 14,
          }}
        >
          {/* Header */}
          <div style={{ background: "var(--surface-3)", borderBottom: "1px solid var(--border)", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative", width: 28, height: 28, borderRadius: "50%", background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12 }}>✦</span>
                <span style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, background: "#22c55e", borderRadius: "50%", border: "1.5px solid var(--surface)" }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, color: "var(--text)", letterSpacing: "0.02em" }}>Curation Assistant</p>
                <p style={{ margin: 0, fontSize: "0.65rem", color: "var(--text-3)" }}>Editorial team online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} type="button" style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", padding: 4 }} aria-label="Close chat">
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flexGrow: 1, padding: "14px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, background: "var(--bg)" }}>
            {messages.map((msg) => {
              const isCurator = msg.sender === "curator";
              return (
                <div key={msg.id} style={{ display: "flex", flexDirection: "column", maxWidth: "82%", alignSelf: isCurator ? "flex-start" : "flex-end", alignItems: isCurator ? "flex-start" : "flex-end" }}>
                  <div style={{
                    padding: "10px 12px",
                    borderRadius: isCurator ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
                    fontSize: "0.78rem",
                    lineHeight: 1.6,
                    background: isCurator ? "var(--surface-2)" : "var(--gold)",
                    color: isCurator ? "var(--text)" : "var(--bg)",
                    border: isCurator ? "1px solid var(--border)" : "none",
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ marginTop: 4, fontSize: "0.62rem", color: "var(--text-3)" }}>{msg.timestamp}</span>
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: "flex", flexDirection: "column", maxWidth: "82%", alignSelf: "flex-start" }}>
                <div style={{ padding: "10px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "4px 12px 12px 12px", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <span key={i} style={{ width: 5, height: 5, background: "var(--gold)", borderRadius: "50%", opacity: 0.7, animation: `bounce 1s ${delay}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={threadEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && !isTyping && (
            <div style={{ padding: "8px 10px", borderTop: "1px solid var(--border)", background: "var(--surface)", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {chatSuggestions.map((sug) => (
                <button
                  key={sug.key}
                  type="button"
                  onClick={() => handleSendMessage(sug.text, sug.key)}
                  style={{ padding: "5px 10px", fontSize: "0.7rem", fontWeight: 600, background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 99, color: "var(--gold)", cursor: "pointer" }}
                >
                  {sug.text}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
            style={{ padding: "10px 10px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, background: "var(--surface)" }}
          >
            <input
              type="text"
              placeholder="Ask about curated stays…"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
              style={{ flexGrow: 1, padding: "8px 12px", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 8, color: "var(--text)", fontSize: "0.78rem" }}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              aria-label="Send message"
              style={{ padding: "8px 10px", background: "var(--gold)", border: "none", borderRadius: 8, color: "var(--bg)", cursor: "pointer", opacity: !inputText.trim() || isTyping ? 0.4 : 1 }}
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label="Toggle curation assistant chat"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 18px",
          background: "var(--gold)",
          color: "var(--bg)",
          border: "none",
          borderRadius: 99,
          boxShadow: "0 8px 32px rgba(201,169,110,0.3)",
          cursor: "pointer",
          fontWeight: 700,
          fontSize: "0.82rem",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--gold-2)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--gold)"; }}
      >
        <MessageSquare size={17} />
        {!isOpen && <span>Chat with us</span>}
        <span style={{ position: "absolute", top: 2, right: 2, width: 9, height: 9, background: "#22c55e", borderRadius: "50%", border: "1.5px solid var(--bg)", animation: "pulse 2s infinite" }} />
      </button>
    </div>
  );
}
