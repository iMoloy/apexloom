"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import { Mail, Lock, User, UserPlus, ArrowRight } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider, twitterProvider, appleProvider } from "@/lib/firebase";

export default function RegisterPage() {
  const router = useRouter();
  const { login, showToast } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"guest" | "host">("guest");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
    } catch {
      setError("A connection error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = async (type: "google" | "facebook" | "twitter" | "apple") => {
    if (!auth) {
      showToast("Firebase is not configured.", "error");
      return;
    }
    
    let provider;
    if (type === "google") provider = googleProvider;
    else if (type === "facebook") provider = facebookProvider;
    else if (type === "twitter") provider = twitterProvider;
    else provider = appleProvider;

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
        showToast(`Registration complete! Welcome, ${data.user.name}.`, "success");
        login(data.user);
        router.push("/");
      } else {
        setError(data.error || "Social login failed.");
        showToast(data.error || "Signup failed.", "error");
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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px 12px 40px",
    background: "var(--surface-2)",
    border: "1px solid var(--border-2)",
    borderRadius: 8,
    color: "var(--text)",
    fontSize: "0.9rem",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 6,
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--text-3)",
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
          src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
          alt="Curated architecture"
          fill
          unoptimized
          style={{ objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,8,16,0.92) 0%, rgba(8,8,16,0.45) 100%)" }} />
        <div style={{ position: "absolute", bottom: 48, left: 48, right: 48, zIndex: 10 }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>
            The Curation Standard
          </span>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2.4rem", fontWeight: 600, color: "var(--text)", marginTop: 8, marginBottom: 12, lineHeight: 1.15 }}>
            Spaces built for focus
          </h2>
          <p style={{ color: "var(--text-3)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 440 }}>
            &ldquo;A home is more than a place to sleep. It is a container for memories, design appreciation, and quiet conversation. Join us to find yours.&rdquo;
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{ display: "inline-block", padding: "5px 14px", border: "1px solid rgba(201,169,110,0.25)", borderRadius: 99, background: "rgba(201,169,110,0.08)", color: "var(--gold)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
              New Account
            </span>
            <h1 style={{ margin: "0 0 10px", fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2.2rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>
              Join ApexLoom
            </h1>
            <p style={{ margin: 0, color: "var(--text-3)", fontSize: "0.875rem" }}>
              Create an account for curated travel and distinct hosting.
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

            <form onSubmit={handleRegister} style={{ display: "grid", gap: 16 }}>
              {/* Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <User size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
                  <input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email address</label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
                  <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
                  <input type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required minLength={6} />
                </div>
              </div>

              {/* Role */}
              <div>
                <label style={{ ...labelStyle, marginBottom: 10 }}>I am joining as</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {(["guest", "host"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      style={{
                        padding: "12px",
                        border: `1px solid ${role === r ? "var(--gold)" : "var(--border-2)"}`,
                        borderRadius: 8,
                        background: role === r ? "rgba(201,169,110,0.1)" : "var(--surface-2)",
                        color: role === r ? "var(--gold)" : "var(--text-2)",
                        fontWeight: 700,
                        fontSize: "0.84rem",
                        cursor: "pointer",
                        textTransform: "capitalize",
                        transition: "all 0.2s",
                      }}
                    >
                      {r === "guest" ? "🧳 Guest" : "🏠 Host"}
                    </button>
                  ))}
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
                <UserPlus size={16} />
                {submitting ? "Creating account…" : "Create Account"}
              </button>
            </form>

            {/* Social Login Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: "0.72rem", color: "var(--text-3)", fontWeight: 600, whiteSpace: "nowrap" }}>OR CONTINUE WITH</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                {
                  type: "google",
                  label: "Google",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  ),
                },
                {
                  type: "apple",
                  label: "Apple ID",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z"/>
                    </svg>
                  ),
                },
                {
                  type: "facebook",
                  label: "Facebook",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ),
                },
                {
                  type: "twitter",
                  label: "X (Twitter)",
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleSocialLogin(item.type as any)}
                  disabled={googleLoading || submitting}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "11px",
                    background: "var(--surface)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    cursor: googleLoading || submitting ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sign in link */}
          <p style={{ textAlign: "center", marginTop: 24, color: "var(--text-3)", fontSize: "0.84rem" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--gold)", fontWeight: 600 }}>
              Sign in <ArrowRight size={12} style={{ display: "inline", verticalAlign: "middle" }} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
