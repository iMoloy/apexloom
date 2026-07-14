import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import { Booking } from "@/models/Booking";

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required." }, { status: 400 });
    }

    await connectToDatabase();
    const booking = await Booking.findOne({ id: bookingId });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    // Verify ownership
    if (booking.userEmail !== user.email) {
      return NextResponse.json({ error: "Unauthorized access to this booking." }, { status: 403 });
    }

    if (booking.status === "cancelled") {
      return NextResponse.json({ error: "Booking is already cancelled." }, { status: 400 });
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    return NextResponse.json({ success: true, message: "Booking cancelled successfully.", booking });
  } catch (err) {
    return NextResponse.json({ error: "Invalid cancel request." }, { status: 400 });
  }
}
