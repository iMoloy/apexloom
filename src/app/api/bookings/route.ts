import { NextRequest, NextResponse } from "next/server";
import { addBooking, getUserBookings, getStays } from "@/lib/dbStays";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const bookings = getUserBookings(user.email);
  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { staySlug, checkIn, checkOut, guests } = await req.json();

    if (!staySlug || !checkIn || !checkOut || !guests) {
      return NextResponse.json({ error: "All booking details are required." }, { status: 400 });
    }

    const stays = getStays();
    const stay = stays.find((s) => s.slug === staySlug);

    if (!stay) {
      return NextResponse.json({ error: "Curated stay not found." }, { status: 404 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalPaid = stay.pricePerNight * diffDays + 80; // Standard curation and support fee

    const bookingRecord = {
      id: `booking-${Date.now()}`,
      staySlug,
      stayTitle: stay.title,
      stayLocation: `${stay.location}, ${stay.country}`,
      userEmail: user.email,
      checkIn,
      checkOut,
      guests: Number(guests),
      totalPaid,
      bookedAt: new Date().toISOString(),
    };

    addBooking(bookingRecord);

    return NextResponse.json({ message: "Booking registered successfully.", booking: bookingRecord }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid booking request." }, { status: 400 });
  }
}
