"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";

type Message = {
  id: string;
  sender: "user" | "curator";
  text: string;
  timestamp: string;
};

const chatSuggestions = [
  { text: "What is a curation score?", key: "score" },
  { text: "How do I become a host?", key: "host" },
  { text: "Are stay rates refundable?", key: "refund" },
];

const curatorAnswers: Record<string, string> = {
  score: "Our curation score represents how well a stay fits our aesthetic principles. Featured properties must score 9.5+ across layout flow, light consistency, and neighborhood guides.",
  host: "To join as a host curator, select the 'Host Curator' role during sign-up. Once logged in, click 'Add stay' to list a property with live previews.",
  refund: "Yes! Bookings are fully refundable up to 7 days before check-in. The curation fee is also returned if the host cancels.",
  default: "Thank you for reaching out! Our editorial team is currently online. If you need immediate assistance, please feel free to email hello@apexloom.studio.",
};

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    setMessages([
      {
        id: "initial",
        sender: "curator",
        text: "Hello! I am your ApexLoom Curation Assistant. How can I help you choose or list curated stays today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  // Scroll messages thread to bottom on change
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string, key?: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((current) => [...current, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Determine reply answer
    let responseKey = "default";
    const normalizedText = text.toLowerCase();

    if (key) {
      responseKey = key;
    } else if (normalizedText.includes("score") || normalizedText.includes("curation")) {
      responseKey = "score";
    } else if (normalizedText.includes("host") || normalizedText.includes("curator") || normalizedText.includes("list")) {
      responseKey = "host";
    } else if (normalizedText.includes("refund") || normalizedText.includes("cancel") || normalizedText.includes("book")) {
      responseKey = "refund";
    }

    setTimeout(() => {
      setIsTyping(false);
      const curatorMsg: Message = {
        id: Math.random().toString(),
        sender: "curator",
        text: curatorAnswers[responseKey] || curatorAnswers.default,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((current) => [...current, curatorMsg]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end">
      {/* Expanded Chat window */}
      {isOpen && (
        <div className="w-80 h-96 bg-[#fffdf8] border border-[#d9d2c6]/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 transition-all animate-fade-in">
          {/* Header */}
          <div className="bg-[#1d4d45] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full bg-[#8fa89d]/20 flex items-center justify-center border border-white/20">
                <Sparkles size={12} className="text-[#f5f2ea]" />
                <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold tracking-wide">Curation Assistant</h4>
                <span className="text-[9px] text-white/70 block">Editorial team online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
              type="button"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages Log */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-[#faf9f6] to-[#f5f2ea]/20">
            {messages.map((msg) => {
              const isCurator = msg.sender === "curator";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${isCurator ? "mr-auto items-start" : "ml-auto items-end"}`}
                >
                  <div
                    className={`p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${isCurator ? "bg-white border border-[#d9d2c6]/40 text-[#111827] rounded-tl-none" : "bg-[#1d4d45] text-white rounded-tr-none"}`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-[#667085]/60 mt-1">{msg.timestamp}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex flex-col mr-auto items-start max-w-[85%]">
                <div className="bg-white border border-[#d9d2c6]/40 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-forest/40 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-forest/45 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-forest/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={threadEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && !isTyping && (
            <div className="p-2 bg-[#f5f2ea]/30 border-t border-[#d9d2c6]/20 flex flex-wrap gap-1.5">
              {chatSuggestions.map((sug) => (
                <button
                  key={sug.key}
                  onClick={() => handleSendMessage(sug.text, sug.key)}
                  className="px-2.5 py-1 text-[9px] font-bold text-forest bg-[#1d4d45]/5 hover:bg-[#1d4d45]/10 border border-[#1d4d45]/15 rounded-full transition-colors cursor-pointer"
                  type="button"
                >
                  {sug.text}
                </button>
              ))}
            </div>
          )}

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-2.5 border-t border-[#d9d2c6]/30 flex gap-2 bg-white"
          >
            <input
              type="text"
              placeholder="Ask about curated stays..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow px-3 rounded-lg border border-[#d9d2c6] text-[11px] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2 bg-[#1d4d45] hover:bg-[#153832] text-white rounded-lg transition-colors cursor-pointer disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-3.5 bg-[#1d4d45] hover:bg-[#153832] text-white rounded-full shadow-2xl transition-all hover:scale-105 duration-200 cursor-pointer"
        type="button"
        aria-label="Toggle curation assistant chat"
      >
        <MessageSquare size={18} />
        {!isOpen && (
          <span className="text-xs font-bold font-sans tracking-wide pr-1 hidden sm:inline">Curation Help</span>
        )}
        <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white animate-pulse" />
      </button>
    </div>
  );
}
