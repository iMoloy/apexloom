import mongoose from "mongoose";

export interface FavoriteRecord {
  userEmail: string;
  staySlug: string;
}

const FavoriteSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  staySlug: { type: String, required: true },
}, {
  timestamps: true,
  collection: "favorites"
});

// Compound unique index to prevent duplicate favorites
FavoriteSchema.index({ userEmail: 1, staySlug: 1 }, { unique: true });

export const Favorite = (mongoose.models.Favorite || mongoose.model<FavoriteRecord>("Favorite", FavoriteSchema)) as mongoose.Model<FavoriteRecord>;
