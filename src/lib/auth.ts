import { NextRequest } from "next/server";
import crypto from "crypto";

const SECRET = process.env.JWT_SECRET || "apexloom-development-secret-key-for-cookie-signing";

export interface UserPayload {
  userId: string;
  email: string;
  name: string;
  role: "host" | "guest";
}

export function signToken(payload: UserPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

export function verifyToken(token: string): UserPayload | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;
    
    const expectedSignature = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
    if (signature !== expectedSignature) return null;
    
    const decoded = Buffer.from(data, "base64url").toString("utf-8");
    return JSON.parse(decoded) as UserPayload;
  } catch {
    return null;
  }
}

export function getUserFromRequest(req: NextRequest): UserPayload | null {
  const token = req.cookies.get("auth_token")?.value;
  if (token) {
    return verifyToken(token);
  }
  return null;
}
