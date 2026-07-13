import type { Metadata } from "next";
import { ExploreFilters } from "@/components/stays/ExploreFilters";
import { Pagination } from "@/components/stays/Pagination";
import { StayGrid } from "@/components/stays/StayGrid";
import { filterAndPaginateStays } from "@/lib/staysServer";

type ExplorePageProps = {
  searchParams: Promise<{
    search?: string;
    collection?: string;
    location?: string;
    sort?: string;
    page?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse curated ApexLoom stays with live filtering, sorting, and pagination.",
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolvedParams = await searchParams;
  const currentSearch = resolvedParams.search ?? "";
  const currentCollection = resolvedParams.collection ?? "";
  const currentLocation = resolvedParams.location ?? "";
  const currentSort = resolvedParams.sort ?? "featured";
  const currentPage = Number(resolvedParams.page ?? "1") || 1;

  const result = await filterAndPaginateStays({
    search: currentSearch,
    collection: currentCollection,
    location: currentLocation,
    sort: currentSort,
    page: currentPage,
  });

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <p className="section-kicker">Explore stays</p>
        <h1>Find the right stay by mood, setting, and practical fit.</h1>
        <p>
          Search by city, narrow the collection, compare locations, and sort the
          catalog the way guests naturally decide.
        </p>
        <div className="catalog-hero__strip">
          <span>8 editorial stays live</span>
          <span>2 filters + sorting + pagination</span>
          <span>Public details on every listing</span>
        </div>
      </section>

      <section className="catalog-shell">
        <ExploreFilters
          collection={currentCollection}
          location={currentLocation}
          search={currentSearch}
          sort={currentSort}
        />

        <div className="catalog-results">
          <div className="catalog-results__header">
            <div>
              <p className="section-kicker">Catalog results</p>
              <h2>{result.totalItems} stays matched your current view.</h2>
            </div>
            <span className="catalog-page-indicator">
              Page {result.currentPage} of {result.totalPages}
            </span>
          </div>

          <StayGrid items={result.items} />

          <Pagination
            currentPage={result.currentPage}
            searchParams={{
              search: currentSearch || undefined,
              collection: currentCollection || undefined,
              location: currentLocation || undefined,
              sort: currentSort || undefined,
            }}
            totalPages={result.totalPages}
          />
        </div>
      </section>
    </main>
  );
}
