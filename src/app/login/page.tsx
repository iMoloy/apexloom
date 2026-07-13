"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/components/AppContext";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, showToast } = useApp();

  const redirectPath = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Welcome back, ${data.user.name}!`, "success");
        login(data.user);
        router.push(redirectPath);
      } else {
        setError(data.error || "Invalid credentials.");
        showToast(data.error || "Login failed.", "error");
      }
    } catch (err) {
      setError("A connection error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoFill = (role: "host" | "guest") => {
    if (role === "host") {
      setEmail("host@apexloom.com");
      setPassword("host123");
    } else {
      setEmail("guest@apexloom.com");
      setPassword("guest123");
    }
    setError("");
    showToast(`Seeded ${role.toUpperCase()} credentials.`, "info");
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-16 bg-gradient-to-b from-[#faf9f6] to-[#f4eff0]/40">
      <div className="w-full max-w-md bg-white border border-[#d9d2c6]/60 p-8 rounded-2xl shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] tracking-[0.2em] text-[#c46c42] uppercase font-bold">Member Portal</span>
          <h1 className="text-3xl font-display font-semibold text-[#111827] tracking-tight">Welcome back</h1>
          <p className="text-xs text-[#667085]">Sign in to manage your listings and curated experiences.</p>
        </div>

        {/* Local Error Card */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-lg flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Email address</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#667085]/60 pointer-events-none">
                <Mail size={15} />
              </span>
              <input
                type="email"
                placeholder="curator@apexloom.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none transition-all"
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block font-bold">Password</span>
              <span className="text-[10px] text-[#c46c42] hover:underline cursor-pointer">Forgot?</span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#667085]/60 pointer-events-none">
                <Lock size={15} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none transition-all"
                disabled={submitting}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#1d4d45] hover:bg-[#153832] text-white py-2.5 text-xs font-bold shadow transition-colors cursor-pointer disabled:opacity-50"
          >
            <LogIn size={14} />
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Demo Accounts Panel */}
        <div className="border-t border-[#d9d2c6]/40 pt-4 space-y-2">
          <div className="flex items-center justify-center gap-1 text-[10px] text-[#667085] uppercase tracking-wider font-bold">
            <Sparkles size={11} className="text-[#c46c42]" />
            <span>Fast Evaluation Seeds</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAutoFill("host")}
              className="py-2 border border-[#d9d2c6] hover:bg-neutral-50 text-[10px] text-[#111827] rounded-lg font-bold transition-colors cursor-pointer"
              type="button"
            >
              Host / Curation Demo
            </button>
            <button
              onClick={() => handleAutoFill("guest")}
              className="py-2 border border-[#d9d2c6] hover:bg-neutral-50 text-[10px] text-[#111827] rounded-lg font-bold transition-colors cursor-pointer"
              type="button"
            >
              Guest / Traveler Demo
            </button>
          </div>
        </div>

        {/* Sign Up Redirect */}
        <div className="text-center text-xs text-[#667085]">
          New to ApexLoom?{" "}
          <Link href="/register" className="text-[#c46c42] font-semibold hover:underline">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-xs font-semibold text-[#667085]">Resolving portal details...</div>}>
      <LoginContent />
    </Suspense>
  );
}
