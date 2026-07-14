import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import { Booking } from "@/models/Booking";
import { Stay } from "@/models/Stay";
import { sendEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  
  await connectToDatabase();
  const bookings = await Booking.find({ userEmail: user.email }).sort({ bookedAt: -1 }).lean();
  
  // Attach stay imageUrl to each booking record
  const bookingsWithImages = await Promise.all(
    bookings.map(async (booking) => {
      const stay = await Stay.findOne({ slug: booking.staySlug }, "imageUrl").lean();
      return {
        ...booking,
        imageUrl: stay?.imageUrl || "",
      };
    })
  );
  
  return NextResponse.json({ bookings: bookingsWithImages });
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

    await connectToDatabase();
    const stay = await Stay.findOne({ slug: staySlug }).lean();

    if (!stay) {
      return NextResponse.json({ error: "Curated stay not found." }, { status: 404 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalPaid = stay.pricePerNight * diffDays + 80; // Standard curation and support fee

    const bookingRecord = new Booking({
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
      status: "confirmed",
    });

    await bookingRecord.save();

    // Trigger confirmation email
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #c9a96e; text-align: center;">ApexLoom Booking Confirmed</h1>
        <p>Hi ${user.name},</p>
        <p>Your curated stay at <strong>${stay.title}</strong> is confirmed!</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Location:</strong> ${stay.location}, ${stay.country}</p>
          <p><strong>Check-in:</strong> ${checkIn}</p>
          <p><strong>Check-out:</strong> ${checkOut}</p>
          <p><strong>Guests:</strong> ${guests}</p>
          <p><strong>Total Paid:</strong> $${totalPaid}</p>
        </div>
        <p>You can manage your reservation in the <a href="https://apexloom.vercel.app/profile" style="color: #c9a96e; text-decoration: none;">Member Portal</a>.</p>
        <p>Thank you for choosing ApexLoom.</p>
      </div>
    `;
    
    // We send it asynchronously so we don't block the response
    sendEmail({
      to: user.email,
      subject: `Booking Confirmed: ${stay.title}`,
      html: emailHtml,
    }).catch(console.error);

    return NextResponse.json({ message: "Booking registered successfully.", booking: bookingRecord }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid booking request." }, { status: 400 });
  }
}
