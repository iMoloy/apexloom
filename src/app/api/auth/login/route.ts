import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Mock accounts check
    let userPayload = null;
    
    if (email === "host@apexloom.com" && password === "host123") {
      userPayload = { userId: "user-host-1", email, name: "Leonie Fischer", role: "host" as const };
    } else if (email === "guest@apexloom.com" && password === "guest123") {
      userPayload = { userId: "user-guest-2", email, name: "Nadia Rahman", role: "guest" as const };
    } else if (email === "admin@apexloom.com" && password === "admin123") {
      userPayload = { userId: "user-admin-3", email, name: "System Administrator", role: "host" as const };
    } else {
      // Dynamic fallback for custom registered users
      const simpleName = email.split("@")[0];
      const capitalized = simpleName.charAt(0).toUpperCase() + simpleName.slice(1);
      // Allow host or guest registration fallback based on address
      const role = email.includes("host") ? "host" as const : "guest" as const;
      userPayload = { userId: `user-${Date.now()}`, email, name: capitalized, role };
    }

    const token = signToken(userPayload);
    const response = NextResponse.json({ message: "Login successful.", user: userPayload });
    
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Invalid credentials or request format." }, { status: 400 });
  }
}
