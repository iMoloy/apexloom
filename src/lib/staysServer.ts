import connectToDatabase from "./mongoose";
import { Stay } from "@/models/Stay";
import { Booking } from "@/models/Booking";
import { type StayItem, stayItems } from "@/data/stays";
import type { ExploreQuery, ExploreResult } from "./stays";

// Seed default stays if the database is empty
async function seedDefaultStays() {
  await connectToDatabase();
  const count = await Stay.countDocuments();
  if (count === 0) {
    const staysWithOwner = stayItems.map(stay => ({ ...stay, ownerEmail: "host@apexloom.com" }));
    await Stay.insertMany(staysWithOwner);
    console.log("Seeded database with default stays");
  }
}

export async function getFeaturedStays(limit = 4): Promise<StayItem[]> {
  await seedDefaultStays();
  const stays = await Stay.find({ featured: true }).sort({ rating: -1 }).limit(limit).lean();
  return stays as unknown as StayItem[];
}

export async function getStayBySlug(slug: string): Promise<StayItem | null> {
  await seedDefaultStays();
  const stay = await Stay.findOne({ slug }).lean();
  return stay ? (stay as unknown as StayItem) : null;
}

export async function getRelatedStays(stay: StayItem, limit = 4): Promise<StayItem[]> {
  await seedDefaultStays();
  const related = await Stay.find({
    slug: { $ne: stay.slug },
    collection: stay.collection
  }).limit(limit).lean();

  let results = related as unknown as StayItem[];

  if (results.length < limit) {
    const more = await Stay.find({
      slug: { $nin: [stay.slug, ...results.map(r => r.slug)] }
    }).limit(limit - results.length).lean();
    results = [...results, ...more as unknown as StayItem[]];
  }

  return results;
}

export async function filterAndPaginateStays({
  search = "",
  collection = "",
  location = "",
  sort = "featured",
  page = 1,
  pageSize = 8,
  minPrice,
  maxPrice,
  checkIn = "",
  checkOut = "",
}: ExploreQuery): Promise<ExploreResult> {
  await seedDefaultStays();
  
  const query: any = {};

  // Price Range Filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.pricePerNight = {};
    if (minPrice !== undefined) {
      query.pricePerNight.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined) {
      query.pricePerNight.$lte = Number(maxPrice);
    }
  }

  // Date Availability Filter
  if (checkIn && checkOut) {
    const overlappingBookings = await Booking.find({
      status: { $ne: "cancelled" },
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn }
    }, "staySlug").lean();

    const bookedStaySlugs = overlappingBookings.map(b => b.staySlug);
    query.slug = { $nin: bookedStaySlugs };
  }

  if (collection) {
    query.collection = new RegExp(`^${collection}$`, 'i');
  }

  if (location) {
    // Basic string matching for "City, Country"
    query.$or = [
      { location: new RegExp(location.split(',')[0], 'i') },
      { country: new RegExp(location.split(',')[0], 'i') }
    ];
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    const existingOr = query.$or || [];
    query.$or = [
      ...existingOr,
      { title: searchRegex },
      { location: searchRegex },
      { country: searchRegex },
      { collection: searchRegex },
      { stayType: searchRegex },
      { bestFor: searchRegex }
    ];
  }

  let sortQuery: any = {};
  switch (sort) {
    case "price-low": sortQuery = { pricePerNight: 1 }; break;
    case "price-high": sortQuery = { pricePerNight: -1 }; break;
    case "rating": sortQuery = { rating: -1 }; break;
    case "latest": sortQuery = { publishedOn: -1 }; break;
    case "featured":
    default: sortQuery = { featured: -1, rating: -1 }; break;
  }

  const totalItems = await Stay.countDocuments(query);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  const items = await Stay.find(query)
    .sort(sortQuery)
    .skip(start)
    .limit(pageSize)
    .lean();

  return {
    items: items as unknown as StayItem[],
    totalItems,
    totalPages,
    currentPage,
  };
}
