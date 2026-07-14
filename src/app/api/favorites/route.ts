import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import { Favorite } from "@/models/Favorite";
import { Stay } from "@/models/Stay";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await connectToDatabase();
  const favorites = await Favorite.find({ userEmail: user.email }).lean();
  const slugs = favorites.map((f) => f.staySlug);
  
  // Find stay details for all favorited slugs
  const stays = await Stay.find({ slug: { $in: slugs } }).sort({ publishedOn: -1 }).lean();

  return NextResponse.json({ items: stays });
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { staySlug } = await req.json();
    if (!staySlug) {
      return NextResponse.json({ error: "staySlug is required." }, { status: 400 });
    }

    await connectToDatabase();
    
    // Check if stay exists first
    const stayExists = await Stay.exists({ slug: staySlug });
    if (!stayExists) {
      return NextResponse.json({ error: "Curated stay not found." }, { status: 404 });
    }

    const existing = await Favorite.findOne({ userEmail: user.email, staySlug });

    if (existing) {
      // Toggle off: remove favorite
      await Favorite.deleteOne({ _id: existing._id });
      return NextResponse.json({ favorited: false, message: "Removed from favorites." });
    } else {
      // Toggle on: add favorite
      const fav = new Favorite({
        userEmail: user.email,
        staySlug,
      });
      await fav.save();
      return NextResponse.json({ favorited: true, message: "Added to favorites." });
    }
  } catch (err) {
    return NextResponse.json({ error: "Invalid request parameters." }, { status: 400 });
  }
}
