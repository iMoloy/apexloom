import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, name, provider } = await req.json();

    if (!email || !name || !provider) {
      return NextResponse.json({ error: "Missing required profile fields." }, { status: 400 });
    }

    // Assign a guest role by default for social login, unless their email indicates they are a host
    const role = email.toLowerCase().includes("host") ? "host" : "guest";
    
    // Create the user payload
    const userPayload = {
      userId: `user-${provider}-${Date.now()}`,
      email,
      name,
      role: role as "host" | "guest",
    };

    const token = signToken(userPayload);
    const response = NextResponse.json({ message: "Social login successful.", user: userPayload });
    
    // Set our custom JWT cookie just like normal login
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Invalid request format." }, { status: 400 });
  }
}
