import mongoose from "mongoose";

export interface BookingRecord {
  id: string;
  staySlug: string;
  stayTitle: string;
  stayLocation: string;
  userEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPaid: number;
  bookedAt: string;
  status: "confirmed" | "cancelled";
  imageUrl?: string;
}

const BookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  staySlug: { type: String, required: true },
  stayTitle: { type: String, required: true },
  stayLocation: { type: String, required: true },
  userEmail: { type: String, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  guests: { type: Number, required: true },
  totalPaid: { type: Number, required: true },
  bookedAt: { type: String, required: true },
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
}, {
  timestamps: true,
  collection: "bookings"
});

export const Booking = (mongoose.models.Booking || mongoose.model<BookingRecord>("Booking", BookingSchema)) as mongoose.Model<BookingRecord>;
