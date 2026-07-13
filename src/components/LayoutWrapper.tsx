"use client";

import React from "react";
import { AppProvider, useApp } from "./AppContext";
import { LiveChatWidget } from "./LiveChatWidget";

function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        let borderColor = "";
        let iconColor = "";
        let bgGradient = "";
        
        switch (toast.type) {
          case "success":
            borderColor = "border-[#22c55e]";
            iconColor = "text-[#22c55e]";
            bgGradient = "from-[rgba(34,197,94,0.08)] to-transparent";
            break;
          case "error":
            borderColor = "border-[#ef4444]";
            iconColor = "text-[#ef4444]";
            bgGradient = "from-[rgba(239,68,68,0.08)] to-transparent";
            break;
          case "warning":
            borderColor = "border-[#f59e0b]";
            iconColor = "text-[#f59e0b]";
            bgGradient = "from-[rgba(245,158,11,0.08)] to-transparent";
            break;
          case "info":
          default:
            borderColor = "border-[var(--gold)]";
            iconColor = "text-[var(--gold)]";
            bgGradient = "from-[rgba(201,169,110,0.08)] to-transparent";
            break;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative overflow-hidden flex items-start justify-between gap-4 p-4 rounded-xl border border-white/5 border-l-4 ${borderColor} bg-[#12121a] bg-gradient-to-r ${bgGradient} shadow-[0_20px_60px_rgba(0,0,0,0.7)] transition-all duration-300 transform toast-enter`}
            role="alert"
          >
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
              <div className={`toast-progress-bar ${iconColor.replace('text-', 'bg-')}`} />
            </div>

            <div className="flex gap-3 items-center z-10">
              {toast.type === "success" && (
                <svg xmlns="http://www.w3.org/2000/svg" className={`shrink-0 h-5 w-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {toast.type === "error" && (
                <svg xmlns="http://www.w3.org/2000/svg" className={`shrink-0 h-5 w-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {(toast.type === "info" || toast.type === "warning") && (
                <svg xmlns="http://www.w3.org/2000/svg" className={`shrink-0 h-5 w-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-[0.85rem] font-semibold text-[var(--text)] tracking-wide leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[var(--text-3)] hover:text-[var(--text)] transition-colors shrink-0 text-xs p-1 z-10"
              aria-label="Close alert"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      {children}
      <ToastContainer />
      <LiveChatWidget />
    </AppProvider>
  );
}
