import mongoose from "mongoose";
import type { StayItem } from "@/data/stays";

const ReviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  role: { type: String, required: true },
  quote: { type: String, required: true },
  rating: { type: Number, required: true },
}, { _id: false });

const StaySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  collection: { type: String, required: true },
  stayType: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  rating: { type: Number, required: true },
  reviewCount: { type: Number, required: true },
  publishedOn: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  hostNote: { type: String, required: true },
  bestFor: { type: String, required: true },
  guestCount: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  baths: { type: Number, required: true },
  featured: { type: Boolean, required: true },
  amenities: [{ type: String, required: true }],
  galleryLabels: [{ type: String, required: true }],
  reviews: [ReviewSchema],
  ownerEmail: { type: String },
  imageUrl: { type: String },
  loungeImageUrl: { type: String },
  suiteImageUrl: { type: String },
}, {
  timestamps: true,
  collection: "stays",
  suppressReservedKeysWarning: true
});

if (mongoose.models.Stay) {
  delete mongoose.models.Stay;
}

export const Stay = mongoose.model<StayItem>("Stay", StaySchema);
