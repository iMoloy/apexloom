import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import { Stay } from "@/models/Stay";

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  await connectToDatabase();
  const stay = await Stay.findOne({ slug: params.slug }).lean();
  if (!stay) {
    return NextResponse.json({ error: "Stay not found" }, { status: 404 });
  }
  return NextResponse.json({ stay });
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await connectToDatabase();
  const stay = await Stay.findOne({ slug: params.slug }).lean();

  if (!stay) {
    return NextResponse.json({ error: "Stay not found." }, { status: 404 });
  }

  // Allow deleting if user is host and owns it, or is admin
  const isOwner = stay.ownerEmail === user.email;
  const isAdmin = user.email === "admin@apexloom.com";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden. You do not own this curated listing." }, { status: 403 });
  }

  await Stay.findOneAndDelete({ slug: params.slug });
  return NextResponse.json({ message: "Stay listing deleted successfully." });
}
