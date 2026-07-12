import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const userPayload = {
      userId: `user-${Date.now()}`,
      email,
      name,
      role: role === "host" ? ("host" as const) : ("guest" as const),
    };

    const token = signToken(userPayload);
    const response = NextResponse.json({ message: "Registration successful.", user: userPayload });
    
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Failed to process registration details." }, { status: 400 });
  }
}
