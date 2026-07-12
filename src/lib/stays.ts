import { stayItems, type StayItem } from "@/data/stays";
import { getStays } from "@/lib/dbStays";

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

export function getFeaturedStays(limit = 4) {
  const currentStays = getStays();
  return currentStays.filter((stay) => stay.featured).slice(0, limit);
}

export function getStayBySlug(slug: string) {
  const currentStays = getStays();
  return currentStays.find((stay) => stay.slug === slug);
}

export function getRelatedStays(stay: StayItem, limit = 4) {
  const currentStays = getStays();
  const related = currentStays.filter(
    (item) => item.slug !== stay.slug && item.collection === stay.collection,
  );

  return [...related, ...currentStays.filter((item) => item.slug !== stay.slug)]
    .filter((item, index, array) => array.findIndex((entry) => entry.slug === item.slug) === index)
    .slice(0, limit);
}

export function buildStayArtUrl(slug: string, scene: string) {
  return `/stay-art/${slug}?scene=${scene}`;
}

export function filterAndPaginateStays({
  search = "",
  collection = "",
  location = "",
  sort = "featured",
  page = 1,
  pageSize = 8,
}: ExploreQuery): ExploreResult {
  const currentStays = getStays();
  const normalizedSearch = search.trim().toLowerCase();
  const normalizedCollection = collection.trim().toLowerCase();
  const normalizedLocation = location.trim().toLowerCase();

  let filtered = currentStays.filter((stay) => {
    const searchable = [
      stay.title,
      stay.location,
      stay.country,
      stay.collection,
      stay.stayType,
      stay.bestFor,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = normalizedSearch
      ? searchable.includes(normalizedSearch)
      : true;
    const matchesCollection = normalizedCollection
      ? stay.collection.toLowerCase() === normalizedCollection
      : true;
    const matchesLocation = normalizedLocation
      ? `${stay.location}, ${stay.country}`.toLowerCase() === normalizedLocation
      : true;

    return matchesSearch && matchesCollection && matchesLocation;
  });

  filtered = filtered.sort((left, right) => {
    switch (sort) {
      case "price-low":
        return left.pricePerNight - right.pricePerNight;
      case "price-high":
        return right.pricePerNight - left.pricePerNight;
      case "rating":
        return right.rating - left.rating;
      case "latest":
        return right.publishedOn.localeCompare(left.publishedOn);
      case "featured":
      default:
        return Number(right.featured) - Number(left.featured) || right.rating - left.rating;
    }
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    totalItems,
    totalPages,
    currentPage,
  };
}

