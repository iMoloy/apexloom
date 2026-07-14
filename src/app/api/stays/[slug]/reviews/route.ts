import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import { Stay } from "@/models/Stay";

export async function POST(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { quote, rating } = await req.json();
    if (!quote || !rating) {
      return NextResponse.json({ error: "Review comment and rating are required." }, { status: 400 });
    }

    const ratingVal = Number(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json({ error: "Rating must be a number between 1 and 5." }, { status: 400 });
    }

    await connectToDatabase();
    const stay = await Stay.findOne({ slug: params.slug });
    if (!stay) {
      return NextResponse.json({ error: "Stay not found." }, { status: 404 });
    }

    // Append the new review
    const newReview = {
      author: user.name,
      role: user.role === "host" ? "Curator Host" : "Guest",
      rating: ratingVal,
      quote,
    };

    stay.reviews = stay.reviews || [];
    stay.reviews.push(newReview);

    // Recalculate average rating and reviewCount
    const totalRating = stay.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    const avgRating = (totalRating / stay.reviews.length).toFixed(1);
    
    stay.rating = Number(avgRating);
    stay.reviewCount = stay.reviews.length;

    await stay.save();

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully.",
      reviews: stay.reviews,
      rating: stay.rating,
      reviewCount: stay.reviewCount,
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid review parameters." }, { status: 400 });
  }
}
