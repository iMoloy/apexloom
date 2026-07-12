import { NextRequest, NextResponse } from "next/server";
import { deleteStay, getStays } from "@/lib/dbStays";
import { getUserFromRequest } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { slug } = await context.params;
  const stays = getStays();
  const stay = stays.find((s) => s.slug === slug);

  if (!stay) {
    return NextResponse.json({ error: "Stay not found." }, { status: 404 });
  }

  // Allow deleting if user is host and owns it, or is admin
  const isOwner = stay.ownerEmail === user.email;
  const isAdmin = user.email === "admin@apexloom.com";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden. You do not own this curated listing." }, { status: 403 });
  }

  const deleted = deleteStay(slug);
  if (deleted) {
    return NextResponse.json({ message: "Stay listing deleted successfully." });
  }
  return NextResponse.json({ error: "Failed to delete listing." }, { status: 500 });
}
