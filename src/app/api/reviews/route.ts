import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import { Stay } from "@/models/Stay";

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { staySlug, rating, quote } = data;

    if (!staySlug || !rating || !quote) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    await connectToDatabase();

    const stay = await Stay.findOne({ slug: staySlug });
    if (!stay) {
      return NextResponse.json({ error: "Stay not found." }, { status: 404 });
    }

    // Add the new review
    const newReview = {
      author: user.name,
      role: user.role === "host" ? "Curator Host" : "Guest",
      quote,
      rating,
    };

    stay.reviews.push(newReview);

    // Recalculate average rating
    const totalRating = stay.reviews.reduce((sum: number, rev: any) => sum + rev.rating, 0);
    // Round to 1 decimal place
    stay.rating = Math.round((totalRating / stay.reviews.length) * 10) / 10;
    stay.reviewCount = stay.reviews.length;

    await stay.save();

    return NextResponse.json({ message: "Review added successfully.", review: newReview }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid review parameters." }, { status: 400 });
  }
}
