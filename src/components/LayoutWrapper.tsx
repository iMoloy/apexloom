"use client";

import React from "react";
import { AppProvider, useApp } from "./AppContext";
import { LiveChatWidget } from "./LiveChatWidget";

function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        let typeClasses = "";
        
        switch (toast.type) {
          case "success":
            typeClasses = "border-forest/30 bg-emerald-50/90 text-forest";
            break;
          case "error":
            typeClasses = "border-clay/30 bg-rose-50/90 text-clay";
            break;
          case "warning":
            typeClasses = "border-amber-500/30 bg-amber-50/90 text-amber-900";
            break;
          case "info":
          default:
            typeClasses = "border-gray-300 bg-white/95 text-ink";
            break;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-4 p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 transform translate-y-0 animate-fade-in ${typeClasses}`}
            role="alert"
          >
            <div className="flex gap-2.5 items-start">
              {toast.type === "success" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-5 w-5 text-forest mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {toast.type === "error" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-5 w-5 text-clay mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {(toast.type === "info" || toast.type === "warning") && (
                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-5 w-5 text-ink/70 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-xs font-semibold leading-relaxed">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-ink/40 hover:text-ink/80 transition-colors shrink-0 text-xs mt-0.5 p-0.5"
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
