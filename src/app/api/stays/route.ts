import { NextRequest, NextResponse } from "next/server";
import { getStays, addStay } from "@/lib/dbStays";
import { getUserFromRequest } from "@/lib/auth";
import type { StayItem } from "@/data/stays";

export async function GET(req: NextRequest) {
  const list = getStays();
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

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newStay: StayItem & { ownerEmail: string } = {
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
    };

    addStay(newStay);

    return NextResponse.json({ message: "Curated stay added successfully.", stay: newStay }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid listing parameters." }, { status: 400 });
  }
}
