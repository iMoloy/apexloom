"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/components/AppContext";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, showToast } = useApp();

  const redirectPath = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);



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
    } catch {
      setError("A connection error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = async (type: "google") => {
    if (!auth) {
      showToast("Firebase is not configured.", "error");
      return;
    }
    
    let provider = googleProvider;

    setGoogleLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const res = await fetch("/api/auth/social-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email || `${user.uid}@${type}.com`,
          name: user.displayName || `${type.charAt(0).toUpperCase() + type.slice(1)} User`,
          provider: type,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Welcome, ${data.user.name}!`, "success");
        login(data.user);
        router.push(redirectPath);
      } else {
        setError(data.error || "Social login failed.");
        showToast(data.error || "Login failed.", "error");
      }
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(`${type.charAt(0).toUpperCase() + type.slice(1)} sign in failed.`);
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} sign in failed.`, "error");
      }
    } finally {
      setGoogleLoading(false);
    }
  };



  const handleAutoFill = async (role: "host" | "guest") => {
    const demEmail = role === "host" ? "host@apexloom.com" : "guest@apexloom.com";
    const demPass = role === "host" ? "host123" : "guest123";
    
    setEmail(demEmail);
    setPassword(demPass);
    setError("");
    setSubmitting(true);
    showToast(`Logging in as ${role.toUpperCase()}...`, "info");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demEmail, password: demPass }),
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
    } catch {
      setError("A connection error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px 12px 40px",
    background: "var(--surface-2)",
    border: "1px solid var(--border-2)",
    borderRadius: 8,
    color: "var(--text)",
    fontSize: "0.9rem",
  };

  return (
    <div style={{ minHeight: "calc(100vh - 72px)", display: "grid", gridTemplateColumns: "1.1fr 1fr", background: "var(--bg)" }} className="login-split">
      <style>{`
        @media (max-width: 900px) {
          .login-split {
            grid-template-columns: 1fr !important;
          }
          .login-cover {
            display: none !important;
          }
        }
      `}</style>

      {/* Left side cover photo */}
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }} className="login-cover">
        <Image
          src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80"
          alt="Luxury living space"
          fill
          unoptimized
          style={{ objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,8,16,0.92) 0%, rgba(8,8,16,0.45) 100%)" }} />
        <div style={{ position: "absolute", bottom: 48, left: 48, right: 48, zIndex: 10 }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>
            Featured Stay
          </span>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2.4rem", fontWeight: 600, color: "var(--text)", marginTop: 8, marginBottom: 12, lineHeight: 1.15 }}>
            The Solenne House, Lisbon
          </h2>
          <p style={{ color: "var(--text-3)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 440 }}>
            &ldquo;An inspiring workspace surrounded by old-world beauty. Everything is designed to make slow living effortless.&rdquo;
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Kicker */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{ display: "inline-block", padding: "5px 14px", border: "1px solid rgba(201,169,110,0.25)", borderRadius: 99, background: "rgba(201,169,110,0.08)", color: "var(--gold)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
              Member Portal
            </span>
            <h1 style={{ margin: "0 0 10px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2.2rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>
              Welcome back
            </h1>
            <p style={{ margin: 0, color: "var(--text-3)", fontSize: "0.875rem" }}>
              Sign in to manage your listings and curated experiences.
            </p>
          </div>

          {/* Card */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            {/* Error */}
            {error && (
              <div style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#fca5a5", fontSize: "0.84rem" }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: "grid", gap: 18 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
                  Email address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  padding: "13px",
                  background: submitting ? "var(--surface-3)" : "var(--gold)",
                  color: submitting ? "var(--text-3)" : "var(--bg)",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: submitting ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  marginTop: 4,
                }}
              >
                <LogIn size={16} />
                {submitting ? "Signing in…" : "Sign In"}
              </button>
            </form>

            {/* Social Login Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: "0.72rem", color: "var(--text-3)", fontWeight: 600, whiteSpace: "nowrap" }}>OR CONTINUE WITH</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

             <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 24 }}>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  disabled={googleLoading || submitting}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "14px",
                    background: "var(--surface)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: googleLoading || submitting ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: "0.72rem", color: "var(--text-3)", fontWeight: 600, whiteSpace: "nowrap" }}>DEMO ACCOUNTS</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            {/* Autofill seeds */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                type="button"
                onClick={() => handleAutoFill("host")}
                style={{ padding: "10px", border: "1px solid var(--border-2)", borderRadius: 8, background: "var(--surface-2)", color: "var(--text-2)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              >
                Host Demo
              </button>
              <button
                type="button"
                onClick={() => handleAutoFill("guest")}
                style={{ padding: "10px", border: "1px solid var(--border-2)", borderRadius: 8, background: "var(--surface-2)", color: "var(--text-2)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              >
                Guest Demo
              </button>
            </div>
          </div>

          {/* Sign up link */}
          <p style={{ textAlign: "center", marginTop: 24, color: "var(--text-3)", fontSize: "0.84rem" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "var(--gold)", fontWeight: 600 }}>
              Create one <ArrowRight size={12} style={{ display: "inline", verticalAlign: "middle" }} />
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)" }}>Loading…</div>}>
      <LoginContent />
    </Suspense>
  );
}
