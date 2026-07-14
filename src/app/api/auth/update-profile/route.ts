import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { photoURL, name } = await req.json();

    const updatedUser = {
      ...user,
      ...(photoURL && { photoURL }),
      ...(name && { name }),
    };

    const token = signToken(updatedUser);
    
    const response = NextResponse.json({ message: "Profile updated successfully.", user: updatedUser });
    
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
