import { stayItems, type StayItem } from "@/data/stays";

export type ExploreQuery = {
  search?: string;
  collection?: string;
  location?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export type ExploreResult = {
  items: StayItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
};

export const collectionOptions = Array.from(
  new Set(stayItems.map((stay) => stay.collection)),
);

export const locationOptions = Array.from(
  new Set(stayItems.map((stay) => `${stay.location}, ${stay.country}`)),
);

export function buildStayArtUrl(slug: string, scene: string) {
  return `/stay-art/${slug}?scene=${scene}`;
}
