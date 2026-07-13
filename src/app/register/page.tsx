"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import { Mail, Lock, User, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login, showToast } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"guest" | "host">("guest");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setError("Please fill in all details.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Registration complete! Welcome, ${data.user.name}.`, "success");
        login(data.user);
        router.push("/");
      } else {
        setError(data.error || "Failed to create account.");
        showToast(data.error || "Signup failed.", "error");
      }
    } catch (err) {
      setError("A connection error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-16 bg-gradient-to-b from-[#faf9f6] to-[#f4eff0]/40">
      <div className="w-full max-w-md bg-white border border-[#d9d2c6]/60 p-8 rounded-2xl shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] tracking-[0.2em] text-[#c46c42] uppercase font-bold">New Account</span>
          <h1 className="text-3xl font-display font-semibold text-[#111827] tracking-tight">Join ApexLoom</h1>
          <p className="text-xs text-[#667085]">Sign up to curated travels and distinct hosting.</p>
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

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Full Name</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#667085]/60 pointer-events-none">
                <User size={15} />
              </span>
              <input
                type="text"
                placeholder="E.g. Nadia Rahman"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none transition-all"
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Email address</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#667085]/60 pointer-events-none">
                <Mail size={15} />
              </span>
              <input
                type="email"
                placeholder="developer@apexloom.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none transition-all"
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">Password</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#667085]/60 pointer-events-none">
                <Lock size={15} />
              </span>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 rounded-lg h-10 border border-[#d9d2c6] text-xs text-[#111827] placeholder-[#667085]/40 focus:border-[#1d4d45] focus:outline-none transition-all"
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5 font-bold">I want to join as</span>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center justify-center py-2 px-3 border rounded-lg text-xs font-bold cursor-pointer transition-colors ${role === "guest" ? "border-[#1d4d45] bg-[#1d4d45]/5 text-[#1d4d45]" : "border-[#d9d2c6] text-[#667085]"}`}>
                <input
                  type="radio"
                  name="role"
                  value="guest"
                  checked={role === "guest"}
                  onChange={() => setRole("guest")}
                  className="sr-only"
                />
                Guest Traveler
              </label>
              <label className={`flex items-center justify-center py-2 px-3 border rounded-lg text-xs font-bold cursor-pointer transition-colors ${role === "host" ? "border-[#1d4d45] bg-[#1d4d45]/5 text-[#1d4d45]" : "border-[#d9d2c6] text-[#667085]"}`}>
                <input
                  type="radio"
                  name="role"
                  value="host"
                  checked={role === "host"}
                  onChange={() => setRole("host")}
                  className="sr-only"
                />
                Host Curator
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#1d4d45] hover:bg-[#153832] text-white py-2.5 text-xs font-bold shadow transition-colors cursor-pointer disabled:opacity-50"
          >
            <UserPlus size={14} />
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Redirect */}
        <div className="text-center text-xs text-[#667085]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#c46c42] font-semibold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
