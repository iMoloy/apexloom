import fs from "fs";
import path from "path";
import { stayItems, type StayItem } from "@/data/stays";

const DB_DIR = "/home/moy/.gemini/antigravity-ide/brain/1e76cc4f-aab3-460e-9043-afa6d50d2a49/scratch";
const DB_FILE = path.join(DB_DIR, "stays_db.json");

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
}

export interface LocalDatabase {
  stays: StayItem[];
  bookings: BookingRecord[];
}

function ensureDb(): LocalDatabase {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: LocalDatabase = {
      stays: stayItems.map(stay => ({ ...stay, ownerEmail: "host@apexloom.com" })),
      bookings: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    const fallback: LocalDatabase = { stays: stayItems, bookings: [] };
    return fallback;
  }
}

function saveDb(data: LocalDatabase) {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function getStays(): StayItem[] {
  const db = ensureDb();
  return db.stays;
}

export function addStay(stay: StayItem): void {
  const db = ensureDb();
  db.stays.unshift(stay);
  saveDb(db);
}

export function deleteStay(slug: string): boolean {
  const db = ensureDb();
  const index = db.stays.findIndex((s) => s.slug === slug);
  if (index !== -1) {
    db.stays.splice(index, 1);
    saveDb(db);
    return true;
  }
  return false;
}

export function getBookings(): BookingRecord[] {
  const db = ensureDb();
  return db.bookings;
}

export function addBooking(booking: BookingRecord): void {
  const db = ensureDb();
  db.bookings.push(booking);
  saveDb(db);
}

export function getUserBookings(email: string): BookingRecord[] {
  const db = ensureDb();
  return db.bookings.filter((b) => b.userEmail === email);
}
