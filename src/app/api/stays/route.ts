import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import type { StayItem } from "@/data/stays";
import connectToDatabase from "@/lib/mongoose";
import { Stay } from "@/models/Stay";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const list = await Stay.find({}).sort({ publishedOn: -1 }).lean();
  return NextResponse.json({ items: list });
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user || user.role !== "host") {
    return NextResponse.json({ error: "Unauthorized. Host account required." }, { status: 401 });
  }

  try {
    const data = await req.json();
    const {
      title,
      location,
      country,
      collection,
      stayType,
      pricePerNight,
      shortDescription,
      fullDescription,
      hostNote,
      bestFor,
      guestCount,
      bedrooms,
      baths,
      amenities,
      imageUrl,
      loungeImageUrl,
      suiteImageUrl,
    } = data;

    if (
      !title ||
      !location ||
      !country ||
      !collection ||
      !stayType ||
      !pricePerNight ||
      !shortDescription ||
      !fullDescription ||
      !hostNote ||
      !bestFor ||
      !guestCount ||
      !bedrooms ||
      !baths
    ) {
      return NextResponse.json({ error: "All required specifications must be filled." }, { status: 400 });
    }

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    let slug = baseSlug;
    let counter = 1;
    
    await connectToDatabase();
    
    while (await Stay.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newStay = new Stay({
      slug,
      title,
      location,
      country,
      collection,
      stayType,
      pricePerNight: Number(pricePerNight),
      rating: 5.0,
      reviewCount: 1,
      publishedOn: new Date().toISOString().slice(0, 10),
      shortDescription,
      fullDescription,
      hostNote,
      bestFor,
      guestCount: Number(guestCount),
      bedrooms: Number(bedrooms),
      baths: Number(baths),
      featured: false,
      amenities: Array.isArray(amenities) ? amenities : [],
      galleryLabels: ["Entrance", "Living room", "Suite bedroom"],
      reviews: [
        {
          author: user.name,
          role: "Curator Host",
          rating: 5,
          quote: "Welcome to this newly curated editorial retreat.",
        },
      ],
      ownerEmail: user.email,
      imageUrl,
      loungeImageUrl,
      suiteImageUrl,
    });

    await newStay.save();

    return NextResponse.json({ message: "Curated stay added successfully.", stay: newStay }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid listing parameters." }, { status: 400 });
  }
}
